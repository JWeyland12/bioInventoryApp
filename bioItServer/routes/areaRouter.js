const express = require("express");
const bodyParser = require("body-parser");
const Area = require('../models/areas');
const Trip = require('../models/trips');
const Species = require('../models/species');
const auth = require('../middleware/auth');

const areaRouter = express.Router()
areaRouter.use(bodyParser.json())

areaRouter
.route('/')
.get(auth, (req, res, next) => {
  Area.find({user: req.user.id})
  .then(areas => {
    res.statusCode = 200;
    res.setHeader("Content-Type", 'application/json')
    res.json(areas)
  })
  .catch(err => next(err))
})

.post(auth, (req, res, next) => {
  req.body.user = req.user.id
  if (req.body.projectId) {
    req.body.project = req.body.projectId
  Area.create(req.body)
  .then(area => {
    res.statusCode = 200,
    res.setHeader('Content-Type', 'application/json')
    res.json(area)
  })
  .catch(err => next(err))
  } else {
    err = new Error(`${area} has no associated project`);
    err.status = 406;
    return next(err)
  }
})

.put((req, res, next) => {
  Area.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true })
  .then(area => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json(area)
  })
  .catch(err => next(err))
})

.delete((req, res, next) => {
  async function updateTrips(req, next) {
    await Trip.find({areaId: req.body._id})
    .then(trips => {
      console.log('trips', trips)
      for (let i = 0; i <= trips.length - 1; i++) {
        if (trips[i].areaId.toString() === req.body._id.toString()) {
          trips[i].remove()
          trips[i].save()
        }
      }
    })
    .catch(err => next(err))
  }
  async function updateSpecies(req, next) {
    await Species.find()
    .then(species => {
      for (let i = 0; i <= species.length - 1; i++) {
        for (let j = 0; j <= species[i].tripArr.length - 1; i++) {
          if (species[i].tripArr[j].areaId.toString() === req.body._id.toString()) {
            species[i].tripArr[j].remove()
            species[i].save()
          }
        }
      }
    })
    .catch(err => next(err))
  }
  updateTrips(req, next)
  updateSpecies(req, next)
  Area.findByIdAndDelete(req.body._id)
  .then(response => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response)
  })
  .catch(err => next(err))
})


module.exports = areaRouter