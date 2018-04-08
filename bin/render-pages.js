"use strict"

const { exec } = require("child_process")
const db = require("../lib/db")
const fs = require("fs")
const pdf = require("html-pdf")

const run = async () => {
  try {
    let words = await db.Word.find({ section: { $ne: "Business" } }).sort(
      "word"
    )
    let options = {
      height: "10in", // allowed units: mm, cm, in, px
      width: "8in", // allowed units: mm, cm, in, px      paginationOffset: 1,
      renderDelay: 500
    }

    for (let w in words) {
      // TODO: render by section
      let path = await downloadAsync(words[w].word, w)
      let html = fs.readFileSync(path, "utf8")

      pdf
        .create(html, options)
        .toFile(`./tmp/pdf/${w}-${words[w].word}.pdf`, function(err, res) {
          if (err) throw err
          console.log(res)
        })
    }
  } catch (error) {
    throw error
  }
}

const downloadAsync = async (word, page) => {
  return new Promise((resolve, reject) => {
    console.log("Downloading page", page, word)
    exec(
      `curl http://localhost:3000/word/${word}/${page} > ./tmp/html/${page}-${word}.html`,
      (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          reject(err)
        }
        resolve(`./tmp/html/${page}-${word}.html`)
      }
    )
  })
}

run()
