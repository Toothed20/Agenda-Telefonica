const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('Conectando a MongoDB...')

mongoose.connect(url)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.log('Error conectando a MongoDB:', err.message))

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
