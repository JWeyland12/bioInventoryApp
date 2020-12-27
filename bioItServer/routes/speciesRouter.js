const express = require("express");
const bodyParser = require("body-parser");
const Species = require("../models/species");
const auth = require('../middleware/auth')

const speciesRouter = express.Router();
speciesRouter.use(bodyParser.json());

speciesRouter
  .route("/")
  .get(auth, async (req, res, next) => {
    try {
      const userSpecies = await Species.find({user: req.user.id})
      const defaultSpecies = await Species.find({default: true})

      const species = [...userSpecies, ...defaultSpecies]

      res.status(200)
      res.header('Content-Type', 'application/json')
      res.json(species)
    } catch (err) {
      next(err)
    }
  })
  .post(auth, (req, res, next) => {
    console.log('body', req.body)
    if(req.body.tripObj) {
      //species created from a trip
    req.body.tripArr = req.body.tripObj
    }
    req.body.user = req.user.id
    Species.create(req.body)
    .then(specimen => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json')
      res.json(specimen)
    })
    .catch(err => next(err))
  })
  .put(async (req, res, next) => {
    // updated from the master list - not reassigning tripArr references
    if (!req.body.tripObj) {
      Species.findByIdAndUpdate(req.body._id, { $set: req.body }, {new: true})
      .then(specimen => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(specimen)
      })
      .catch(err => next(err))
    } else {
      //species observed from a trip
      try{
        const specimen = await Species.findByIdAndUpdate(req.body._id, { $set: req.body }, {new: true})
        if(!specimen) {
          res.status(400);
          res.send('Specimen not in database')
        }
        if (!req.body.tripObj._id) {
          specimen.tripArr.push(req.body.tripObj)
        } else {
          //species count updated in a trip
          for (let i = 0; i <= specimen.tripArr.length - 1; i++) {
            if (req.body.tripObj._id.toString() === specimen.tripArr[i]._id.toString()) {
              specimen.tripArr[i].total = req.body.tripObj.total
              if (req.body.uri) {
                //add species images from a trip
                specimen.tripArr[i].images.push(req.body.uri)
              } if (req.body.note && !req.body.noteId) {
                specimen.tripArr[i].notes.push(req.body.note)
              }
              if (req.body.noteId) {
                const index = await specimen.tripArr[i].notes.findIndex(i => i._id.toString() === req.body.noteId.toString())
                specimen.tripArr[i].notes[index].note = req.body.note
              }
            }
          }
        }
        specimen.save()
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.send(specimen)
      } catch(err){
        err => next(err)
      }
    }
  })
  .delete(async (req, res, next) => {
    if (!req.body.imgObj && !req.body.notesObj && !req.body.tripArrId) {
      Species.findByIdAndDelete(req.body._id)
      .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(response)
      })
      .catch(err => next(err))
    } else if (req.body.imgObj) {
      try {
        const species = await Species.findById(req.body._id)
        const index = species.tripArr.findIndex(i => i._id.toString() === req.body.tripArrId.toString())
        const index1 = species.tripArr[index].images.findIndex(i => i._id.toString() === req.body.imgObj._id.toString())
        species.tripArr[index].images.splice(index1, 1)
        species.save()
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        res.json(species)
      } catch (err) {
        res.status(400)
        res.send({msg: 'Image Could not be removed'})
      }
    }  else if (req.body.notesObj) {
      try {
        const species = await Species.findById(req.body._id)
        const index = species.tripArr.findIndex(i => i._id.toString() === req.body.tripArrId.toString())
        const index1 = species.tripArr[index].notes.findIndex(i => i._id.toString() === req.body.notesObj._id.toString())
        species.tripArr[index].notes.splice(index1, 1)
        species.save()
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        res.json(species)
      } catch (err) {
        res.status(400)
        res.send({msg: 'Image Could not be removed'})
      }
    } else if (!req.body.notesObj && !req.body.imgObj && req.body.tripArrId) {
      try {
        const species = await Species.findById(req.body._id)
        const index = species.tripArr.findIndex(i => i._id.toString() === req.body.tripArrId.toString())
        species.tripArr.splice(index, 1)
        species.save()
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        res.json(species)
      } catch (err) {
        res.status(400)
        res.send({msg: 'Specimen Could not be removed'})
      }
    }
  })

  speciesRouter
  .route('/admin')
  .get(auth, async (req, res, next) => {
    try {
      const species = await Species.find({default: true})
      res.status(200)
      res.setHeader('Content-Type', 'application/json')
      res.json(species)
    } catch (err) {
      res.status(400)
      res.send({msg: 'Server Error'})
    }
  })
  .post(auth, async (req, res, next) => {
    try {
      if(req.body.tripObj) {
        //species created from a trip
      req.body.tripArr = req.body.tripObj
      }
      req.body.user = req.user.id
      req.body.default = true
      const species = await Species.create(req.body)
      console.log('species', species)
      res.status(200)
      res.setHeader('Content-Type', 'application/json')
      res.json(species)
    } catch (err) {
      res.status(400)
      next(err)
    }
  })
  .put(auth, async (req, res, next) => {
    console.log(req.body)
    try {
      if (req.body.user.admin) {
        const species = await Species.findByIdAndUpdate(req.body._id, { $set: req.body }, {new: true})
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        res.json(species)
      } else {
        const err = new Error('Admin privilieges required')
        res.status(400)
        res.send(err)
      }
    } catch (err) {
      res.status(200)
      next(err)
    }
  })
  .delete(auth, async (req, res, next) => {
    console.log('body', req.body)
    try {
      if (req.body.user.admin) {
        const species = await Species.findByIdAndDelete({_id: req.body._id})
        console.log('species', species)
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        res.json(species)
      } else {
        const err = new Error('Admin privilieges required')
        res.status(400)
        res.send(err)
      }
    } catch (err) {
      res.status(200)
      next(err)
    }
  })

module.exports = speciesRouter;

