var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/app');
var serverAddress = '127.0.0.1:3000';
var should = chai.should();

chai.use(chaiHttp);

describe('Ad-Campaign', function() {
	it('should list all campaigns on /ad/list GET', function(done) {
	  chai.request(serverAddress)
	    .get('/ad/list')
	    .end(function(err, res){
	      res.should.have.status(200);
	      done();
	    });
	});

	it('should add a SINGLE campaign on /ad POST', function(done) {
	  chai.request(serverAddress)
	    .post('/ad')
	    .send({
				"partner_id": "samsung",
				"duration": 3,
				"ad_content": "Samsung the best"
		})
	    .end(function(err, res){
	      res.should.have.status(200);
	      res.should.be.json;
	      res.body.should.be.a('object');
	      res.body.should.have.property('SUCCESS');
	      done();
	    });
	});	

	it('should list a SINGLE campaign on /ad/<id> GET', function(done) {
	  chai.request(serverAddress)
	    .post('/ad')
	    .send({
				"partner_id": "samsung",
				"duration": 3,
				"ad_content": "Samsung the best"
		});
	  chai.request(serverAddress)
	    .post('/ad')
	    .send({
				"partner_id": "bpl",
				"duration": 1,
				"ad_content": "BPL is the best brand"
		});

      chai.request(serverAddress)
	        .get('/ad/' + 'samsung')
	        .end(function(err, res){
	          res.should.have.status(200);
	          res.should.be.json;
	          res.body.should.be.a('object');
	          res.body.should.have.property('partner_id');
	          res.body.should.have.property('duration');
	          res.body.should.have.property('ad_content');
	          res.body.partner_id.should.equal('samsung');
	          done();
       });

      chai.request(serverAddress)
	        .get('/ad/' + 'bpl')
	        .end(function(err, res){
	          res.should.have.status(200);
	          res.should.be.json;
	          res.body.should.be.a('object');
	          res.body.should.have.property('partner_id');
	          res.body.should.have.property('duration');
	          res.body.should.have.property('ad_content');
	          res.body.partner_id.should.equal('bpl');
	          done();
       });	        
	});	

	it('should fail to list a campaign on /ad/<id> GET', function(done) {
      chai.request(serverAddress)
	        .get('/ad/' + 'abc')
	        .end(function(err, res){
	          res.should.have.status(500);
	          res.should.be.json;
	          res.body.should.be.a('object');
 			  res.body.should.have.property('FAIL');	          
	          done();
       });       
	});		

	it('should fail to add TWO active campaigns on /ad POST', function(done) {
	  chai.request(serverAddress)
	    .post('/ad')
	    .send({
				"partner_id": "samsung",
				"duration": 1,
				"ad_content": "Samsung the best again"
		})
	    .end(function(err, res){
	      res.should.have.status(500);
	      res.should.be.json;
	      res.body.should.be.a('object');
	      res.body.should.have.property('FAIL');
	      done();
	    });         
	});		
});

