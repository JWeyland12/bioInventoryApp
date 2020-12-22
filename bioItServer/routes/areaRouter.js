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

.put(async (req, res, next) => {
  if (req.body.area) {
    Area.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true })
    .then(area => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json')
      res.json(area)
    })
    .catch(err => next(err))
  } else if (req.body.uri) {
    try {
      const area = await Area.findById(req.body._id)
      if (!area) {
        res.status(400);
        res.send({msg: 'Area not in database'})
      }
      area.images.push({uri: req.body.uri})
      area.save()
      res.status(200)
      res.header('Content-Type', 'application/json')
      res.json(area)
    } catch(err) {
      res.status(400)
      res.send({msg: 'Server Error'})
    }
  } else if (req.body.note) {
    console.log('here I am')
    if (!req.body.noteId) {
      try {
        const area = await Area.findById(req.body._id)
        if (!area) {
          res.status(400)
          res.send({msg: 'Area not in database'})
        }
        area.notes.push({note: req.body.note, date: req.body.date})
        await area.save()
        res.status(200)
        res.header('Content-Type', 'application/json')
        res.json(area)
      } catch(err) {
        res.status(400)
        res.send({msg: 'Server Error'})
      }
    } else {
      try {
        const area = await Area.findById(req.body._id)
        if (!area) {
          res.status(400)
          res.send({msg: 'Area not in database'})
        }
        for (let i = 0; i <= area.notes.length - 1; i++) {
          if (area.notes[i]._id.toString() === req.body.noteId.toString()) {
            area.notes[i].note = req.body.note
            area.save()
          }
        }
        res.status(200)
        res.header('Content-Type', 'application/json')
        res.json(area)
      } catch(err) {
        res.status(401)
        res.send({msg: 'Server Error'})
      }
    }
  }
})

.delete(async (req, res, next) => {
  console.log(req.body)
  if (!req.body.imgObj && !req.body.notesObj) {
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
  }
  else if (req.body.imgObj) {
    try {
      const area = await Area.findById(req.body._id)

      console.log('areaFound', area)

      if (!area) {
        res.status(401)
        res.send({msg: 'Area not in database'})
      }

      const index = await area.images.findIndex(i => i._id.toString() === req.body.imgObj._id.toString())
      console.log('index', index)
      area.images.splice(index, 1)
      area.save()
      res.status(200)
      res.header('Content-Type', 'application/json')
      res.json(area)
    } catch(err) {
      res.status(400)
      res.send({msg: 'Sever Error'})
    }
  } else if (req.body.notesObj) {
    try {
      console.log('here')
      const area = await Area.findById(req.body._id)

      if (!area) {
        res.status(401)
        res.send({msg: 'Area not in database'})
      }

      const index = await area.notes.findIndex(i => i._id.toString() === req.body.notesObj._id.toString())
      console.log('index', index)
      area.notes.splice(index, 1)
      area.save()
      res.status(200)
      res.header('Content-Type', 'application/json')
      res.json(area)
    } catch(err) {
      res.status(400)
      res.send({msg: 'Sever Error'})
    }
  }
})


module.exports = areaRouter