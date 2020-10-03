const mongoose = require('mongoose');
const Schema = mongoose.Schema


const tripSchema = new Schema (
  {
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