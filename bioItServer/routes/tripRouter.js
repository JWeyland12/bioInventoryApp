const express = require("express");
const bodyParser = require("body-parser");
const Trip = require("../models/trips");
const Species = require('../models/species');

const tripRouter = express.Router();
tripRouter.use(bodyParser.json());

tripRouter
.route('/')
.get((req, res, next) => {
  Trip.find()
  .then(trips => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json(trips)
  })
  .catch(err => next(err))
})
.post((req, res, next) => {
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
        console.log('enter loop 1')
        for (let j = species[i].tripArr.length-1; j>=0; j--) {
          console.log('enter loop 2')
          if (species[i].tripArr[j].tripRef.toString() === req.body._id.toString()) {
            console.log('enter for')
            species[i].tripArr[j].remove()
            species[i].save()
          }
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