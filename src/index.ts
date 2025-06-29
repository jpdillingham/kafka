import express from 'express';
import { KafkaJS } from '@confluentinc/kafka-javascript';

const { Kafka } = KafkaJS;

const producer = new Kafka().producer({
  'bootstrap.servers': 'localhost:9092,localhost:9093'
});

var consumer = new Kafka().consumer({
  'bootstrap.servers': 'localhost:9092,localhost:9093',
  'group.id': 'kafka-test',
});

const app = express();
app.use(express.json());
const port = 3000;

app.get('/', (req, res) => {
  res.status(200).send();
});

app.post('/produce', async (req, res) => {
  try {
    const deliveryReports = await producer.send({
        topic: 'default',
        messages: [
          { value: 'v1', key: 'x' },
        ]
    });
    
    res.json({ success: true, message: 'Message sent to Kafka', deliveryReports });
  } catch (error) {
    console.error('Error producing message:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

await producer.connect();

await consumer.connect().then(() => {
  consumer.subscribe({ topic: 'default' });

  consumer.run({
    eachMessage: async ({ topic, partition, message }: any) => {
      console.log({
        topic,
        partition,
        headers: message.headers,
        offset: message.offset,
        key: message.key?.toString(),
        value: message.value?.toString(),
        message,
      });
    }
  });
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

const shutDown = () => {
  producer.disconnect();
  consumer.disconnect();
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
