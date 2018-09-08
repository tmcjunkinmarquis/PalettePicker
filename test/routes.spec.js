process.env.NODE_ENV = 'test';

const server = require('../server');
const configuration = require('../knexfile')['test'];
const knex = require('knex')(configuration);
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe("Test client endpoint ' / '", () => {
  it('base route should return html ', (done) => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200); //always test the status code 
        response.should.be.html; //should always test the type
        //always test properties, if any(object)
        done();
      })
  });
  it('A path that does not exist should return 404', (done) => {
    chai.request(server)
      .get('/sad')  //sad path which does not exist
      .end((error, response) => {
        response.should.have.status(404);
        done()
      })
  });
});

describe("API routes  ", () => {
  beforeEach(done => {
    knex.migrate.rollback().then(() => {
      knex.migrate.latest().then(() => {
        return knex.seed.run().then(() => {
          done();
        });
      });
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should return an array of all projects, each with the correct properties ', (done) => {
      chai.request(server)
        .get('/api/v1/projects/')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('project_name');
          response.body[0].project_name.should.equal('First Project');
          done();
        })
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('should return an array of all palettes, each with the correct properties', (done) => {
      chai.request(server)
        .get('/api/v1/palettes')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('palette_name');
          response.body[0].palette_name.should.equal('Pretty');
          response.body[0].should.have.property('project_id');
          response.body[0].project_id.should.equal(1);
          response.body[0].should.have.property('color_one');
          response.body[0].color_one.should.equal('#f89d64')
          response.body[0].should.have.property('color_two');
          response.body[0].color_two.should.equal('#60ec83')
          response.body[0].should.have.property('color_three');
          response.body[0].color_three.should.equal('#31782c')
          response.body[0].should.have.property('color_four');
          response.body[0].color_four.should.equal('#50efc0')
          response.body[0].should.have.property('color_five');
          response.body[0].color_five.should.equal('#418282');
          done();
        })
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should return an object with an id property', (done) => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({ project_name: 'Theresas Project' })
        .end((error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(2);
          done();
        });

    });
    it('should return a status code of 422 if the user enters an invalid project name', (done) => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({ project_name: '' })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('Error');
          response.body.Error.should.equal('Missing project name');
          done();
        })
    });

  });

});