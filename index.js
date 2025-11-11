const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/api/persons', (req, res) => res.json(persons))

app.get('/info', (req, res) => {
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(p => p.id === Number(req.params.id))
    person ? res.json(person) : res.status(404).json({ error: 'person not found' })
})

app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(p => p.id !== Number(req.params.id))
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) return res.status(400).json({ error: 'name missing' })
    if (!body.number) return res.status(400).json({ error: 'number missing' })

    const exists = persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())
    if (exists) return res.status(400).json({ error: 'name must be unique' })

    const newPerson = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson)
    res.json(newPerson)
})

app.use((req, res) => {
    res.status(404).send({ error: 'Ruta desconocida' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})