const mongoose = require('mongoose')
const validator = require('validator')

const noteSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please enter valid email.')
            }
        }
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
})

const Notes = mongoose.model('Notes', noteSchema)

module.exports = Notes