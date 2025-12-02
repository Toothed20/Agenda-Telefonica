require('dotenv').config()

const express = require("express")
const app = express()
app.use(express.json())

const morgan = require('morgan')
const cors = require("cors")
app.use(cors())
app.use(express.static("dist"))

const Person = require('./models/person')

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const requestLogger = (req, res, next) => {
    console.log("Method:", req.method)
    console.log("Path:", req.path)
    console.log("Body:", req.body)
    console.log("----------------------")
    next()
}
app.use(requestLogger)

app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) res.json(person)
            else res.status(404).end()
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(() => res.status(204).end())
        .catch(error => next(error))
})

app.post("/api/persons", (req, res) => {
    const { name, number } = req.body

    if (!name || !number) {
        return res.status(400).json({ error: "name or number missing" })
    }

    const person = new Person({
        name,
        number
    })

    person.save()
        .then(saved => res.json(saved))
})

app.put("/api/persons/:id", (req, res, next) => {
    const { name, number } = req.body

    const updatedPerson = { name, number }

    Person.findByIdAndUpdate(
        req.params.id,
        updatedPerson,
        { new: true }
    )
        .then(result => res.json(result))
        .catch(error => next(error))
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html")
})

const badPath = (req, res) => {
    res.status(404).send({ error: "Ruta desconocida" })
}
app.use(badPath)

const errorHandler = (error, req, res, next) => {
    console.log("ERROR:", error.message)

    if (error.name === 'CastError') {
        return res.status(400).json({ error: "malformatted id" })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`)
})
