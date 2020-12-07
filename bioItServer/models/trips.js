const mongoose = require('mongoose');
const Schema = mongoose.Schema


const tripSchema = new Schema (
  {
    user: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    areaId: String
  },
  {
    timestamps: true
  }
)

const Trip = mongoose.model('Trip', tripSchema)
module.exports = Trip