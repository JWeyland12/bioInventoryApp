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
    notes: [
      {
        note: {
          type: String
        },
        date: {
          type: String
        }
      }
    ],
    images: [
      {
        uri: {
          type: String
        }
      }
    ]
  },
  {
    timestamps: true
  }
);


const Project = mongoose.model('Project', projectSchema);

module.exports = Project