const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b3llw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()

app.use(bodyParser.json())
app.use(cors())
const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const playersCollection = client.db("playerHire").collection("players");

    app.post('/addPlayer', (req, res) => {
        const player = req.body;
        playersCollection.insertMany(player)
            .then(result => {
                res.send(result.insertedCount)
            })
    })
    app.get('/players', (req, res) => {
        const search = req.query.search;
        playersCollection.find({name: {$regex: search}})
            // .limit(5)
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/player/:key', (req, res) => {
        playersCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })


    app.post('/playerByKeys', (req, res) => {
        const playerKeys = req.body;
        playersCollection.find({key: req.body.key})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })


});


app.listen(process.env.PORT || port)