"use strict"

const createCsvWriter = require("csv-writer").createObjectCsvWriter
const db = require("../lib/db")

const run = async () => {
  try {
    let words = await db.Word.find({})
    let filePath = "./tmp/wordlist.csv"
    let headers = ["word", "section", "subsection", "autosentence", "newsentence"]
    let data = []

    for(let word of words) {
      data.push({
        word: word.word,
        section: word.section,
        subsection: word.subsection,
        autosentence: word.exp[0],
        newsentence:""
      })
    }

    const csvWriter = createCsvWriter({
      path: filePath,
      header: headers
    })

    csvWriter.writeRecords(data).then(() => {
      console.log("Done")
    })

  } catch (error) {
    throw error
  }
}

run()
