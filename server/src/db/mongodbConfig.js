import mongoose from 'mongoose'

const mongodbConfig = () => {
  mongoose.connect('mongodb://localhost:27017/online-chat')

  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB')
  })

  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB')
  })

  mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB', err)
  })
}

export default mongodbConfig
