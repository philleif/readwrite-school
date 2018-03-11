"use strict"

require("dotenv").config()

const axios = require("axios")
const images = require("../lib/images")
const data = require("../lib/data")
const db = require("../lib/db")
const Translate = require("@google-cloud/translate")
const WordNet = require("node-wordnet")
const natural = require("natural")

const projectId = "citizen-capital"

const translate = new Translate({
  projectId: projectId
})

const NYT_API_KEY = process.env.NYT_API_KEY

const run = async () => {
  // clear wordlist
  await db.Word.remove({}, function() {})

  // fetch words from NYT
  let text = await data.fetchArticles()

  text = await data.catalogText(text)

  for (let node of text) {
    let word = new db.Word({
      word: node.word,
      image: await images.search(node.word),
      synonyms: await wordNetAsync(node.word),
      translations: {
        french: await fetchTranslations(node.word, "fr"),
        arabic: await fetchTranslations(node.word, "ar"),
        spanish: await fetchTranslations(node.word, "es"),
        chinese: await fetchTranslations(node.word, "zh-CN"),
        urdu: await fetchTranslations(node.word, "ur")
      }
    })

    console.log("Saving word...")

    word.save()
  }
}

const fetchTranslations = async (text, lang) => {
  return new Promise((resolve, reject) => {
    translate
    .translate(text, lang)
    .then(results => {
      const translation = results[0]

      resolve(translation)
    })
    .catch(err => {
      reject(err)
    })
  })
}

const wordNetAsync = async word => {
  return new Promise((resolve, reject) => {
    let wordnet = new WordNet()

    wordnet.lookup(word, function(results) {
      results.forEach(function(result) {
        resolve(result.synonyms)
      })
    })
  })
}

run()
