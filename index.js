const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('req-body', function(req, res){
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

//const url = `mongodb+srv://fullstack:${password}@cluster0-ggqhb.mongodb.net/phonebook-app?retryWrites=true&w=majority`


let persons = [
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 1
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 2
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 3
      }
]

const generateId = () => {
    return Math.floor(Math.random() * 10000)
}
const personFounds = (name) => {
    return (persons.filter(p => p.name === name).length > 0)
}


app.get('/info', (req, res) => {
    const date = new Date()

    res.send('<div>'
       + `<p>Phonebook has info for ${persons.length} people </p>`
       + `<p>${date}</p>`
    + '</div>')

})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter (person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body= req.body

    if(!body.name || !body.number) {
        return res.status(400).json({
            error: 'Content missing'
        })
    }

    if(personFounds(body.name)) {
        return res.status(400).json({
            error: 'Name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
