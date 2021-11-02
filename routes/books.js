const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const {authenticateToken} = require('../middleware')

//  GET all books
router.get('/all', async (req, res) => {

  let where = {}
  if(req.query.title != null) where.title = req.query.title
  if(req.query.author != null) where.author = req.query.author
  if(req.query.genre != null) where.genre = req.query.genre
  if(req.query.publication_year != null) where.publication_year = Number.parseInt(req.query.publication_year)

  try {
    const books = await Book.find(where)
    res.json(books)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//  GET specific book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    res.json(book)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST create a book
router.post('/create', authenticateToken, async (req, res) => {
  // console.log(req.body)
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    publication_year: Number.parseInt(req.body.publication_year),
    abstract: req.body.abstract,
    user_id: req.user.id
  })

  try {
    const newBook = await book.save()
    res.status(201).json(newBook)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// POST update book quantity
router.post('/:id/update', authenticateToken, async (req, res) => {
    let book
    try {
      book = await Book.findById(req.params.id)
      if (book == null) {
          return res.status(404).json({ message: 'No book found with the given id' })
      }      
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }

    if(book.user_id == req.user.id) {
      book.title = req.body.title != null ? req.body.title : book.title
      book.author = req.body.author != null ? req.body.author : book.author
      book.genre = req.body.genre != null ? req.body.genre : book.genre
      book.publication_year = req.body.publication_year != null ? Number.parseInt(req.body.publication_year) : book.publication_year
      book.abstract = req.body.abstract != null ? req.body.abstract : book.abstract

      try {
        const updatedBook = await book.save()
        res.json(updatedBook)
      } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message })
      }
    } else {
      res.status(401).json({ message: "You are Unauthorized" })
    }
})

// Handle book delete on POST.
router.post('/:id/delete', authenticateToken, async (req, res) => {
  try {
    book = await Book.findById(req.params.id)
    if (book == null) {
        return res.status(404).json({ message: 'No book found with the given id' })
    } 
  } catch (err) {
    res.status(500).json({ message: err.message })
  }

  if(book.user_id == req.user.id) {
    try {
      const book = await Book.findByIdAndDelete(req.params.id)
      res.json({ message: 'Book deleted sucessfully', book: book})
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  } else {
    res.status(401).json({ message: "You are Unauthorized" })
  }
})

module.exports = router