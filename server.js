const express = require('express');
const cors = require('express-cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;
const app = express();
const { rescueAnimals } = require('./rescueAnimals');
const { donations } = require('./donations')

app.locals = { 
  title: 'Animal Rescue API', 
  rescueAnimals, 
  donations 
};

app.use(cors({
  allowedOrigins: ['localhost:3000']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/v1/rescue-animals', (req, res) => {
  res.status(200).json(app.locals.rescueAnimals);
});

app.get('/api/v1/donations', (req, res) => {
  res.status(200).json(app.locals.donations);
});

app.post('/api/v1/donations', (req, res) => {
  const newDonation = req.body;

  for (let requiredParameter of ['id', 'name', 'donation', 'animal_id']) {
    if (!newDonation[requiredParameter]) {
      return res.status(422).json({
        message: `You are missing a required parameter of ${requiredParameter}`
      });
    }
  }

  const { id, name, donation, animal_id } = newDonation;

  const match = app.locals.rescueAnimals.find(animal => animal.id == animal_id);

  if(!match) {
    return res.status(404).json({
      message: `No animal found with an id of ${animal_id}`
    });
  }

  app.locals.donations = [
    ...app.locals.donations, 
  { id, name, donation, animal_id}
  ];

  return res.status(201).json(app.locals.donations);
});

app.listen(port, () => {
  console.log(`${app.locals.title} is now running on ${port}!`)
});