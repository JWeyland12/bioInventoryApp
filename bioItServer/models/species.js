const mongoose = require('mongoose');
const Schema = mongoose.Schema


const speciesSchema = new Schema(
  {
    user: {
      type: String,
    },
    sciName: {
      type: String,
      required: true,
      unique: true,
    },
    comName: {
      type: String,
      required: true,
      unique: true
    },
    img: {
      type: String,
      required: true,
    },
    // plant: {
    //   type: Boolean,
    //   required: true,
    // },
    tripArr: [
      {
        tripId: {
          type: String,
        },
        areaId: {
          type: String,
        },
        projectId: {
          type: String,
        },
        total: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true
  }
)

const Species = mongoose.model('Species', speciesSchema);
module.exports = Species