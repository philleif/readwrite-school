"use strict"

const data = require("../lib/data")
const express = require("express")
const router = express.Router()


/* GET home page. */
router.get("/", async (req, res, next) => {
  let text = await data.fetchArticles()

  text = await data.catalogText(text)

  console.log(text)

  res.render("index", { text: text })
})

module.exports = router
