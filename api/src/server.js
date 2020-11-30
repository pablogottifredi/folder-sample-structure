import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import config from './config';
import routes from './routes/base';

const expressValidator = require('express-validator');

const api = express();
api.use(cors()); 
api.use(compression()); 
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json()); 
api.use(expressValidator());
api.use(function(req,res,next){
	console.log(req.url);
	next();
}); 
api.use('/', routes);
api.listen(config.server.port, err => {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	console.log(`Is now running on internal port ${config.server.port} in ${config.env} mode.`);
});

module.exports = api;
