const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use((req, res) => {
    console.log(req.body, req.method);
    res.sendStatus(201)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
