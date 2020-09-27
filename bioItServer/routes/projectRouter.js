const express = require("express");
const bodyParser = require("body-parser");
const Project = require("../models/projects");

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
    Project.findByIdAndDelete(req.body._id)
    .then(response => {
      res.stausCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(response)
    })
    .catch(err => next(err))
  })

projectRouter
.route('/:projectId/areas')
.get((req, res, next) => {
  Project.findById(req.params.projectId)
  .then(project => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json(project.areas)
  })
  .catch(err => next(err))
})
.post((req, res, next) => {
  Project.findById(req.params.projectId)
  .then(project => {
    project.areas.push(req.body)
    project.save()
    .then(project => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json')
      res.json(project)
    })
    .catch(err => next(err))
  })
  .catch(err => next(err))
})
// .put((req, res, next) => {
//   Project.findByIdAndUpdate(req.body._id)
//   .then(area => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json')
//     res.json(area)
//   })
//   .catch(err => next(err))
// })
// .delete((req, res, next) => {
//   Project.findById(req.params.projectId)
// })

projectRouter
.route('/:projectId/areas/:areaId')
.put((req, res, next) => {
  Project.findById(req.params.projectId)
  .then(project => {
    if(req.body.area) {
      project.areas.id(req.params.areaId).area = req.body.area;
    }
    if (req.body.geoRef) {
      project.areas.id(req.params.areaId).geoRef = req.body.geoRef;
    }
    project.save()
    .then(project => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json')
      res.json(project)
    })
    .catch(err => next(err))
  })
  .catch(err => next(err))
})
.delete((req, res, next) => {
  
})

module.exports = projectRouter;
