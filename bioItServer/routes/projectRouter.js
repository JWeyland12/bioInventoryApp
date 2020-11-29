const express = require("express");
const bodyParser = require("body-parser");
const Project = require("../models/projects");
const Area = require('../models/areas');
const multer = require('multer');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/projects')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    console.log('body.name:', req.body)
    const name = req.obj.name;
    cb(null, `${name}-project-${Date.now()}.${ext}`)
  }
});

const multerFilter = (req, file, cb) => {
  if (file.originalname.match(/\.(jpg|jpeg)$/)) {
    cb(null, true)
  } else {
    return cb(new Error('You can only upload jpg or jpeg files!'), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const projectRouter = express.Router();

projectRouter.use(bodyParser.json());


projectRouter
  .route("/")
  .get((req, res, next) => {
    Project.find()
      .then((Projects) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(Projects);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    console.log('req.file:', req.file)
    console.log('req.body', req.body)
    // req.body.img = req.file.buffer
    Project.create(req.body)
      .then((project) => {
        console.log("Project Created", project);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(project);
      })
      .catch(() => {
        const err = new Error(`The ${req.body.name} project already exists!`)
        err.statusCode = 406
        return next(err)
      });
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
