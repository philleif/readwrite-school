"use strict"

const fs = require("fs")
const CsvReader = require("csv-reader")
const db = require("../lib/db")

const run = async () => {
  try {
    let inputStream = fs.createReadStream("./tmp/sentences.csv", "utf8")

    inputStream
      .pipe(CsvReader({ parseNumbers: true, parseBooleans: true, trim: true }))
      .on("data", async row => {
        let word = await db.Word.findOne({ word: row[0] })

        word.sentence = row[4]

        await word.save()

        console.log(word)
      })
      .on("end", function(data) {
        console.log("No more rows!")
      })
  } catch (error) {
    throw error
  }
}

run()
