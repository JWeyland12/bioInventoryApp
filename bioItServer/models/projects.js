const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
    imgSrc: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  {
    timestamps: true
  }
);


const Project = mongoose.model('Project', projectSchema);

module.exports = Project