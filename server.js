const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.use(express.static('public'));

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

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
  .then((projects)=>{
    response.status(200).json(projects);
  })
  .catch((error)=>{
    response.status(500).json({ error });
  });
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then((palettes) => {
      response.status(200).json(palettes);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['project_name']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { title: <String>, author: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});