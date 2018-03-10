"use strict"

const data = require("../lib/data")
const images = require("../lib/images")
const express = require("express")

const router = express.Router()


/* GET home page. */
router.get("/", async (req, res, next) => {
  let text = await data.fetchArticles()

  text = await data.catalogText(text)

  for (let node of text) {
    node.image = await images.search(node.word)
    console.log(node.image)
  }

  console.log(text)

  res.render("index", { text: text })
})

module.exports = router
