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
  try {
    // clear wordlist
    await db.Word.remove({}, function() {})

    // fetch words from NYT
    let text = await data.fetchArticles()
    let dictionary = text.dictionary

    text = await data.catalogText(text.text)

    for (let node of text) {
      //console.log("saving", node.word)

      let wordnet = await wordNetAsync(node.word)

      if (wordnet) {
        let found = dictionary.find(element => {
          return element.word === node.word
        })

        console.log(found)

        let word = new db.Word({
          word: node.word,
          //image: await images.search(node.word),
          synonyms: wordnet.syn,
          exp: wordnet.exp,
          translations: {
            // french: await fetchTranslations(node.word, "fr"),
            // arabic: await fetchTranslations(node.word, "ar"),
            // spanish: await fetchTranslations(node.word, "es"),
            // chinese: await fetchTranslations(node.word, "zh-CN"),
            // urdu: await fetchTranslations(node.word, "ur")
          }
        })

        if(typeof found != "undefined") {
          word.section = found.section
          word.subsection = found.subsection
        }


        word.save()
      }
    }
  } catch (error) {
    throw error
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
      if (results.length < 1) resolve(false)
      results.forEach(function(result) {
        resolve({
          syn: result.synonyms,
          exp: result.exp
        })
      })
    })
  })
}

run()
