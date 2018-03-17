"use strict"

const db = require("../lib/db")
const express = require("express")

const router = express.Router()

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("homepage")
})

/* Vocab page. */
router.get("/word/:word/:page", async (req, res, next) => {
  let word = await db.Word.findOne({
    word: req.params.word
  })

  console.log(word)

  res.render("word", { word: word, page: req.params.page })
})

module.exports = router
