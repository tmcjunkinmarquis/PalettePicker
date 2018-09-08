const express = require('express'); //ES5 import express from node_modules, assign to express constant
const app = express(); //create instance of express
const environment = process.env.NODE_ENV || 'development'; //make the environment default to development except for hosting site
const configuration = require('./knexfile')[environment]; //config file for knex access to database
const database = require('knex')(configuration); //database for knex
const bodyParser = require('body-parser'); //body-parser for posting

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000); //default localhost to 3000 except for hosting
app.locals.title = 'Palette Picker'; //data for dev prior to server creation

app.use(express.static('public')); //point express to the public folder for the app

app.get('/api/v1/projects', (request, response) => {
  //retrieve project from database endpoint
  database('projects')
    .select()
    .then(projects => {
      response.status(200).json(projects);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes', (request, response) => {
  //retrieve palettes from database endpoint
  database('palettes')
    .select()
    .then(palettes => {
      response.status(200).json(palettes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  //post projects to database endpoint
  const project = request.body;
  if (!project.project_name) {
    return response.status(422).send({ Error: 'Missing project name' });
  }
  database('projects')
    .insert(project, 'id')
    .then(id => {
      response.status(201).json({ id: id[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/palettes', (request, response) => {
  //post palettes to database endpoint
  const palette = request.body;

  for (let requiredParameter of [
    'palette_name',
    'project_id',
    'color_one',
    'color_two',
    'color_three',
    'color_four',
    'color_five'
  ]) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send(
          `Expected format: { palette_name: <String>, project_id: <Number>, color_one: <String>, color_two: <String>, color_three: <String>, color_four: <String>, color_five: <String>}. You're missing a "${requiredParameter}" property.`
        );
    }
  }

  database('palettes')
    .insert(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes/:id', (request, response) => {
  //get dynamically defined palette from database
  database('palettes')
    .where('id', request.params.id)
    .select()
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes);
      } else {
        response.status(404).json({
          error: `Could not find palette with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;
  database('palettes')
    .where('id', id)
    .del()
    .then(deleted => {
      if (deleted > 0) {
        response.status(200).json({ Success: `Item ${id} deleted` });
      } else {
        response.status(404).json({ Error: `Item ${id} not found` });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  //getting the server listening at the beginning
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
