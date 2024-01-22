require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

morgan.token("body", (req) => {
  return JSON.stringify(req.body)
})

const app = express()
const Person = require("./models/person")

app.use(express.json())
app.use(express.static("dist"))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use(cors())

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

  Person.find({}).then(persons => {
    res.json(persons)
  })

})

app.get("/api/persons/:id", (req, res, next) => {

  const id = req.params.id

  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))

})

app.post("/api/persons", (req, res, next) => {

  const body = req.body

  const newPerson = new Person ({
    "name": body.name,
    "number": body.number,
  })

  newPerson.save()
    .then(addedPerson => {
      res.json(addedPerson)
    })
    .catch(error => next(error))

})

app.put("/api/persons/:id", (req, res, next) => {

  const { name, number } = req.body

  const person = {
    name: name,
    number: number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: "query" })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {

  const id = req.params.id

  Person.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))

})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {

    return res.status(400).send({ error: "malformated id" })

  } else if (error.name === "ValidationError") {

    return res.status(400).send({ error: error.message })

  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {

  console.log(`server listening on port ${PORT}`);

})