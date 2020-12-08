const express = require("express");
const bodyParser = require("body-parser");
const Trip = require("../models/trips");
const Species = require('../models/species');
const auth = require('../middleware/auth');

const tripRouter = express.Router();
tripRouter.use(bodyParser.json());

tripRouter
.route('/')
.get(auth, (req, res, next) => {
  Trip.find({user: req.user.id})
  .then(trips => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json(trips)
  })
  .catch(err => next(err))
})
.post(auth, (req, res, next) => {
  req.body.user = req.user.id
  if (req.body.areaId) {
    req.body.area = req.body.areaId
    Trip.create(req.body)
    .then(trip => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json')
      res.json(trip)
    })
    .catch(err => next(err))
  } else {
    const err = new Error('This trip does not have an associated area')
    err.statusCode = 406;
    return next(err)
  }
})
.put((req, res, next) => {
  Trip.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true})
  .then(trip => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json(trip)
  })
  .catch(err => next(err))
})
.delete((req, res, next) => {
  async function removeTripRefFromSpecies(req, next) {
    await Species.find()
    .then(species => {
      for (let i = species.length-1; i>=0; i--) {
        for (let j = species[i].tripArr.length-1; j>=0; j--) {
          if (species[i].tripArr[j].tripId.toString() === req.body._id.toString()) {
            species[i].tripArr[j].remove()
            species[i].save()
          }
          // expensive process. time complexity O(n^2), space complexity O(n). Better solution?
        }
      }
    })
    .catch(err => next(err))
  }
  removeTripRefFromSpecies(req, next)
  Trip.findByIdAndDelete(req.body._id)
  .then(trip => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json(trip)
  })
  .catch(err => next(err))
})

module.exports = tripRouter