var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var cheerio = require('cheerio')
var mongoose = require('mongoose')

// require all models
var db = require('./models')

// initialize express
var app = express()

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }))
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"))

