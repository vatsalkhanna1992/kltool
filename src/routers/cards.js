const express = require('express')
const { Cards } = require('../models/cards')
const auth = require('../middleware/auth')
const hbs = require('hbs')
const Boards = require('../models/boards')

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
    let title = req.body.update_card_title
    let description = req.body.update_card_description
    let status = req.body.update_card_status
    const card_id = req.body.card_id
    const board_id = req.body.board_id
    let completed = false
    if (status === 'done') {
        completed = true
    }
    try {
        if (board_id) {
            await Boards.findOneAndUpdate({ _id: board_id, 'cards._id': card_id}, {
                $set: {
                    'cards.$.title': title,
                    'cards.$.description': description,
                    'cards.$.status': status,
                }
            })
            res.status(301).redirect('/board/' + board_id)
        } else {
            await Cards.findByIdAndUpdate(card_id, {title, description, status, completed})
            res.status(301).redirect('/kanban-board')
        }
    } catch (e) {
        res.status(400).send({
            error: 'Card cannot be updated.'
        })
    }
})

// Delete card on Kanban Board.
router.delete('/remove/card', auth, async (req, res) => {
    const card_id = req.body.card_id
    const board_id = req.body.board_id
    try {
        if (board_id !== '') {
            await Boards.findOneAndUpdate({ _id: board_id }, {
                $pull: {
                    'cards': {
                        '_id': card_id
                    }
                }
            })
            res.send({
                card_id,
                board_id
            })
        } else {
            await Cards.findByIdAndDelete(card_id)
            res.send({
                card_id
            })
        }
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

// Fetch card through ajax.
router.get('/fetch/card', auth, async (req, res) => {
    const card_id = req.query.id
    const board_id = req.query.board_id
    try {
        let card
        if (board_id !== '') {
            const board = await Boards.findById(board_id)
            card = board.cards.filter(card => {
                return card.id == card_id
            });
            card = card[0]
        } else {
            card = await Cards.findById(card_id)
        }
        res.send({
            card
        })
    } catch (e) {
        res.render('kanban')
    }
})

// Update card through ajax.
router.get('/update/card', auth, async (req, res) => {
    const card_id = req.query.id
    const status = req.query.status
    let completed = false
    if (status === 'done') {
        completed = true
    }
    try {
        const card = await Cards.findByIdAndUpdate(card_id, {status, completed})
        res.send({
            card
        })
    } catch (e) {
        res.render('kanban')
    }
})

// Register helper for handlebars.
hbs.registerHelper('cardsStatus', function(card_status, status, options) {
    if (card_status == status) {
        return options.fn(this)
    } else {
        options.inverse(this)
    }
})

module.exports = router