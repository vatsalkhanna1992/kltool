const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please use valid email address as Username.')
            }
        }
    },
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Enter valid password.')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// Generate JWT Token.
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '24h'})

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

// Hash password.
userSchema.statics.hashPassword = async function(password) {
    hashed_password = await bcrypt.hash(password, 8)
    return hashed_password
}

// Hide private data. This will be automatically called as toJSON is used.
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// Check credentials provided on login screen.
userSchema.statics.findByCredentials = async (username, password) => {
    const user = await Users.findOne({ username })
    if (!user) {
        throw new Error('Unable to login.')
    }
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        throw new Error('Unable to login.')
    }
    return user
}

// Check if the username is valid.
userSchema.statics.isValidUsername = async (username) => {
    const user = await Users.findOne({ username })

    if (!user) {
        return false
    }

    return true
}

// Generate random string.
userSchema.statics.generateRandomString = function(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

// Hash password before saving.
userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) { // Will be called on both user creation and updation.
        user.password = await bcrypt.hash(user.password, 8)
    }
    next() // Important. It lets the code know that pre-save is done and can move forward.
})

const Users = mongoose.model('Users', userSchema)

module.exports = Users;