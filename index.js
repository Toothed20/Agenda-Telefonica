const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
        id: 1, 
        name: 'Arto Hellas', 
        number: '040-123456' 
    },
    { 
        id: 2, 
        name: 'Ada Lovelace', 
        number: '39-44-5323523' 
    },
    { 
        id: 3, 
        name: 'Dan Abramov', 
        number: '12-43-234345' 
    },
    { 
        id: 4, 
        name: 'Mary Poppendieck', 
        number: '39-23-6423122' 
    }
]
    
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const total = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${total} people</p>
        <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).json({ error: 'person not found' })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ error: 'name missing' })
    }
    if(!body.number){
        return response.status(400).json({ error: 'number missing' })
    }
    
    const nameExists = persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())
    if (nameExists) {
        return response.status(400).json({
          error: 'Name must be unique'
        })
    }

    const person = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})