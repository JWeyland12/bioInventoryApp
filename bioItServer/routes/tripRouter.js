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
.put(async (req, res, next) => {
  if (req.body.areaId) {
    Trip.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true})
    .then(trip => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json')
      res.json(trip)
    })
    .catch(err => next(err))
  } else if (req.body.uri) {
    try {
      const trip = await Trip.findById(req.body._id)
      if (!trip) {
        res.status(400)
        res.send({msg: 'Trip not in database'})
      }
      trip.images.push({uri: req.body.uri})
      trip.save()
      res.status(200)
      res.header('Content-Type', 'application/json')
      res.json(trip)
    } catch(err) {
      res.status(400)
      res.send({msg: 'Server Error'})
    }
  } else if (req.body.note) {
    if (!req.body.noteId) {
      try {
        const trip = await Trip.findById(req.body._id)
        if (!trip) {
          res.status(400)
          res.send({msg: 'Trip not in database'})
        }
        trip.notes.push({note: req.body.note, date: req.body.date})
        await trip.save()
        res.status(200)
        res.header('Content-Type', 'application/json')
        res.json(trip)
      } catch(err) {
        res.status(400)
        res.send({msg: 'Server Error'})
      }
    } else {
      try {
        const trip = await Trip.findById(req.body._id)
        if (!trip) {
          res.status(400)
          res.send({msg: 'Trip not in database'})
        }
        for (let i = 0; i <= trip.notes.length - 1; i++) {
          if (trip.notes[i]._id.toString() === req.body.noteId.toString()) {
            trip.notes[i].note = req.body.note
            trip.save()
          }
        }
        res.status(200)
        res.header('Content-Type', 'application/json')
        res.json(trip)
      } catch(err) {
        res.status(401)
        res.send({msg: 'Server Error'})
      }
    }
  } else if (req.body.member) {
    try {
      const trip = await Trip.findById(req.body._id)
      if (!trip) {
        res.status(400)
        res.send({msg: 'Trip not in database'})
      }
      trip.members.push({member: req.body.member})
      trip.save()
      res.status(200)
      res.header('Content-Type', 'application/json')
      res.json(trip)
    } catch(err) {
      res.status(400)
      res.send({msg: 'Server Error'})
    }
  }
  
})
.delete(async (req, res, next) => {
  if (!req.body.imgObj && !req.body.notesObj && !req.body.memberObj) {
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
  } else if (req.body.imgObj) {
    try {
      const trip = await Trip.findById(req.body._id)


      if (!trip) {
        res.status(401)
        res.send({msg: 'Trip not in database'})
      }

      const index = await trip.images.findIndex(i => i._id.toString() === req.body.imgObj._id.toString())
      trip.images.splice(index, 1)
      trip.save()
      res.status(200)
      res.header('Content-Type', 'application/json')
      res.json(trip)
    } catch(err) {
      res.status(400)
      res.send({msg: 'Sever Error'})
    }
  } else if (req.body.notesObj) {
    try {
      const trip = await Trip.findById(req.body._id)

      if (!trip) {
        res.status(401)
        res.send({msg: 'Trip not in database'})
      }

      const index = await trip.notes.findIndex(i => i._id.toString() === req.body.notesObj._id.toString())
      trip.notes.splice(index, 1)
      trip.save()
      res.status(200)
      res.header('Content-Type', 'application/json')
      res.json(trip)
    } catch(err) {
      res.status(400)
      res.send({msg: 'Sever Error'})
    }
  } else if (req.body.memberObj) {
    try {
      const trip = await Trip.findById(req.body._id)
      if (!trip) {
        res.status(400)
        res.send({msg: 'Trip not in database'})
      }

      const index = await trip.members.findIndex(i => i._id.toString() === req.body.memberObj._id.toString())
      trip.members.splice(index, 1)
      trip.save()
      res.status(200)
      res.header('Content-Type', 'application/json')
      res.json(trip)
    } catch (error) {
      res.status(400)
      res.send({msg: 'Server Error'})
    }
  }
})

module.exports = tripRouter