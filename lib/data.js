"use strict"

require("dotenv").config()

const axios = require("axios")
const language = require("@google-cloud/language")
const natural = require("natural")

const NYT_API_KEY = process.env.NYT_API_KEY
const client = new language.LanguageServiceClient()

const fetchArticles = async () => {
  let date = new Date()
  let month = date.getMonth()
  let text = ""

  await axios
    .get(
      "http://api.nytimes.com/svc/archive/v1/2018/" +
        month +
        ".json?api-key=" +
        NYT_API_KEY
    )
    .then(async response => {
      for (let doc of response.data.response.docs.slice(1, 100)) {
        text += " " + doc.snippet
      }
    })

  return cleanText(text)
}

const cleanText = async text => {
  let tokenizer = new natural.WordTokenizer()
  let words = tokenizer.tokenize(text)

  for (let word in words) {
    words[word] = words[word].toLowerCase()
  }

  return words
}

const catalogText = async text => {
  let store = text,
    distribution = {},
    list = []

  store.forEach(function(a) {
    distribution[a] = (distribution[a] || 0) + 1
  })

  for (let node of Object.keys(distribution)) {
    if (node.length > 3) {
      list.push({ word: node, count: distribution[node] })
    }
  }

  list.sort(function(a, b) {
    return a.count - b.count
  })

  // skips some random words
  return list.slice(5, 7) // TODO: use reserved words
}

function char_count(str, letter) {
  var letter_Count = 0
  for (var position = 0; position < str.length; position++) {
    if (str.charAt(position) == letter) {
      letter_Count += 1
    }
  }
  return letter_Count
}

module.exports = {
  fetchArticles,
  catalogText
}
