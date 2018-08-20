const express = require('express');  //ES5 import express from node_modules, assign to express constant
const app = express(); //create instance of express
const environment = process.env.NODE_ENV || 'development';  //make the environment default to development except for hosting site
const configuration = require('./knexfile')[environment];  //config file for knex access to database
const database = require('knex')(configuration); //database for knex
const bodyParser = require('body-parser'); //body-parser for posting


app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);//default localhost to 3000 except for hosting
app.locals.title = 'Palette Picker'; //data for dev prior to server creation

app.use(express.static('public'));//point express to the public folder for the app

app.get('/', (request, response) => {
  // response.status(200).sendFile('public/index.html', { root: __dirname });
});

// app.locals.projects = [
//   { id: 'p1', name: 'Hello World' },
//   { id: 'p2', name: 'Goodbye World' },
//   { id: 'p3', name: 'So Sad' }
// ];

// app.locals.palettes = [
//   { id: 'l1', project_id: 'p1', color_one: '#3BABCB', color_two: '#3BABCB', color_three: '#3BABCB', color_four: '#3BABCB', color_five: '#3BABCB'},
//   { id: 'l2', project_id: 'p2', color_one: '#2AE13B', color_two: '#2AE13B', color_three: '#2AE13B', color_four: '#2AE13B', color_five: '#2AE13B' },
//   { id: 'l3', project_id: 'p3', color_one: '#D73479', color_two: '#D73479', color_three: '#D73479', color_four: '#D73479', color_five: '#D73479' }
// ];

app.get('/api/v1/projects', (request, response) => { //retrieve project from database endpoint
  database('projects').select()
  .then((projects)=>{
    response.status(200).json(projects);
  })
  .catch((error)=>{
    response.status(500).json({ error });
  });
});

app.get('/api/v1/palettes', (request, response) => { //retrieve palettes from database endpoint
  database('palettes').select()
    .then((palettes) => {
      response.status(200).json(palettes);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response)=>{ //post projects to database endpoint
const project = request.body;
  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/palettes', (request, response) => { //post palettes to database endpoint
  const palette = request.body;

  // for (let requiredParameter of ['palette_name', 'project_id', 'color_one', 'color_two', 'color_three', 'color_four', 'color_five']) {
  //   if (!palette[requiredParameter]) {
  //     return response
  //       .status(422)
  //       .send(`Expected format: { palette_name: <String>, project_id: <Number>, color_one: <String>, color_two: <String>, color_three: <String>, color_four: <String>, color_five: <String>}. You're missing a "${requiredParameter}" property.`);
  //   }
  // }

  database('palettes').insert(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes/:id', (request, response) => {  //get dynamically defined palette from database
  database('palettes').where('id', request.params.id).select()
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

app.listen(app.get('port'), () => { //getting the server listening at the beginning
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});