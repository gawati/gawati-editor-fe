const amqp = require('amqplib/callback_api');

/**
 * Important: mqConfig channels get set in the async calls.
 */
let mqConfig = {
  "exchange" : "doc_publish",
  "IRI_Q": {
    "key": "iriQ",
    "channel": {}
  },
  "STATUS_Q": {
    "key": "statusQ",
    "channel": {}
  }
}
 
function bail(err) {
  console.error(err);
  process.exit(1);
}

function getExchange() {
  return mqConfig.exchange;
}

function getChannel(qName) {
  return mqConfig[qName].channel;
}

function setChannel(qName, ch) {
  mqConfig[qName].channel = ch;
}

function getQKey(qName) {
  return mqConfig[qName].key;
}
 
// Publisher
function publisherIriQ(conn) {
  qName = 'IRI_Q';
  const ex = getExchange();
  const key = getQKey(qName);

  conn.createChannel(onOpen);
  function onOpen(err, channel) {
    if (err != null) bail(err);
    setChannel(qName, channel);
    channel.assertExchange(ex, 'direct', {durable: false});
    //Test Message
    let msg = 'Hello World!';
    channel.publish(ex, key, new Buffer(msg));
    console.log(" [x] Sent %s: '%s'", key, msg);
  }
}
 
// Consumer
function consumerStatusQ(conn) {
  qName = 'IRI_Q';  //Will be changed to STATUS_Q
  const ex = getExchange();
  const key = getQKey(qName);

  conn.createChannel(onOpen);
  function onOpen(err, channel) {
    if (err != null) bail(err);
    channel.assertExchange(ex, 'direct', {durable: false});
    channel.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
      channel.bindQueue(q.queue, ex, key);
      channel.consume(q.queue, function(msg) {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
      }, {noAck: true});

      //For testing only
      publisherIriQ(conn);
    });
  }
}
 
const rabbit = amqp.connect('amqp://localhost', function(err, conn) {
  console.log(" AMQP CONNECTED");
  if (err != null) bail(err);
  consumerStatusQ(conn);
  // publisherIriQ(conn);
});

module.exports = {
    rabbit: rabbit,
    getExchange: getExchange,
    getChannel: getChannel,
    getQKey: getQKey
};