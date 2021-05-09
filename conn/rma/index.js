/**
 * Created by Manjesh on 09-08-2016.
 */

const debug = require('debug');
const amqp = require('amqplib');
const request = require('request');
const when = require('when');
const logger = console;
const config = {
    rmq: {
        login: 'user',
        password: 'bitnami',
        host: 'localhost',
        port: 5672
    },
    queues: 'tasks,tasks,/api/tasks,true||',
    DISPATCH_URL_BASE: 'http://localhost:3000'
}

const log = console.log; //debug('conn/rmq');
const connectionString = `amqp://${config.rmq.login}:${config.rmq.password}@${config.rmq.host}:${config.rmq.port}`;

const rmq = {
    amqp,
    connectionString,
    sub: amqp.connect(connectionString),
    connect() {
        return amqp.connect(connectionString);
    },
};

rmq.startWorkers = function () {
    console.log('startWorkers')
    const queues = (config.queues || '').split('||').map(x => x.split(','));
    queues.forEach(que => rmq.sub.then((conn) => {
        if (que.length !== 4) return 'settings error';
        console.log('startWorkers')
        const [id, q, url, listen] = que;
        if (listen === 'true') {
            log('worker started:', id);
            process.once('SIGINT', () => {
                conn.close();
            });
            return conn.createChannel().then((ch) => {
                var exchange = 'topic_logs';
                var cok = ch.assertExchange(exchange, 'topic', {durable: false});

                let ok = cok.then(() => {
                    return ch.assertQueue(q, {
                        exclusive: false,
                        autoDelete: false,
                        durable: true
                    })
                        .then(() => {
                            ch.bindQueue('tasks', exchange, 'tasksRoutingkey');
                        });

                })
        // how rmq know the unique key for mesg
                function doWork(msg) {
                    let message;
                    try {
                        console.log('msg', Object.keys(msg), msg.fields,
                            msg.properties,
                            msg.content.toString(), typeof msg.content.toString())
                        message = JSON.parse(msg.content.toString());
                    } catch (err) {
                        ch.ack(msg);
                        return logger.error('rmq', {err, message});
                    }
                    log('[x] Received', q);
                    return request.post({
                        url: `${config.DISPATCH_URL_BASE}${url}`,
                        json: message,
                    }, (err, res) => {
                        if (~[201, 204, 409, 400].indexOf(res.statusCode)) return ch.ack(msg);
                        rmq.queue({q, message});
                        ch.ack(msg);
                        return logger.error('sqldb:queue-unoconv', {err, res});
                    });
                }

                ok = ok.then(() => {
                    ch.prefetch(1);
                });
                ok = ok.then(() => {
                    ch.consume(q, doWork, {noAck: false});
                    log('[*] Waiting for messages. To exit press CTRL+C');
                });
                return ok;
            });
        }

        return 'rmq:listener not started';
    }).then(null, console.warn));
};

rmq.queue = ({q, body}) => {
    if (!q) return log('rmq.queue: q not found. Bad Request.');
    return rmq
        .connect()
        .then(conn =>
            when(conn
                .createChannel()
                .then((ch) => {


                    return ok.then(() => {
                        ch.sendToQueue(q, new Buffer(JSON.stringify(body)),
                            {deliveryMode: true, contentType: 'application/json'});
                        log('Queued', q);
                        return ch.close();
                    });
                })
            ).ensure(() => {
                conn.close();
            }))
        .then(null, console.log);
};
module.exports = rmq;
rmq.startWorkers()
