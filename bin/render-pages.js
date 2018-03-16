"use strict"

const { exec } = require("child_process")
const db = require("../lib/db")
const fs = require("fs")
const pdf = require("html-pdf")

const run = async () => {
  try {
    let words = await db.Word.find({}).sort("word")
    let options = {
      format: "Letter",
      paginationOffset: 1,
      renderDelay: 1000,
      footer: {
        height: "28mm"
      }
    }

    for (let w in words) {
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
