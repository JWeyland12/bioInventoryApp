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
    rank: {
      type: String
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
        images: [
          {
            uri: {
              type: String,
            }
          }
        ], 
        notes: [
          {
            note: {
              type: String,
            },
            date: {
              type: String,
            }
          }
        ]
      },
    ],
  },
  {
    timestamps: true
  }
)

const Species = mongoose.model('Species', speciesSchema);
module.exports = Species