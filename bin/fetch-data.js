"use strict"

require("dotenv").config()

const axios = require("axios")
const language = require("@google-cloud/language")

const client = new language.LanguageServiceClient()

const NYT_API_KEY = process.env.NYT_API_KEY

const run = async () => {
  console.log("Fetching NYT Articles...")

  let date = new Date()
  let month = date.getMonth()

  await axios
    .get(
      "http://api.nytimes.com/svc/archive/v1/2018/" +
        month +
        ".json?api-key=" +
        NYT_API_KEY
    )
    .then(async response => {
      // console.log(response.data.response.docs[0].snippet)

      let text = ""

      for (let doc of response.data.response.docs.slice(1, 100)) {
        text += " " + doc.snippet
      }

      // TODO: remove words < 4 letters
      // TODO: strip punctuation
      let store = text.split(" "),
        distribution = {},
        max = 0,
        result = []

      store.forEach(function(a) {
        distribution[a] = (distribution[a] || 0) + 1
        if (distribution[a] > max) {
          max = distribution[a]
          result = [a]
          return
        }
        if (distribution[a] === max) {
          result.push(a)
        }
      })

      console.log(distribution)

      let document = {
        content: text,
        type: "PLAIN_TEXT"
      }

      await client
        .analyzeEntities({ document: document })
        .then(results => {
          const entities = results[0].entities

          console.log("Entities:")
          entities.forEach(entity => {
            console.log(entity.name)
            console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`)
            if (entity.metadata && entity.metadata.wikipedia_url) {
              console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}$`)
            }
          })
        })
        .catch(err => {
          console.error("ERROR:", err)
        })
    })
}

run()
