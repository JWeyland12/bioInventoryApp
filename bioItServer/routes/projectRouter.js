const express = require("express");
const bodyParser = require("body-parser");
const Project = require("../models/projects");
const Area = require('../models/areas');
const multer = require('multer');
const auth = require('../middleware/auth');

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
  .get(auth, (req, res, next) => {
    // console.log(req.user.id)
    // const user = await req.user.id
    // console.log(user)
    Project.find({user: req.user.id})
      .then((Projects) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(Projects);
      })
      .catch((err) => next(err));
  })
  .post(auth, (req, res, next) => {
    // req.body.img = req.file.buffer
    console.log(req.user)
    req.body.user = req.user.id
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
  .put(async (req, res, next) => {
    console.log('body', req.body)
    if (!req.body.uri && !req.body.note) {
      Project.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true })
      .then(project => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(project)
      })
      .catch(err => next(err))
    } else if (req.body.uri) {
      try {
        const project = await Project.findById(req.body._id)
        if (!project) {
          res.status(400);
          res.send({msg: 'Project not in database'})
        }
        project.images.push({uri: req.body.uri})
        project.save()
        res.status(200)
        res.header('Content-Type', 'application/json')
        res.json(project)
      } catch(err) {
        res.status(400)
        res.send({msg: 'Server Error'})
      }
    } else if (req.body.note) {
      try {
        const project = await Project.findById(req.body._id)
        if (!project) {
          res.status(400)
          res.send({msg: 'Project not in database'})
        }
        project.notes.push({note: req.body.note, date: req.body.date})
        await project.save()
        res.status(200)
        res.header('Content-Type', 'application/json')
        res.json(project)
      } catch(err) {
        res.status(400)
        res.send({msg: 'Server Error'})
      }
    }
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
