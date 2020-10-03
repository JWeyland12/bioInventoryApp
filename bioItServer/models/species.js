const mongoose = require('mongoose');
const Schema = mongoose.Schema


const speciesSchema = new Schema(
  {
    sciName: {
      type: String,
      required: true,
      unique: true,
    },
    comName: {
      type: String,
      required: true,
    },
    tripArr: [
      {
        tripRef: String,
        total: Number
      }
    ],
    areaArr: [],
    projectArr: [],
  },
  {
    timestamps: true
  }
)

const Species = mongoose.model('Species', speciesSchema);
module.exports = Species