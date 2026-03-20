#!/usr/bin/env bash
set -euo pipefail

KAFKA_DATA_DIR="/var/lib/kafka/data"
KAFKA_CONFIG_DIR="/etc/kafka/kraft"
KAFKA_CONFIG="${KAFKA_CONFIG_DIR}/server.properties"

mkdir -p "${KAFKA_CONFIG_DIR}"
mkdir -p "${KAFKA_DATA_DIR}"

echo "Rendering Kafka config..."

cat > "${KAFKA_CONFIG}" <<EOF
process.roles=broker,controller
node.id=${KAFKA_NODE_ID}

controller.quorum.voters=${KAFKA_NODE_ID}@${KAFKA_INTERNAL_HOST}:${KAFKA_CONTROLLER_PORT}

listeners=INTERNAL://0.0.0.0:${KAFKA_INTERNAL_PORT},EXTERNAL://0.0.0.0:${KAFKA_EXTERNAL_PORT},CONTROLLER://0.0.0.0:${KAFKA_CONTROLLER_PORT}
advertised.listeners=INTERNAL://${KAFKA_INTERNAL_HOST}:${KAFKA_INTERNAL_PORT},EXTERNAL://${KAFKA_EXTERNAL_HOST}:${KAFKA_EXTERNAL_PORT}
listener.security.protocol.map=INTERNAL:SASL_PLAINTEXT,EXTERNAL:SASL_PLAINTEXT,CONTROLLER:PLAINTEXT
controller.listener.names=CONTROLLER
inter.broker.listener.name=INTERNAL

log.dirs=${KAFKA_DATA_DIR}

num.partitions=${KAFKA_NUM_PARTITIONS}
default.replication.factor=${KAFKA_DEFAULT_REPLICATION_FACTOR}
offsets.topic.replication.factor=1
transaction.state.log.replication.factor=1
transaction.state.log.min.isr=1
min.insync.replicas=${KAFKA_MIN_INSYNC_REPLICAS}

sasl.enabled.mechanisms=SCRAM-SHA-256
sasl.mechanism.inter.broker.protocol=SCRAM-SHA-256

listener.name.internal.scram-sha-256.sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username="${KAFKA_INTER_BROKER_USERNAME}" password="${KAFKA_INTER_BROKER_PASSWORD}";
EOF

if [ ! -f "${KAFKA_DATA_DIR}/meta.properties" ]; then
  echo "Formatting KRaft storage with SCRAM users..."

  /opt/kafka/bin/kafka-storage.sh format \
    -t "${KAFKA_CLUSTER_ID}" \
    -c "${KAFKA_CONFIG}" \
    --add-scram "SCRAM-SHA-256=[name=${KAFKA_INTER_BROKER_USERNAME},password=${KAFKA_INTER_BROKER_PASSWORD}]" \
    --add-scram "SCRAM-SHA-256=[name=${KAFKA_CLIENT_USERNAME},password=${KAFKA_CLIENT_PASSWORD}]"
fi

echo "Starting Kafka..."
exec /opt/kafka/bin/kafka-server-start.sh "${KAFKA_CONFIG}"