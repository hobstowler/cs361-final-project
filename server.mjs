'use strict'

import 'dotenv/config'
import express, { query } from "express"
import bodyParser from "express";
import {pool} from "./db.js";
import path from "path";

const app = express()
const PORT = process.env.PORT
const API = process.env.API
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

app.post('/register', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    db.query(`SELECT username from users where username=${username}`, (err, results) => {
        if (results.length > 0) {
            return res.status(403).json({'error':'Username already exists.'})
        }
        db.query(`insert into users (username, password) values (${username}, ${password})`, (err, results) => {
            return res.status(200).json({'username':`${username}`})
        })
    })
})

app.post('/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    db.query(`SELECT username from users where username=${username} and password=${password}`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        } else if (results.length > 0) {
            return res.status(204).json({
                'username': username,
                'apiKey': API
            })
        }
        return res.status(404).json({'error': 'Invalid username or password.'})
    })
})

app.get('/portfolio/:username', (req, res) => {
    username = req.params.username
    db.query(`SELECT stock from portfolio where username=${username}`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        } else {

        }
    })
})

app.post('/portfolio/:username/:stock', (req, res) => {
    username = req.params.username
    stock = req.params.stock
    db.query(`INSERT into portfolio (username, stock) values (${username}, ${stock})`, (err, results) => {
        if (err) {
            return res.status(500).json({'error': err})
        } else {

        }
    })
})

app.delete('/portfolio/:username/:stock', (req, res) => {
    username = req.params.username
    stock = req.params.stock
    db.query(`DELETE from portfolio where username=${username} and stock={stock}`, (err, results) => {
        if (err) {
            return res.status(500).json({'error':err})
        } else {

        }
    })
})

app.get('/watchlist/:username', (req, res) => {
    username = req.params.username

})

app.post('/watchlist/:username/:stock', (req, res) => {
    username = req.params.username
    stock = req.params.stock

})

app.delete('/watchlist/:username/:stock', (req, res) => {
    username = req.params.username
    stock = req.params.stock

})

app.get('/stock/:symbol', (req, res) => {
    stock = req.params.symbol

})

app.get('/stock/detail/:symbol', (req, res) =>{
    stock = req.params.symbol
})

app.list(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})