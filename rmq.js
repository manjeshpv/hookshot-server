var q = 'tasks';

var open = require('amqplib').connect('amqp://user:bitnami@localhost');

// Publisher
const send = () => {
    open
        .then(function (conn) {
            return conn.createChannel();
        })
        .then(function (ch) {
            return ch
                .assertQueue(q)
                .then(function (ok) {
                    console.log('sent')
                    return ch
                        .sendToQueue(q, Buffer.from('something to do'));
                });
        })
        .catch(console.warn);
}

// Consumer
open
    .then(function (conn) {
        console.log('then')
        return conn.createChannel();
    })
    .then(function (ch) {
        console.log('then2')
        return ch
            .assertQueue(q)
            .then(function (ok) {
                console.log('then3')
                return ch.consume(q, function (msg) {
                    console.log('>>> consumed')
                    if (msg !== null) {
                        console.log(msg.content.toString());
                        ch.ack(msg);
                    }
                });
            });
    }).catch(console.warn);

send()
send()
send()
send()
send()
