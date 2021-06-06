const express = require('express')
const Apps = require('../models/token')
const auth = require('../middleware/auth')
var randomstring = require("randomstring");
const router = new express.Router()
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')

router.get('/register-app', auth, async(req, res) => {
  res.render('register-app')
})

// Registers an app.
router.post('/register-app', auth, async (req, res) => {
  var app_name = req.body.app_name.split(' ').join('_')
  const secret = app_name + randomstring.generate(8)
  const app_secret = await bcrypt.hash(secret, 8)
  const app_url = req.body.app_url
  const username = req.user.username
  app_name = app_name + '.apps.kltool.com'
  try {
    const app = new Apps({username, app_name, app_url, app_secret: secret})
    await app.save()
    const content = {
      username: app.username,
      app_name: app.app_name,
      app_url: app.app_url,
      app_secret: app_secret,
      created: app.createdAt
    }
    const filePath = path.join(__dirname, '../../public/tmp/credentials_' + app._id + '.json')
    fs.writeFile(filePath, JSON.stringify(content), function (err) {
      if (err) throw err;
    });
    setTimeout(function() {
      res.download(filePath, 'credentials_' + app._id + '.json')
    }, 2000)
  } catch (e) {
    const err = e.errors
    if (err) {
        if (err.app_name) {
            res.status(400).send({
              error: err.app_name.message
            })
            return
        }
        if (err.app_url) {
            res.status(400).send({
              error: 'Please enter valid app URL.'
            })
            return
        }
    }
    res.status(400).send({
        error: 'App name already exists. Please choose a different app name.'
    })
  }
})

module.exports = router