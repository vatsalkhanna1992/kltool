const express = require('express')
const Cards = require('../models/cards')
const auth = require('../middleware/auth')
const hbs = require('hbs')

const router = new express.Router()

router.post('/add/card', auth, async (req, res) => {
    const username = req.user.username
    const title = req.body.card_title
    const description = req.body.card_description
    try {
        const card = new Cards({username, title, description})
        await card.save()
        res.status(301).redirect('/kanban-board')
    } catch (e) {
        res.status(400).send({
            error: 'Card cannot be added.'
        })
    }
})

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