var express = require('express');
var connectDomain = require('connect-domain');
var path = require('path');
var bodyParser = require('body-parser');
var errorHandler;
var ALLOW_MULTIPLE_CAMPAGIN_PER_PARTNER = false;

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(connectDomain());  
    errorHandler = function (err, req, res, next) {  
        res.status(500).send({
           "status": "error",
           "message": err.message
        });
    console.log(err);
};

var ads = [
];

ads.get = function(partner_id){
	for (var i = 0; ads.length > i; i += 1) {
    	if(ads[i].partner_id === partner_id){
    		return ads[i]
    	}
	}
	return null;
};

ads.getActiveCampaign = function(partner_id){
	for (var i=0; i < ads.length; i++) {
    	if(ads[i].partner_id == partner_id){
    		//SIMULATION MODE: DURATION IS IN MINUTES FOR TESTABILITY
			var campaign_time = Date.parse(ads[i].created_on) + (parseInt(ads[i].duration) * 60 * 1000);
			var current_time = new Date().getTime();    
			if(campaign_time > current_time){
	    		return ads[i];
	   		} 
    	}
	}
	return null;	
};

app.get('/ad/list', function(req, res) {
   	res.status(200).send(ads);
}).use(errorHandler);

app.get('/ad/:id', function(req, res) {
	var retItem = ads.getActiveCampaign(req.params.id);
	if(retItem != null){
    	res.status(200).send(retItem);
	    return;
	} 
	res.status(500).send({'FAIL': 'No active campaign found for ' + req.params.id});
}).use(errorHandler);

app.post('/ad', function(req, res){
	if(ads.getActiveCampaign(req.body.partner_id)==null){
		ads.push({
			partner_id: req.body.partner_id,
			duration: req.body.duration,
			ad_content: req.body.ad_content,
			created_on: new Date()
		});

		res.status(200).send({'SUCCESS': 'Successfully registered new campaign for ' + req.body.partner_id});
		return;
	}
	res.status(500).send({'FAIL': 'Error registering campaign for ' + req.body.partner_id});
});

app.put('/ad/:id', function(req, res){
	var retItem = ads.getActiveCampaign(req.params.id);
	if(retItem != null)
	{
		var idx = ads.indexOf(retItem);
		ads.splice(idx, 1);
		ads.push({
			partner_id: req.params.id,
			duration: req.body.duration,
			ad_content: req.body.ad_content,
			created_on: new Date()
		});

		res.status(200).send({'SUCCESS': 'Successfully updated campaign for ' + req.params.id});
		return;
	}
	res.status(500).send({'FAIL': 'Error updating campaign for ' +req.params.id});
});

app.delete('/ad/:id', function(req, res){
	var retItem = ads.getActiveCampaign(req.params.id);
	if(retItem != null)
	{
		var idx = ads.indexOf(retItem);
		ads.splice(idx, 1);

		res.status(200).send({'SUCCESS': 'Successfully deleted campaign for ' + req.params.id});
		return;
	}
	res.status(500).send({'FAIL': 'Error deleting campaign for ' +req.params.id});
});

app.listen(3000);
console.log('Listening on port 3000...');
