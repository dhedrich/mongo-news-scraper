var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var cheerio = require('cheerio')
var mongoose = require('mongoose')
var exphbs = require('express-handlebars');

// require all models
var db = require('./models')

// initialize express
var app = express();
var PORT = 3000

// set up handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }))

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"))
app.use(bodyParser.json())

// connect to mongoose
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise
mongoose.connect(MONGODB_URI).then(console.log('connected to database!'))

// render homepage
app.get('/', function (req, res) {
    res.render('home')
})

// GET route to scrape articles from NY Times World section
app.get('/scrape', function (req, res) {
    var $ = cheerio.load('<div>Hello world!</div>')
    var newsUrl = 'https://www.nytimes.com/section/world?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=World&WT.nav=page'
    
    request(newsUrl, function (e, r, html) {
        if (e) throw e
        var $ = cheerio.load(html)
    
        $('a.story-link').each(function (i, el) {
            var headline = $(el).children('.story-meta').children('h2.headline').text().trim()
            var summary = $(el).children('.story-meta').children('p.summary').text().trim()
            var link = $(el).attr('href')
    
            var newEntry = {}
            newEntry.headline = headline
            newEntry.summary = summary
            newEntry.url = link
    
            db.Article.create(newEntry).then(function (dbArticle) {
                console.log(dbArticle)
            }).catch(function (e) {
                if (e) res.json(e)
            })
        })
    })
})


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!")
})
