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

});