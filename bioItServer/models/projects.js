const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const projectSchema = new Schema (
  {
    user: {
      type: String,
      required: true
    },
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
    img: {
      type: String,
      required: true
    },
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