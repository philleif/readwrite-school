"use strict"

const db = require("../lib/db")

const run = async () => {
  try {
    let words = await db.Word.find({})

    for(let word of words) {
      word.imageWord = ""
      await word.save()
    }
  } catch (error) {
    console.log(error)
  }
}

run()
