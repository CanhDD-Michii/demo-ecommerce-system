# Kafka Interview Questions – Big Tech Focus

## 1. Kafka là gì? Tại sao sử dụng Kafka?
- Kafka là distributed streaming platform để gửi, nhận, lưu trữ và xử lý luồng dữ liệu thời gian thực.

## 2. Partition & Topic
- Partition quyết định parallelism và scalability.
- Topic là channel logic cho producer gửi và consumer đọc message.
- Partition phân chia dựa trên **key** của message hoặc round-robin nếu key null.
- Mỗi partition là **log tuần tự**, message được đánh số bằng **offset**.

## 3. Số lượng partition và topic
- Chọn đủ để tận dụng parallelism nhưng tránh overhead.
- Không có con số cố định, phụ thuộc throughput và số lượng consumer trong group.
- Partition nhiều hơn consumer trong group → một số consumer đọc nhiều partition.

## 4. Key trong Kafka
- Key quyết định partition của message.
- Chọn key liên quan tới entity cần ordering, ví dụ `userId`, `orderId`.
- Nếu không cần ordering, key có thể null → round-robin.

## 5. Consumer & Consumer Group
- Consumer group chia workload và quản lý offset.
- Một consumer có thể đọc nhiều topic:
  - Được phép nhưng workload và ordering cần cân nhắc.
  - Mỗi topic consumer listen riêng, Kafka đảm bảo mỗi partition được assign cho **một consumer trong group**.
- Offset commit riêng cho từng group → các group đọc cùng topic không ảnh hưởng lẫn nhau.

## 6. Offset storage
- Offset lưu trong topic `__consumer_offsets`.
- Commit offset quá thường xuyên gây performance issue vì disk I/O.
- Consumer đọc log theo offset, đánh dấu log đã đọc.

## 7. Log structure và copy message
- Mỗi partition là log tuần tự, mỗi message có offset.
- Consumer đọc log theo offset, có thể replay từ offset cũ.
- Message copy giữa nhiều consumer group là bản chất Kafka lưu message trong log, group khác đọc độc lập.

## 8. Tại sao Kafka cần nhiều partition cho `__consumer_offsets`
- Để scale commits khi nhiều consumer groups.
- Tránh bottleneck ghi offset.

## 9. Kafka authentication & security
- SASL/PLAIN, SASL/SCRAM, SSL.
- Broker không hỗ trợ mechanism → handshake fail.
- External Kafka: cần username/password, security protocol chính xác.

## 10. Kafka với NestJS
- Config clientId, brokers, sasl/ssl.
- Consumer đọc nhiều topic thuộc các group khác nhau.
- Consumer có thể đọc message từ nhiều topic nhưng mỗi topic nên có strategy xử lý riêng.

## 11. Producer gửi message lớn
- Kafka chia message lớn thành nhiều phần.
- Consumer ghép lại để đảm bảo toàn vẹn.
- Thường dùng streaming để gửi/nhận dữ liệu lớn trong microservices.

## 12. Ordering trong Kafka
- Ordering chỉ đảm bảo trong cùng partition.
- Sử dụng key để ensure ordering theo entity.

## 13. Idempotent producer là gì
- Producer gửi lại message mà không tạo duplicate.
- Dùng khi retry message gửi thất bại.

## 14. Exactly-once semantics (EOS)
- Đảm bảo message được process **chính xác một lần**.
- Kết hợp idempotent producer + transactional consumer.

## 15. Kafka Streams vs Consumer API
- Kafka Streams: xử lý stream nâng cao, stateful processing.
- Consumer API: đọc và xử lý message theo logic custom.

## 16. Retention policy trong Kafka
- Log retention theo thời gian hoặc dung lượng.
- Config `log.retention.ms` hoặc `log.retention.bytes`.

## 17. Log compaction
- Giữ message cuối cùng theo key.
- Dùng khi cần reconstruct state thay vì tất cả events.

## 18. Rebalancing trong consumer group
- Khi consumer join/leave → partition reassign.
- Gây pause message consumption tạm thời.
- Khi một consumer đọc nhiều topic, rebalancing diễn ra riêng theo từng topic.

## 19. Dead Letter Queue (DLQ)
- Chứa message lỗi không process được.
- Giúp retry hoặc phân tích lỗi.

## 20. Kafka Connect là gì
- Tool để integrate Kafka với DB, filesystem, hoặc external system.
- Dùng connector source/sink.

## 21. Kafka trong microservices
- Decouple services, đảm bảo asynchronous communication.
- Event-driven architecture giúp scale và resilient.

## 22. Monitoring Kafka
- Theo dõi metrics: lag, throughput, broker health.
- Dùng Prometheus + Grafana hoặc Confluent Control Center.

## 23. Troubleshooting Kafka common issues
- `KafkaJSConnectionClosedError`: network/connectivity hoặc broker down.
- SASL handshake error: check mechanism & credentials.
- Performance issue: quá nhiều commit offset hoặc quá ít partition.

## 24. Best Practices
- Partition vừa đủ, key hợp lý, consumer group scale hợp lý.
- Offset commit định kỳ, security chính xác.
- DLQ cho message lỗi, monitor system liên tục.
- Tránh connect external Kafka trong prod nếu không cần thiết.
- Dùng streaming hoặc gRPC khi gửi message lớn giữa microservices.
- Tối ưu số lượng topic & group theo nhu cầu đọc/ghi.
- Khi consumer đọc nhiều topic, kiểm tra rebalancing và parallelism.

## 25. Scenario / Case-based questions
- Làm thế nào để scale consumer group khi throughput tăng? → tăng partition, thêm consumer, rebalancing.
- Nếu một consumer bị down, message sẽ xử lý thế nào? → partition reassign, consumer khác tiếp tục đọc.
- Làm sao đảm bảo ordering khi message gửi từ nhiều producer? → dùng key cố định cho entity và cùng partition.
- Khi commit offset nhiều gây lag, giải pháp? → commit định kỳ, tăng batch size.
- Một consumer đọc nhiều topic, cách phân chia partition hiệu quả và tránh bottleneck?
  - Sử dụng **round-robin partition assignment** hoặc **sticky assignment** để cân bằng workload.
  - Theo dõi lag từng partition, tránh gán quá nhiều partition cho một consumer.
- Khi nhiều consumer listen cùng một topic, làm sao Kafka copy message cho từng group?
  - Kafka giữ message trong log, mỗi **consumer group đọc riêng**, copy bản chất là đọc từ log không xóa.
- Nếu muốn replay log từ thời điểm cũ, cần làm gì với offset?
  - Reset offset về giá trị cũ hoặc timestamp cần replay, consumer sẽ đọc lại từ offset đó.
- Khi partition số lượng lớn hơn consumer, cách Kafka phân chia workload?
  - Mỗi consumer có thể đọc nhiều partition.
  - Partition assignment algorithm (Range, RoundRobin, Sticky) đảm bảo phân phối cân bằng giữa các consumer trong group.

