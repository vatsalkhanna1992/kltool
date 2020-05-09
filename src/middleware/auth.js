const jwt = require('jsonwebtoken')
const Users = require('../models/users')

const auth = async (req, res, next) => {
    try {
        const token = await getJwtToken(req)
        // If you don't use cookie-parser then by default cookies are available at req.headers.cookie.
        //const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await Users.findOne({ _id: decode._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({
            error: 'Please Authenticate.'
        })
    }

}

const getJwtToken = async (req) => {
    if (req && req.cookies) {
        return req.cookies['auth']
    }
    return ''
}
module.exports = auth