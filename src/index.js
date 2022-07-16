const express = require("express")
require('../db/dbconnection.js')
const path = require("path")
const hbs = require("hbs")
const register = require("../model/user-registers")
const { registerPartials } = require("hbs")

const PORT = process.env.PORT || 3000

const app = express()

const static_path = path.join(__dirname, '../public')
const template_path = path.join(__dirname, '../templates/views')
const partial_path = path.join(__dirname, '../templates/partials')

app.use(express.static(static_path))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.set("view engine", "hbs")
app.set("views", template_path)

hbs.registerPartials(partial_path)

app.get('/', (req, res) => {
    res.render("index")
})




app.get('/register', (req, res) => {
    res.render("register")
})

app.get('/login', (req, res) => {
    res.render("login")
})

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const data = await register.findOne({ email: email })
        if (data.password === password) {
            res.status(201).send(`<h1>Welcome ${data.firstname}</h1>`)
        }
        else {
            res.send(`<h1>Password is not matching</h1>`)
        }

    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/register', async (req, res) => {
    try {
        const password = req.body.password
        const cpassword = req.body.confirmpassword

        if (password === cpassword) {
            register.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                mobile: req.body.mobile,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            }, (err, data) => {
                if (err) {
                    console.log(err)
                }
                else {
                    res.status(201).render("index")
                }
            })
        } else {
            res.send("Password are not matching")
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`)
})