const debug = require('debug');


const log = debug('namespace1')

const express = require('express');

const app = express();
app.get('/', (req, res) => {
    log('wow')
    res.json({ x: 10})
})

app.get('/enable', (req, res) => {
    if(!req.query.tag) return res.json({
        message: 'req.query.tag missing'
    })
    debug.enable(req.query.tag);
    res.json({ status: debug.enabled('*') })
})

app.get('/disable', (req, res) => {
    log('wow')
    debug.disable();
    res.json({ status: debug.enabled('*') })
})


app.listen(8090, () => {
    console.log('express listeing at http://localhost:8090')
})
