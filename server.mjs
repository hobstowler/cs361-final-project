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
const PORT = process.env.PORT || 4000
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

app.get('/financials/:stock', (req, res) => {
    let stock = req.params.stock
    finnhubClient.companyBasicFinancials(stock, "D", (error, data, response) => {
        res.status(200).json(data.metric)
    })
})

app.get('/quote/:symbol', (req, res) => {
    let stock = req.params.symbol
    finnhubClient.quote(stock, (error, data, response) => {
        if (error) {
            return res.status(500).json(error)
        }

        if (data.c === 0) {
            return res.status(404).json({})
        }
        return res.status(200).json(data)
    })
})

app.post('/register', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    db.query(`SELECT id, username from users where username='${username}'`, (err, results) => {
        if (results.length > 0) {
            return res.status(403).json({'error':'Username already exists.'})
        }
        db.query(`insert into users (username, password) values ('${username}', '${password}')`, (err, results) => {
            return res.status(200).json({'username':`${username}`})
        })
    })
})

app.post('/login', (req, res) => {
    console.log('logging')
    let username = req.body.username
    let password = req.body.password
    db.query(`SELECT username from users where username='${username}' and password='${password}'`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        } else if (results.length > 0) {
            return res.status(201).json({
                'username': username
            })
        }
        return res.status(404).json({'error': 'Invalid username or password.'})
    })
})

app.get('/portfolio/:username', (req, res) => {
    let username = req.params.username
    db.query(`SELECT stock from portfolio where user_id=(SELECT id from users where username='${username}')`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        }
        return res.status(200).json(results)
    })
})

app.post('/portfolio/:username/:stock', (req, res) => {
    let username = req.params.username
    let stock = req.params.stock
    db.query(`INSERT into portfolio (user_id, stock) values ((SELECT id from users where username='${username}'), '${stock}')`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        } else {
            return res.status(201).json({
                "id": id,
                "symbol": stock
            })
        }
    })
})

app.delete('/portfolio/:username/:stock', (req, res) => {
    let username = req.params.username
    let stock = req.params.stock
    db.query(`SELECT * from portfolio where user_id=(SELECT id from users where username='${username}') and stock='${stock}'`, (err, results) => {
        if (results.length === 0) {
            return res.status(404).json({'error': "Stock not found or not associated with this user's portfolio."})
        }
        db.query(`DELETE from portfolio where user_id=${id} and stock='${stock}'`, (err, results) => {
            if (err) {
                return res.status(500).json({'error': err})
            } else {
                return res.status(204).json({"msg":"Success."})
            }
        })
    })
})

app.get('/watchlist/:username', (req, res) => {
    let username = req.params.username
    db.query(`SELECT stock from watchlist where user_id=(SELECT id from users where username='${username}')`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        }
        return res.status(200).json(results)
    })
})

app.post('/watchlist/:username/:stock', (req, res) => {
    let username = req.params.username
    let stock = req.params.stock
    console.log(username, stock)
    db.query(`INSERT into watchlist (user_id, stock) values ((SELECT id from users where username='${username}'), '${stock}')`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        } else {
            return res.status(201).json({
                "id": id,
                "symbol": stock
            })
        }
    })
})

app.delete('/watchlist/:username/:stock', (req, res) => {
    let username = req.params.username
    let stock = req.params.stock
    db.query(`SELECT * from watchlist where user_id=(SELECT id from users where username='${username}') and stock='${stock}'`, (err, results) => {
        if (results.length === 0) {
            return res.status(404).json({'error': "Stock not found or not associated with this user's watchlist."})
        }
        db.query(`DELETE from watchlist where user_id=${id} and stock='${stock}'`, (err, results) => {
            if (err) {
                return res.status(500).json({'error': err})
            } else {
                return res.status(204).json({"msg":"Success."})
            }
        })
    })
})

app.get('/stock/simple/:symbol', (req, res) => {
    let stock = req.params.symbol
    // TODO stub out for partner
})

app.get('/quote/:symbol', (req, res) => {
    let stock = req.params.symbol
    http.get(`http://maxpreh.pythonanywhere.com/${stock.toUpperCase()}`, response => {
        if (response.statusCode == 200) {
            let rawData = ''
            response.on('data', chunk => {
                rawData += chunk
            })
            response.on('end', () => {
                return res.status(200).json(rawData)
            })
        }
        else {
            return res.status(500).json({"error": "error"})
        }
    })
    /*finnhubClient.quote(stock, (error, data, response) => {
        if (error) {
            return res.status(500).json(error)
        }
        return res.status(200).json(data)
    })*/
})

app.get('/stock/detail/:symbol', (req, res) =>{
    let stock = req.params.symbol
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})