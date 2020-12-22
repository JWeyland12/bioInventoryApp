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
    areaId: String,
    images: [
      {
        uri: String
      }
    ],
    notes: [
      {
        note: String,
        date: String
      }
    ],
    members: [
      {
        member: String
      }
    ]
  },
  {
    timestamps: true
  }
)

const Trip = mongoose.model('Trip', tripSchema)
module.exports = Trip