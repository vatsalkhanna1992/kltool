const express = require('express')
const Cards = require('../models/cards')
const auth = require('../middleware/auth')
const hbs = require('hbs')

const router = new express.Router()

// Add card on Kanban Board.
router.post('/add/card', auth, async (req, res) => {
    const username = req.user.username
    const title = req.body.card_title
    const description = req.body.card_description
    const status = req.body.card_status
    let completed = false
    if (status === 'done') {
        completed = true
    }
    try {
        const card = new Cards({username, title, description, status, completed})
        await card.save()
        res.status(301).redirect('/kanban-board')
    } catch (e) {
        res.status(400).send({
            error: 'Card cannot be added.'
        })
    }
})

// Update card on Kanban Board.
router.post('/update/card', auth, async (req, res) => {
    const title = req.body.update_card_title
    const description = req.body.update_card_description
    const status = req.body.update_card_status
    const card_id = req.body.card_id
    let completed = false
    if (status === 'done') {
        completed = true
    }
    try {
        await Cards.findByIdAndUpdate(card_id, {title, description, status, completed})
        res.status(301).redirect('/kanban-board')
    } catch (e) {
        res.status(400).send({
            error: 'Card cannot be updated.'
        })
    }
})

// Delete card on Kanban Board.
router.get('/remove/card', auth, async (req, res) => {
    const card_id = req.query.id
    try {
        await Cards.findByIdAndDelete(card_id)
        res.status(301).redirect('/kanban-board')
    } catch (e) {
        res.status(400).send({
            error: 'Card cannot be deleted.'
        })
    }
})

// Fetch Kanban Board for a user.
router.get('/kanban-board', auth, async (req, res) => {
    const username = req.user.username
    try {
        const cards = await Cards.find({ username })
        res.render('kanban', {
            cards
        })
    } catch (e) {
        res.render('kanban')
    }
})

router.get('/fetch/card', auth, async (req, res) => {
    const card_id = req.query.id
    try {
        const card = await Cards.findById(card_id)
        res.send({
            card
        })
    } catch (e) {
        res.render('kanban')
    }
})


// Register helper for handlebars.
hbs.registerHelper('cardsStatus', function(card_status, status, options) {
    if (card_status === status) {
        return options.fn(this)
    } else {
        options.inverse(this)
    }
})

/* hbs.registerHelper('todoCards', function(status, options) {
    if (status === 'todo') {
        return options.fn(this)
    } else {
        options.inverse(this)
    }
})

hbs.registerHelper('inProgressCards', function(status, options) {
    if (status === 'in_progress') {
        return options.fn(this)
    } else {
        options.inverse(this)
    }
})

hbs.registerHelper('completedCards', function(status, options) {
    if (status === 'done') {
        return options.fn(this)
    } else {
        options.inverse(this)
    }
}) */

module.exports = router