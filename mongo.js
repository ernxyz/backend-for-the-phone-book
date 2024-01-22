const mongoose = require("mongoose")

if (process.argv.length < 3){
  console.log("write the necessary arguments");
  process.exit(1)
}

const password = process.argv[2]

const URL =
  `mongodb+srv://ernej29:${password}@cluster0.dxtcoaq.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(URL)

const personSchema = mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length > 3) {
  const name = process.argv[3], number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person
    .save()
    .then(result => {
      console.log(`Added ${result.name} number ${result.number} to the phonebook`);
      mongoose.connection.close()
    })
} else {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person);
    })

    mongoose.connection.close()
  })
}