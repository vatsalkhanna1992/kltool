const express = require('express')
const Users = require('../models/users')

const router = new express.Router()

// Get a user by id.
router.get('/user/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await Users.findById(_id)
        if (!user) {
            return res.status(404).send({
                error: 'User not found!'
            })
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Get all users.
router.get('/users', async (req, res) => {
    try {
        const users = await Users.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

// User login.
router.post('/user/login', async (req, res) => {
    try {
        const user = await Users.findByCredentials(req.body.username, req.body.password)
        console.log(user)
        res.render('dashboard', {
            firstName: user.first_name,
            lastName: user.last_name
        })
    } catch (e) {
        res.status(400).send({
            error: 'Unable to login.'
        })
    }
})

// Create a user.
router.post('/user/registration', async (req, res) => {
    const user = new Users(req.body)
    try {
        await user.save()
        res.render('dashboard', {
            firstName: req.body.first_name,
            lastName: req.body.last_name
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

// Update a user.
router.patch('/user/:id', async (req, res) => {
    const keys = Object.keys(req.body)
    const allowedKeys = ['username', 'first_name', 'last_name', 'password']
    const isValidKey = keys.every((key) => {
        return allowedKeys.includes(key)
    })
    if (!isValidKey) {
        return res.status(400).send({
            error: 'Invalid key provided.'
        })
    }
    try {
        // Remove this findByIdAndUpdate will bypass mongoose basic things like validation or presave etc.
        //const user = await Users.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators: true })

        // To make password field uses hash on update.
        const user = await Users.findById(req.params.id)
        keys.forEach((key) => user[key] = req.body[key])
        await user.save()

        if (!user) {
            return res.status(404).send({
                error: 'User not found!'
            })
        }
        res.status(200).send(user)

    } catch(e) {
        res.status(400).send(e)
    }
})

// Delete a user.
router.delete('/user/:id', async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send({
                error: 'User not found!'
            })
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router