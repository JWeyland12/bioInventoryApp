const express = require("express");
const bodyParser = require("body-parser");
const Area = require('../models/areas')
const auth = require('../middleware/auth')

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
  Area.findByIdAndDelete(req.body._id)
  .then(response => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response)
  })
  .catch(err => next(err))
})


module.exports = areaRouter