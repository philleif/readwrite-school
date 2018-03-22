"use strict"

const images = require("../lib/images")
const db = require("../lib/db")

function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms))
}

const run = async () => {
  try {
    let words = await db.Word.find({})

    for (let word of words) {
      try {
        let terms = word.word

        if (word.imageWord != "") {
          terms = word.imageWord // overwrite default search term
        }

        let response = await images.search(terms)

        word.image = response.url
        word.imageCredit = response.credit

        await word.save()

        console.log(word)
      } catch (error) {
        console.log(error)
      }
    }
  } catch (error) {
    throw error
  }
}

run()
