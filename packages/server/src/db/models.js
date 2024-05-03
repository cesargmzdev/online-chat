import mongoose from 'mongoose';

// Define the schema for the Users collection
const Users = mongoose.model('Users', {
  username: String,
  password: String
});

export { Users };
