require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/user')
const Book = require('../models/book')
// const {authenticateToken} = require('../middleware')

router.post('/signup', async (req, res) => {
  if (req.body.email != null && req.body.password != null && req.body.name != null) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
      })

      const newUser = await user.save()
      
      res.status(201).json({
        message: "Sign up successful",
        name: newUser.name,
        email: newUser.email
      })
      
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  } else {
    res.status(400).json({ message: 'Missing fields values' })
  }
})

router.post('/signin', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    // console.log(user)
    if(user != null && await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign({
        name: user.name,
        id: user._id,
        email: user.email
      }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60*5 })
      res.json({ token: accessToken, message: 'Signin successful' })
    } else {
      res.status(400).json({ message: 'Invalid Credentials' })
    }
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router