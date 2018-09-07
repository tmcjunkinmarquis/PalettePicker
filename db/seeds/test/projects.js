
exports.seed = function (knex, Promise) {
  return knex('palettes').del() 
    .then(() => knex('projects').del()) 
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          project_name: 'First Project'}, 'id')
          .then(project => {
            return knex('palettes').insert([
              { palette_name: 'Pretty', project_id: project[0], color_one: '#f89d64', color_two: '#60ec83', color_three: '#31782c', color_four: '#50efc0', color_five:'#418282' },
              { palette_name: 'Ugly', project_id: project[0], color_one: '#25e635', color_two: '#1ece27', color_three: '#a32380', color_four: '#1cddb0', color_five: '#396358' }
            ]);
          })
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]); 
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};