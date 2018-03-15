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
      if (typeof word.image === "undefined") {
        word.image = await images.search(word.word)
        await word.save()
        console.log(word)

        await sleep(1000)
      }
    }
  } catch (error) {
    throw error
  }
}

run()