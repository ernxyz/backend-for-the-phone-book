const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

morgan.token("body", (req) => {
  return JSON.stringify(req.body)
})

const app = express()

app.use(express.json())
app.use(express.static("dist"))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use(cors())

let people = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const getRndmIndex = () => {
  return Math.floor(Math.random() * 100000)
}

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>")
})

app.get("/info", (req, res) => {
  const dateOfRequest = new Date()

  const totalPeople = people.length

  res.send(
    `<p>Phonebook has info of ${totalPeople} people</p>
     <p>${dateOfRequest}</p>`
  )
})

app.get("/api/persons", (req, res) => {
  res.json(people)
})

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = people.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post("/api/persons", (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      "error": "some content is missing"
    })
  }

  const personExists = people.some(p => p.name === body.name)

  if (personExists) {
    return res.status(409).json({
      "error": "name must be unique"
    })
  }

  const newPerson = {
    "id": getRndmIndex(),
    "name": body.name,
    "number": body.number, 
  }

  people = people.concat(newPerson)

  res.send(newPerson)
})

app.put("/api/persons/:id", (req, res) => {
  const updatedPerson = req.body

  people = people.map(p => (
    p.id !== updatedPerson.id
    ? p
    : updatedPerson
  ))

  res.send(updatedPerson)
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)

  people = people.filter(p => p.id !== id)

    res.status(204).end()

})

const unknownEndpoint = (req, res) => {
  res.status(404).send({"error": "unknown endpoint"})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
})