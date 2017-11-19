const express = require('express');
const router = express.Router();
const multer = require('multer');
var uploader = multer();
const Restaurant = require('../models').Restaurant;
const Dish = require('../models').Dish;
const AddOn = require('../models').AddOn;

router.post('/upload', uploader.single('file'), function(req, res) {
	var source = '[POST /picture/upload]';
	var s3 = req.app.get('s3');
	var file = req.file.buffer;
	var filename = require('crypto').randomBytes(20).toString('hex') + req.body.ext;
  	s3.putObject(
	    'hunqrystorage',
	    filename,
	    file,
	    'application/octet-stream',
	    function(error, etag) {
	      if (error) {
	        console.log(source, 'Error: Failed to upload file: ' + error);
	        res.status(500).send('Failed to upload file');
	      } else {
	        console.log(source, 'Success: File uploaded successfully');
	        res.json({
	        	link: 'https://s3-ap-southeast-1.amazonaws.com/hunqrystorage/' + filename
	        })
	      }
	  	}
    )
});

router.put('/:restaurantId/restaurant/changePicture', function(req, res) {
	var source = '[PUT /picture/restaurant/changePicture]';
	let restaurantId = req.params.restaurantId;

	Restaurant.findById(restaurantId)
	.then(restaurant => {
		restaurant.updateAttributes({
			displayPicture: req.body.displayPicture
		}).then(() => {
			res.json({
		  		status: 'Success'
		  	});
		}).catch(e => {
			console.log(e);
			res.status(500).send("" + e);
		})
	})
	.catch(e => {
		console.log(e);
		res.status(500).send("" + e);
	})
})

router.put('/:restaurantId/dish/:dishId/changePicture', function(req, res) {
	var source = '[POST /picture/dish/changePicture]';
	let restaurantId = req.params.restaurantId;
	let dishId = req.params.dishId;

	Restaurant.findById(restaurantId)
	.then(restaurant => {
		restaurant.getDishes({
			where: {
				id: dishId
			}
		})
		.then(dish => {
			dish[0].updateAttributes({
				displayPicture: req.body.displayPicture
			}).then(() => {
				res.json({
			  		status: 'Success'
			  	});
			}).catch(e => {
				console.log(e);
				res.status(500).send("" + e);
			})
		})
		.catch(e => {
			console.log(e);
			res.status(500).send("" + e);
		})
	})
	.catch(e => {
		console.log(e);
		res.status(500).send("" + e);
	})
})

router.put('/:restaurantId/addOn/:addOnId/changePicture', function(req, res) {
	var source = '[PUT /picture/addOn/changePicture]';
	let restaurantId = req.params.restaurantId;
	let addOnId = req.params.addOnId;

	Restaurant.findById(restaurantId)
	.then(restaurant => {
		restaurant.getAddOns({
			where: {
				id: addOnId
			}
		})
		.then(addOn => {
			addOn.updateAttributes({
				displayPicture: req.body.displayPicture
			}).then(() => {
				res.json({
			  		status: 'Success'
			  	});
			}).catch(e => {
				console.log(e);
				res.status(500).send("" + e);
			})
		})
		.catch(e => {
			console.log(e);
			res.status(500).send("" + e);
		})
	})
	.catch(e => {
		console.log(e);
		res.status(500).send("" + e);
	})
})

module.exports = router;