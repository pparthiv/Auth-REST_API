const createError = require("http-errors")
const User = require("../models/User.model")
const { authSchema } = require("../helpers/validation_schema")
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../helpers/jwt_helper")
const client = require("../helpers/init_redis")

const register = async(req, res, next) => {
    try {
        const valid = await authSchema.validateAsync(req.body)

        const doesExist = await User.findOne({email: valid.email})
        if (doesExist) throw createError.Conflict(`${valid.email} is already registered`)

        const user = new User(valid)
        const savedUser = await user.save()
        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRefreshToken(savedUser.id)

        res.send({accessToken, refreshToken})

    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
}

const login = async(req, res, next) => {
    try {
        const valid = await authSchema.validateAsync(req.body)
        
        const user = await User.findOne({ email: valid.email })
        if(!user) throw createError.NotFound("User not registered")

        const isMatch = await user.isValidPassword(valid.password)
        if(!isMatch) throw createError.Unauthorized("Incorrect password")

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)

        res.send({accessToken, refreshToken})

    } catch (error) {
        if (error.isJoi === true) return next(createError.BadRequest("Invalid Email/Password"))
        next(error)
    }
}

const refreshToken = async(req, res, next) => {
    try {
        const {refreshToken} = req.body
        
        if(!refreshToken) throw createError.BadRequest()

        const userId = await verifyRefreshToken(refreshToken)

        const accessToken = await signAccessToken(userId)
        const refToken = await signRefreshToken(userId)
        
        res.send({ accessToken, refToken })

    } catch (error) {
        next(error)
    }
}

const logout = async(req, res, next) => {
    try {
        const {refreshToken} = req.body
        if(!refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)
        client.DEL(userId, (err, value) => {
            if (err) {
                console.log(err.message)
                throw createError.InternalServerError()
            }
            console.log(value)
            res.sendStatus(204)
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    register,
    login,
    refreshToken,
    logout
}