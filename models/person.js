const mongoose = require("mongoose")
mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(result => {
    console.log("connected to mongodb");
  })
  .catch(error => {
    console.log("failed trying to connect to mongo", error.message);
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        return /^[0-9]{2,3}-[0-9]{6,}/.test(v)
      },
      message: props => `${props.value} is not a valid number format`
    },
    required: true
  },
})

mongoose.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)