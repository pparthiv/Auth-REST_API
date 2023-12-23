const express = require("express")
const morgan = require("morgan")
const createError = require("http-errors")

require("dotenv").config()
require("./helpers/init_mongodb")

const { verifyAccessToken } = require("./helpers/jwt_helper")

require("./helpers/init_redis")

const AuthRoute = require("./routes/auth.route")

const app = express()
app.use(morgan("dev"))
app.use(express.json())

app.get("/", verifyAccessToken, async (req, res, next) => {
    res.send("Hello")
})

app.use("/auth", AuthRoute)

app.use(async (req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})