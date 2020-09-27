const mongoose = require('mongoose');
const projectRouter = require('../routes/projectRouter');
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
    }
  },
  {
    timestamps: true
  }
)

const projectSchema = new Schema (
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    state: {
      type: String,
      required: true,
    },
    county: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    areas: [areaSchema]
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project