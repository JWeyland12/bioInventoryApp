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
    if(req.body.tripObj) {
      //species created from a trip
      console.log(req.body.tripObj)
    req.body.tripArr = req.body.tripObj
    }
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
              } if (req.body.note) {
                specimen.tripArr[i].notes.push(req.body.note)
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
  .delete((req, res, next) => {
    Species.findByIdAndDelete(req.body._id)
    .then(response => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json')
      res.json(response)
    })
    .catch(err => next(err))
  })

module.exports = speciesRouter;


// Species.findById(req.body._id)
//       .then((specimen) => {
//         if (specimen && !req.body.tripArr) {
//           specimen.sciName = req.body.sciName;
//           specimen.comName = req.body.comName;
//           scecimen.img = req.body.img;
//           for (let i = 0; i <= specimen.tripArr.length - 1; i++) {
//             console.log("enter loop")

//             if (specimen.tripArr[i]._id.toString() === req.body.tripArr._id.toString()) {
//               specimen.tripArr[i].tripRef = req.body.tripArr.tripRef;
//               specimen.tripArr[i].total = req.body.tripArr.total;
//               break;
//             } else {
//               console.log(specimen.tripArr[i]._id);
//               console.log(req.body.tripArr._id);
//               console.log("you didn't enter the if block, try again");
//             }
//           }
//           specimen
//             .save()
//             .then((specimen) => {
//               res.statusCode = 200;
//               res.setHeader("Content-Type", "application/json");
//               res.json(specimen);
//             })
//             .catch((err) => next(err));
//         } else {
//           const err = new Error(`${specimen} does not exist!`);
//           err.statusCode = 404;
//           return next(err);
//         }
//       })
//       .catch((err) => next(err));
//   })

// POST
// async function speciesExists(req) {
//   const specimen = await Species.exists({ sciName: req.body.sciName });
//   return specimen;
// }
// speciesExists(req)
//   .then((specimen) => {
//     // handles species created within a trip that already exists in species list
//     if (specimen && req.body.tripObj) {
//       Species.findById(req.body._id)
//         .then((specimen) => {
//           console.log("Species exists, adding tripRef to array");
//           const tripRefArr = specimen.tripArr.map((tripArr) => tripArr.tripRef);
//           // make sure species is unique to trip
//           if (!tripRefArr.includes(req.body.tripObj.tripRef)) {
//             specimen.tripArr.push(req.body.tripObj);
//             specimen
//               .save()
//               .then((specimen) => {
//                 res.statusCode = 200;
//                 res.setHeader("Content-Type", "application/json");
//                 res.json(specimen);
//               })
//               .catch((err) => next(err));
//           } else {
//             const err = new Error(`You've already found a ${specimen.comName} on this trip!`);
//             err.statusCode = 406;
//             return next(err);
//           }
//         })
//         .catch((err) => next(err));
//     } else if (specimen) {
//       // handles species created from species list that already exists
//       console.log("Species created from species list - already exists");
//       const err = new Error(`${req.body.sciName} already exists!`);
//       err.statusCode = 406;
//       return next(err);
//     } else if (!specimen && req.body.tripObj) {
//       // handles speceies created within a trip that doesn't exist
//       console.log("species created within a trip");
//       req.body.tripArr = [req.body.tripObj];
//       Species.create(req.body)
//         .then((specimen) => {
//           res.statusCode = 200;
//           res.setHeader("Content-Type", "application/json");
//           res.json(specimen);
//         })
//         .catch((err) => next(err));
//     } else {
//       // handles species created from species list
//       console.log("species created from species list");
//       Species.create(req.body)
//         .then((specimen) => {
//           res.statusCode = 200;
//           res.setHeader("Content-Type", "application/json");
//           res.json(specimen);
//         })
//         .catch((err) => next(err));
//     }
//   })
//   .catch((err) => next(err));
// })

// const specimen = await Species.findByIdAndUpdate({_id: req.body._id}, { $set: req.body }, {new: true})
//       console.log(req.body._id)
//       console.log('specimen', specimen)
//       .then(specimen => {
//         if (!req.body.tripObj._id) {
//         specimen.tripArr.push(req.body.tripObj)
//         } else {
//           //species count in trip updated
//           for (let i = 0; i <= specimen.tripArr.length - 1; i++) {
//             if (req.body.tripObj._id.toString() === specimen.tripArr[i]._id.toString()) {
//               specimen.tripArr[i].total = req.body.tripObj.total
//             }
//           }
//         }
//         specimen.save()
//       .then(specimen => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json')
//         res.json(specimen)
//       })
//       .catch(err => next(err))
//       })
//     }