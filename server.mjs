'use strict'

import 'dotenv/config'
import express, { query } from "express"
import bodyParser from "express";
import {pool} from "./db.mjs";
import path from "path";
import finnhub from "finnhub";
import http from "https"

const api_key = finnhub.ApiClient.instance.authentications['api_key']
api_key.apiKey = process.env.API
const finnhubClient = new finnhub.DefaultApi()

const app = express()
const PORT = process.env.PORT || 5000
const db = pool

app.use(express.urlencoded({
    extended: true
}))
app.use(express.static('style'))
app.use(express.static(path.join('./', 'ui', 'build')))
app.use(bodyParser.json())
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile('./ui/build/index.html')
})

// get company news from finnhub for a given stock
app.get('/news/:stock', (req, res) => {
    let stock = req.params.stock
    let start = req.query.start_dt
    let end = req.query.end_dt

    finnhubClient.companyNews(stock, start, end, (err, data, response) => {
        if (err) {
            res.status(500).json(err)
        }
        else {
            res.status(200).json(data)
        }
    })
})

// gets company financial data from finnhub
app.get('/financials/:stock', (req, res) => {
    let stock = req.params.stock
    finnhubClient.companyBasicFinancials(stock, "D", (error, data, response) => {
        if (data === null) {return res.status(404).json({})}
        return res.status(200).json(data.metric)
    })
})

// gets candle data for a given stock from finnhub
app.get('/candles', (req, res) => {
    let stock = req.query.symbol, start_dt = req.query.start, end_dt = req.query.end, resolution = req.query.resolution
    finnhubClient.stockCandles(stock, resolution, start_dt, end_dt, (error, data, response) => {
        if (data === undefined || data === null || data.s === "no_data" || data.length === 0) {
            return res.status(400).json({"Error": "No Data."})
        }
        let new_data = [], volume_data = []
        for (let i = 0; i < data.t.length; i++) {
            new_data[i] = {x: data.t[i], y: [data.l[i], data.c[i], data.o[i], data.h[i]]}
            volume_data[i] = {x: data.t[i], y: data.v[i]}
        }
        return res.status(200).json([new_data, volume_data])
    });
})

// registers a new user to the application
app.post('/register', (req, res) => {
    let username = req.body.username, password = req.body.password
    db.query(`SELECT id, username from users where username='${username}'`, (err, results) => {
        if (results.length > 0) {
            return res.status(403).json({'error':'Username already exists.'})
        }
        db.query(`insert into users (username, password) values ('${username}', '${password}')`, (err, results) => {
            return res.status(200).json({'username':`${username}`})
    })})
})

// logs a user into the application
app.post('/login', (req, res) => {
    let username = req.body.username, password = req.body.password
    db.query(`SELECT username from users where username='${username}' and password='${password}'`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        } else if (results.length > 0) {
            return res.status(201).json({
                'username': username
        })}
        return res.status(404).json({'error': 'Invalid username or password.'})
    })
})

// gets all stocks in a user's portfolio from the db
app.get('/portfolio/:username', (req, res) => {
    let username = req.params.username
    db.query(`SELECT stock from portfolio where user_id=(SELECT id from users where username='${username}')`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        }
        return res.status(200).json(results)
    })
})

// creates an entry in a user's portfolio in the db
app.post('/portfolio/:username/:stock', (req, res) => {
    let username = req.params.username, stock = req.params.stock
    db.query(`INSERT into portfolio (user_id, stock) values ((SELECT id from users where username='${username}'), '${stock}')`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        } else {
            return res.status(201).json({
                "symbol": stock
    })}})
})

// deletes a stock from a user's portfolio in the db
app.delete('/portfolio/:username/:stock', (req, res) => {
    let username = req.params.username, stock = req.params.stock
    db.query(`SELECT * from portfolio where user_id=(SELECT id from users where username='${username}') and stock='${stock}'`, (err, results) => {
        if (results.length === 0) {
            return res.status(404).json({'error': "Stock not found or not associated with this user's portfolio."})
        }
        db.query(`DELETE from portfolio where user_id=(SELECT id from users where username='${username}') and stock='${stock}'`, (err, results) => {
            if (err) {
                return res.status(500).json({'error': err})
            } else {
                return res.status(204).json({"msg":"Success."})
    }})})
})

// gets all stocks in a user's watchlist from the db.
app.get('/watchlist/:username', (req, res) => {
    let username = req.params.username
    db.query(`SELECT stock from watchlist where user_id=(SELECT id from users where username='${username}')`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        }
        return res.status(200).json(results)
    })
})

// adds a stock to a user's watchlist in the database
app.post('/watchlist/:username/:stock', (req, res) => {
    let username = req.params.username, stock = req.params.stock
    db.query(`INSERT into watchlist (user_id, stock) values ((SELECT id from users where username='${username}'), '${stock}')`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        } else {
            return res.status(204).json({'msg': "Success."})
    }})
})

// Deletes a stock from a user's watchlist in the database
app.delete('/watchlist/:username/:stock', (req, res) => {
    let username = req.params.username, stock = req.params.stock
    db.query(`SELECT * from watchlist where user_id=(SELECT id from users where username='${username}') and stock='${stock}'`, (err, results) => {
        if (results.length === 0) {
            return res.status(404).json({'error': "Stock not found or not associated with this user's watchlist."})
        }
        db.query(`DELETE from watchlist where user_id=(SELECT id from users where username='${username}') and stock='${stock}'`, (err, results) => {
            if (err) {
                return res.status(500).json({'error': err})
            } else {
                return res.status(204).json({"msg":"Success."})
    }})})
})

// gets the current price of a given symbol using partner's microservice endpoint
// formats the response for the front end react code.
app.get('/quote/:symbol', (req, res) => {
    let stock = req.params.symbol
    http.get(`https://maxpreh.pythonanywhere.com/${stock.toUpperCase()}`, response => {
        if (response.statusCode == 200) {
            let rawData = ''
            response.on('data', chunk => {rawData += chunk})
            response.on('end', () => {
                let jsonData = JSON.parse(rawData)
                return res.status(200).json({c:jsonData.market_price})
            })
        }
        else {return res.status(500).json({"error": "error"})}
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})