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
    // plant: {
    //   type: Boolean,
    //   required: true,
    // },
    tripArr: [
      {
        tripRef: {
          type: String,
          required: true,
          unique: true
        },
        areaRef: {
          type: String,
          required: true
        },
        projRef: {
          type: String,
          required: true
        },
        total: {
          type: Number,
          required: true
        }
      }
    ],
  },
  {
    timestamps: true
  }
)

const Species = mongoose.model('Species', speciesSchema);
module.exports = Species