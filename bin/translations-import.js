"use strict"

require("dotenv").config()

const Translate = require("@google-cloud/translate")
const db = require("../lib/db")

const translate = new Translate({
  projectId: process.env.PROJECT_ID
})

const run = async () => {
  let words = await db.Word.find({})

  for (let word of words) {
    if (typeof word.translations.french === "undefined")
      word.translations.french = await fetchTranslations(word.word, "fr")

    if (typeof word.translations.arabic === "undefined")
      word.translations.arabic = await fetchTranslations(word.word, "ar")

    if (typeof word.translations.spanish === "undefined")
      word.translations.spanish = await fetchTranslations(word.word, "es")

    if (typeof word.translations.chinese === "undefined")
      word.translations.chinese = await fetchTranslations(word.word, "zh-CN")

    if (typeof word.translations.urdu === "undefined")
      word.translations.urdu = await fetchTranslations(word.word, "ur")

    await word.save()

    console.log(word.translations)
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

run()
