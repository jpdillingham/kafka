# kafka
Playing around with kafka

# Notes

* `@confluentinc/kafka-javascript` has a couple of compatibility modes, described [here](https://docs.confluent.io/kafka-clients/javascript/current/overview.html).  tl;dr it works on basically anything, but if it doesn't work for some reason you'll need to install `librdkafka` and set up a keyring.
* Kafka > v3.3 introduced KRaft, and in doing so deprecated zookeeper.  I've left an additional compose file `docker-compose-zookeeper.yml` that includes it, just because.
