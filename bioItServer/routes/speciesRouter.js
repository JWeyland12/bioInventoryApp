const express = require("express");
const bodyParser = require("body-parser");
const Species = require("../models/species");

const speciesRouter = express.Router();
speciesRouter.use(bodyParser.json());

speciesRouter
  .route("/")
  .get((req, res, next) => {
    Species.find()
      .then((species) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(species);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    async function speciesExists(req) {
      const specimen = await Species.exists({ sciName: req.body.sciName });
      return specimen;
    }
    speciesExists(req)
      .then((specimen) => {
        // handles species created within a trip that already exists in species list
        if (specimen && req.body.tripObj) {
          Species.findById(req.body._id)
            .then((specimen) => {
              console.log('Species exists, adding tripRef to array')
              const tripRefArr = specimen.tripArr.map(tripArr => tripArr.tripRef)
              // make sure species is unique to trip
              if (!tripRefArr.includes(req.body.tripObj.tripRef)) {
              specimen.tripArr.push(req.body.tripObj);
              specimen.save()
              .then((specimen) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(specimen);
              })
              .catch(err => next(err))
            } else {
              const err = new Error(`You've already found a ${specimen.comName} on this trip!`)
              err.statusCode = 406;
              return next(err)
            }
            })
            .catch((err) => next(err))
        } else if (specimen) {
          // handles species created from species list that already exists
          console.log('Species created from species list - already exists')
          const err = new Error(`${req.body.sciName} already exists!`);
          err.statusCode = 406;
          return next(err);
        } else if (!specimen && req.body.tripObj) {
          // handles speceies created within a trip that doesn't exist
          console.log('species created within a trip')
          req.body.tripArr = [req.body.tripObj];
          Species.create(req.body)
            .then((specimen) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(specimen);
            })
            .catch((err) => next(err));
        } else {
          // handles species created from species list
          console.log('species created from species list')
          Species.create(req.body)
            .then((specimen) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(specimen);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {});

module.exports = speciesRouter;
