"use strict"

require("dotenv").config()

const mongoose = require("mongoose")

const DB_URL = process.env.DB_URL


const WordSchema = new mongoose.Schema({
  word: String,
  sentence: String,
  image: String,
  synonyms: Object,
  exp: Object,
  sentence: String,
  section: String,
  subsection: String,
  translations: {
    french: String,
    arabic: String,
    spanish: String,
    chinese: String,
    urdu: String
  }
})

const Word = mongoose.model("Word", WordSchema)

async function run() {
  // No need to `await` on this, mongoose 4 handles connection buffering
  // internally
  mongoose.connect(DB_URL)
}

run().catch(error => console.error(error.stack))

module.exports = {
  Word
}
