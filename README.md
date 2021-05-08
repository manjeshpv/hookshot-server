# hookshot-server

Depending on [axios-concurrency](https://www.npmjs.com/package/axios-concurrency), [axios-retry](https://www.npmjs.com/package/axios-retry)

### Clients
- Axios Plugin
- Guzzle plugin

# Research
- https://slack.engineering/scaling-slacks-job-queue/

### Related Projects
- https://github.com/realadeel/awesome-webhooks
- https://github.com/CompSciLauren/awesome-webhooks
- https://github.com/Automattic/kue
- https://github.com/OptimalBits/bull

uuid will be generated
- in parallel
  - data will be queued 
  - stored into mongodb for requeuing, debugging etc
- https://github.com/adnanh/webhook

### Combination 1: Rehook, Automattic/Kue, node-webhooks
- lambda hits


### Combination 2: AWS SQS
### Combination 3: Kafka

### Approach: Kannel
- Write events to table: kannel_queue
- upon success write the data to table: kannel_logs and delete from  kannel_queue

## Use cases
1. Aftership webhook/public webhooks
2. Core service generic webhooks
3. Developer Simplicity - Setup & Run in minute without bothering about it at all
4. Nice UI like Rundesk
4. Abstraction to developer
5. Maintainablity and Pluggable storage - Cost for Startups(Linode/Digital Ocean/AWS)
  - support for in-memory, file storage, redis, rabbitmq, AWS SQS
6. Vendor Lockin

## Features:
-  JSON Rules to filter events at subscribers
-  JSON Transformermation Pipeline
-  Components like in https://github.com/jstemmer/rehook/ for subscriptions

### Usage
Open source event ingestion and dispatch server with minimal design to handle scale and simplicity with cost efficiency

## Architecture
by [Hookdeck](https://hookdeck.io/)
![Hookdeck](https://uploads-ssl.webflow.com/5f8144f15100b7a30e10dbcf/5f8a1ee2d61003d3efaf93b1_Group%20116.svg)

## Related Projects
- SQNS (Simple Queue And Notification Server) [yog27ray/sqns](https://github.com/yog27ray/sqns)
- https://webhookrelay.com/

## Other keywords:
- Postman for PubSub
