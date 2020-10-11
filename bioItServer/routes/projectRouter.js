const express = require("express");
const bodyParser = require("body-parser");
const Project = require("../models/projects");
const Area = require('../models/areas')
const multer = require('multer');

const upload = multer({
  dest: 'public/images'
})

const projectRouter = express.Router();

projectRouter.use(bodyParser.json());

projectRouter
  .route("/")
  .get(upload.single('imageFile'), (req, res, next) => {
    Project.find()
      .then((Projects) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(Projects);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Project.create(req.body)
      .then((project) => {
        console.log("Project Created", project);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(project);
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    Project.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true })
    .then(project => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json')
      res.json(project)
    })
    .catch(err => next(err))
  })
  .delete((req, res, next) => {
    async function asyncCall(req) {
      await Area.deleteMany({project: req.body._id})
    }
    asyncCall(req, next)
    Project.findOneAndDelete({_id: req.body._id})
    .then(response => {
      res.stausCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(response)
    })
    .catch(err => next(err))
  })




module.exports = projectRouter;
