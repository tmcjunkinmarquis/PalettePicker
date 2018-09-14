const express = require('express'); 
const app = express(); 
const environment = process.env.NODE_ENV || 'development'; 
const configuration = require('./knexfile')[environment]; 
const database = require('knex')(configuration); 
const bodyParser = require('body-parser'); 

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000); 
app.locals.title = 'Palette Picker'; 

app.use(express.static('public')); 

app.get('/api/v1/projects', (request, response) => {
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
  const project = request.body;

  if (!project.project_name) {
    return response.status(422).json({ Error: 'Missing project name' });
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
        .json(
          `Expected format { 
            palette_name: <String>, 
            project_id: <Number>, 
            color_one: <String>, 
            color_two: <String>, 
            color_three: <String>, 
            color_four: <String>, 
            color_five: <String>}. You're missing a "${requiredParameter}" property.`
        );
    }
  }

  database('palettes')
    .insert(palette, 'id')
    .then(id => {
      response.status(201).json({ id: id[0] });
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
    .then(num_of_deleted_palettes => {
      if (num_of_deleted_palettes > 0) {
        response.status(200).json({ Success: `Item ${id} deleted` });
      } else {
        response.status(422).json({ Error: `Item ${id} not found` });
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
