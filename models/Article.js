var mongoose = require("mongoose")

// Save a reference to the Schema constructor
var Schema = mongoose.Schema

// create a new article schema
var ArticleSchema = new Schema({
  headline: String,
  summary: String,
  url: String
})

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema)

// Export the Article model
module.exports = Article