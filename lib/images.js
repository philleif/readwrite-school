"use strict"

require("dotenv").config()

const axios = require("axios")
const NounProject = require("the-noun-project")

let nounProject = new NounProject({
  key: process.env.NOUN_PROJECT_KEY,
  secret: process.env.NOUN_PROJECT_SECRET
})

const nounSearch = async terms => {
  return new Promise((resolve, reject) => {
    nounProject.getIconsByTerm(terms, { limit: 1 }, function(err, data) {
      if (!err) {
        resolve(data.icons[0].preview_url_84)
      } else {
        reject(err)
      }
    })
  })
}

const search = async terms => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "https://api.unsplash.com/search/photos?query=" +
          terms +
          "&per_page=1" +
          "&client_id=" +
          process.env.UNSPLASH_APP_ID
      )
      .then(response => {
        console.log(response.data.results[0])
        resolve({
          url: response.data.results[0].urls.small,
          credit: response.data.results[0].user.name
        })
      }).catch(error => {
        reject(error)
      })
  })
}

module.exports = {
  search,
  nounSearch
}
