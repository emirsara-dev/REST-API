const express = require('express');
// const routes = require('./routes/api') //We don't need it as we only  use it once.
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Set up express app
const app = express();

// Connect to mongodb
mongoose.connect('mongodb://localhost/persongo');
// deprecated: mongoose.Promise = global.Promise;

app.use(express.static('public'));

app.use(bodyParser.json());

// Initialize routes
app.use('/api', require('./routes/api'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.log(err);
    res.status(422).send({error: err.message});
});

// Listen for requests
app.listen(process.env.port || 4000, () => {
    console.log('Now listening for requests');
});
