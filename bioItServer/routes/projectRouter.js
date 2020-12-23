const express = require("express");
const bodyParser = require("body-parser");
const Project = require("../models/projects");
const Area = require('../models/areas');
const multer = require('multer');
const auth = require('../middleware/auth');
const Trip = require("../models/trips");
const Species = require('../models/species');

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
  .post(auth, async (req, res, next) => {
    // req.body.img = req.file.buffer
    console.log(req.body)
    console.log(req.user.id)
    try {
      const exists = await Project.find()
      console.log('projects', exists)
      const index = exists.findIndex(i => i.name === req.body.name)
      let user = undefined
      if (index !== -1) {
        user = (exists[index].user.toString() === req.user.id.toString()) ? true : false
      }
      console.log('index', index)
      console.log('user', user)
      if (!user) {
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
      } else {
        next(err)
      }
    } catch {
      const err = new Error(`The ${req.body.name} project already exists!`)
      res.status(400)
      res.send(err)
    }
  })
  .put(async (req, res, next) => {
    if (req.body.state) {
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
      if (!req.body.noteId) {
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
      } else {
        try {
          const project = await Project.findById(req.body._id)
          if (!project) {
            res.status(400)
            res.send({msg: 'Project not in database'})
          }
          for (let i = 0; i <= project.notes.length - 1; i++) {
            if (project.notes[i]._id.toString() === req.body.noteId.toString()) {
              project.notes[i].note = req.body.note
              project.save()
            }
          }
          res.status(200)
          res.header('Content-Type', 'application/json')
          res.json(project)
        } catch(err) {
          res.status(401)
          res.send({msg: 'Server Error'})
        }
      }
    }
  })
  .delete(async (req, res, next) => {
    console.log('req.body', req.body)
    if (!req.body.imgObj && !req.body.notesObj) {
      async function asyncCall(req) {
        await Area.deleteMany({project: req.body._id})
      }
      const deleteTrips = async (req) => {
        const areas = await Area.find({project: req.body._id})
        const trips = await Trip.find()
        let idArr = []
        for (let i = 0; i <= areas.length - 1; i++) {
          idArr.push(areas[i]._id.toString())
        }
        for (let j = 0; j <= trips.length - 1; j++) {
          if (idArr.includes(trips[j].areaId.toString())) {
            trips[j].remove()
            trips[j].save()
          }
        }
      }
      const deleteSpecies = async req => {
        const species = await Species.find();
        species.forEach(s => {
          s.tripArr.forEach(t => {
            if (t.projectId.toString() === req.body._id.toString()) {
              t.remove()
              s.save()
            }
          })
        })
      }
      deleteSpecies(req, next)
      deleteTrips(req, next)
      asyncCall(req, next)
      Project.findOneAndDelete({_id: req.body._id})
      .then(response => {
        res.stausCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response)
      })
      .catch(err => next(err))
    } else if (req.body.imgObj) {
      try {
        const project = await Project.findById(req.body._id)

        console.log('projectFound', project)

        if (!project) {
          res.status(401)
          res.send({msg: 'Project not in database'})
        }

        const index = await project.images.findIndex(i => i._id.toString() === req.body.imgObj._id.toString())
        console.log('index', index)
        project.images.splice(index, 1)
        project.save()
        res.status(200)
        res.header('Content-Type', 'application/json')
        res.json(project)
      } catch(err) {
        res.status(400)
        res.send({msg: 'Sever Error'})
      }
    } else if (req.body.notesObj) {
      try {
        console.log('here')
        const project = await Project.findById(req.body._id)

        if (!project) {
          res.status(401)
          res.send({msg: 'Project not in database'})
        }

        const index = await project.notes.findIndex(i => i._id.toString() === req.body.notesObj._id.toString())
        console.log('index', index)
        project.notes.splice(index, 1)
        project.save()
        res.status(200)
        res.header('Content-Type', 'application/json')
        res.json(project)
      } catch(err) {
        res.status(400)
        res.send({msg: 'Sever Error'})
      }
    }
  })




module.exports = projectRouter;
