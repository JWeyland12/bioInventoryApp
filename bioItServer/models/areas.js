const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const areaSchema = new Schema (
  {
    area: {
      type: String,
      required: true,
      unique: true
    },
    geoRef: {
      type: String,
      // required: true
    },
    project: String
  },
  {
    timestamps: true
  }
)

const Area = mongoose.model('Area', areaSchema);
module.exports = Area