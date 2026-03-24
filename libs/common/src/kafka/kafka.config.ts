import { KafkaOptions, Transport } from '@nestjs/microservices';

type SaslMechanism = 'plain' | 'scram-sha-256' | 'scram-sha-512';

export function createKafkaClientOptions(
  clientId: string,
  groupId: string,
): KafkaOptions {
  const brokers = (process.env.KAFKA_BOOTSTRAP_SERVER_URL || 'localhost:29092')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const ssl = JSON.parse(process.env.KAFKA_SSL_ENABLED ?? 'false') as boolean;
  const mechanism = (process.env.KAFKA_SASL_MECHANISM ??
    'scram-sha-256') as SaslMechanism;
  const username = process.env.KAFKA_CLIENT_USERNAME;
  const password = process.env.KAFKA_CLIENT_PASSWORD;

  console.log("==============", { username, password });
  const sasl =
    username && password
      ? mechanism === 'plain'
        ? { mechanism: 'plain' as const, username, password }
        : mechanism === 'scram-sha-512'
          ? { mechanism: 'scram-sha-512' as const, username, password }
          : { mechanism: 'scram-sha-256' as const, username, password }
      : undefined;

  console.log("==============", JSON.stringify({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId,
        brokers,
        ssl,
        sasl,
      },
      consumer: {
        groupId,
      },
      run: {
        autoCommit: false
      }
    },
  }))

  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId,
        brokers,
        ssl,
        sasl,
      },
      consumer: {
        groupId,
      },
      // run: {
      //   autoCommit: false
      // }
    },
  };
}