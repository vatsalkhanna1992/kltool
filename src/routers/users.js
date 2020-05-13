const express = require('express')
const Users = require('../models/users')
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')

const router = new express.Router()

// Get user profile.
router.get('/user/profile', auth, async (req, res) => {
    res.render('profile', {
        username: req.user.username,
        firstName: req.user.first_name,
        lastName: req.user.last_name
    })
})

router.get('/update/profile', auth, async (req, res) => {
    res.redirect('/user/profile')
})

router.get('/update/password', auth, async (req, res) => {
    res.redirect('/user/profile')
})

// Update user profile.
router.post('/update/profile', auth, async (req, res) => {
    first_name = req.body.first_name
    last_name = req.body.last_name
    const updated_user = await Users.findByIdAndUpdate(req.user.id, { first_name, last_name }, { new:true, runValidators: true })
    if (!updated_user) {
        res.status(404).send({
            error: 'User not found! Please login again'
        })
    }
    res.render('profile', {
        username: req.user.username,
        firstName: updated_user.first_name,
        lastName: updated_user.last_name,
        message_profile: 'Profile Updated Successfully.'
    })
})

// Update user password.
router.post('/update/password', auth, async (req, res) => {
    old_password = req.body.old_password
    password = req.body.password
    confirm_password = req.body.confirm_password
    const isMatch = await bcrypt.compare(old_password, req.user.password)
    if (!isMatch) {
        res.render('profile', {
            username: req.user.username,
            firstName: req.user.first_name,
            lastName: req.user.last_name,
            error: 'Invalid Old Password.'
        })
        return
    }
    if (password !== confirm_password) {
        res.render('profile', {
            username: req.user.username,
            firstName: req.user.first_name,
            lastName: req.user.last_name,
            error: "New password doesn't match."
        })
        return
    }
    try {
        const hashed_password = await req.user.hashPassword(password)
        const updated_user = await Users.findByIdAndUpdate(req.user._id, {
            password: hashed_password
        }, {new: true, runValidators: true})
        if (!updated_user) {
            res.render('profile', {
                username: req.user.username,
                firstName: updated_user.first_name,
                lastName: updated_user.last_name,
                error: 'User cannot be updated.'
            })
            return
        }
        res.render('profile', {
            username: req.user.username,
            firstName: updated_user.first_name,
            lastName: updated_user.last_name,
            message_password: 'Password Updated Successfully.'
        })
    } catch(e) {
        res.send({
            error: e
        })
    }
})

// Redirect to home page if user tries to visit this url.
router.get('/user/login', async (req, res) => {
    res.status('301').redirect('/')
})

// Get a user by id.
router.get('/user/:id', async (req, res) => {
    const _id = req.params.id
    if (isNaN(_id)) {
        return res.status(404).render('404')
    }

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

// User login.
router.post('/user/login', async (req, res) => {
    try {
        const user = await Users.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.cookie('auth', token)
        res.render('dashboard', {
            firstName: user.first_name,
            lastName: user.last_name
        })
        //res.send({user, token})
    } catch (e) {
        /* res.status(400).send({
            error: 'Unable to login.'
        }) */
        res.status(400).render('index', {
            error: 'Invalid username or password.'
        })
    }
})

// Create a user.
router.post('/user/registration', async (req, res) => {
    const user = new Users(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie('auth', token)
        res.status(201)
        //res.send({ user, token})
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

// Logout from current device.
router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        // Remove current token used for login from database.
        await req.user.save()

        res.redirect('/')
    } catch (e) {
        res.status(500).send()
    }
})

// Logout from all devices
router.post('/user/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = []

        // Remove all tokens used for login from database.
        await req.user.save()

        res.redirect('/')
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router