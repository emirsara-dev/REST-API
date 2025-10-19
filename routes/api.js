const express = require('express');
const router = express.Router();
const Person = require('../models/people');
// Get a list of people from the db
router.get('/people', async (req, res) => {
  try {
    const lng = parseFloat(req.query.lng);
    const lat = parseFloat(req.query.lat);

    const people = await Person.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance",  // adds a "distance" field to each document
          maxDistance: 100000,        // 100 km radius
          spherical: true
        }
      }
    ]);

    res.send(people);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Add new people to the db
router.post('/people', (req, res, next) => {
    Person.create(req.body).then((person) => {
        res.send(person);
    }).catch(next);
});

// Update a person in the db
router.put('/people/:id', (req, res, next) => {
    Person.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
        Person.findOne({_id: req.params.id}).then((person) => {
            res.send(person);
        });
    });
});

// Delete a person from the db
router.delete('/people/:id', (req, res, next) => {
    console.log(req.params.id);
    Person.findByIdAndDelete({_id: req.params.id}).then((person) => {
        res.send(person);
    })
});

module.exports = router;
