const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const areaSchema = new Schema (
  {
    user: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true,
    },
    geoRef: {
      type: String,
      required: true
    },
    altitude: String,
    accuracy: String,
    karst: String,
    project: String,
    img: {
      type: String,
      required: true
    },
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
    ]
  },
  {
    timestamps: true
  }
)

const Area = mongoose.model('Area', areaSchema);
module.exports = Area
