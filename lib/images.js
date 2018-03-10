"use strict"

require("dotenv").config()

const axios = require("axios")

const search = async terms => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "https://api.unsplash.com/search/photos?query=" +
          terms +
          "per_page=1" +
          "&client_id=" +
          process.env.UNSPLASH_APP_ID
      )
      .then(response => {
        resolve(response.data.results[0].urls.small)
      })
  })
}

module.exports = {
  search
}
