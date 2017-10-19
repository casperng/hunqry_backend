const express = require('express');
const router = express.Router();
const Restaurant = require('../models').Restaurant;
const Dish = require('../models').Dish;
const AddOn = require('../models').AddOn;
const Section = require('../models').Section;

/* POST add new restaurant */
router.post('/addNew', function(req, res) {
  var source = '[POST /restaurants/addNew]';
  Restaurant.create({
  	name: req.body.name,
  	address: req.body.address,
  	displayPicture: req.body.displayPicture,
  	openTime: req.body.openTime,
  	closeTime: req.body.closeTime,
  	category: req.body.category,
  })
  .then(restaurant => {
  	console.log(source, 'Success: restaurant:' + restaurant.id + ' created');
  	res.json({
  		status: 'Success'
  	});
  })
  .catch(e => {
  	console.log(source, e);
  	res.status(500).send("" + e);
  })
});

router.post('/addDish', function(req, res) {
	var source = '[POST /restaurants/addDish]';
	let restaurantId = req.body.restaurantId;
	let section = req.body.section;

	Restaurant.findById(restaurantId)
	.then(restaurant => {
		Dish.create({
			name: req.body.name,
		  	displayPicture: req.body.displayPicture,
		  	price: req.body.price,
		  	description: req.body.description
		})
		.then(dish => {
			Section.findOrCreate({
				where: {
					name: section
				}
			})
			.then(section => {
				//console.log(section);
				section[0].addDishes(dish)
				.then(() =>{
					restaurant.addSections(section[0])
					.then(() => {
						restaurant.addDishes(dish)
						.then(dish => {
							res.json({
						  		status: 'Success'
						  	});	
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

router.post('/addAddOn', function(req, res) {
 	var source = '[POST /restaurants/addAddOn]';
	let restaurantId = req.body.restaurantId;

	Restaurant.findById(restaurantId)
	.then(restaurant => {
		AddOn.create({
			name: req.body.name,
			displayPicture: req.body.displayPicture,
			price: req.body.price
		})
		.then(addOn => {
			restaurant.addAddOn(addOn)
			.then(() => {
				res.json({
			  		status: 'Success'
			  	});	
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
	.catch(e => {
		console.log(e);
		res.status(500).send("" + e);
	})
})

router.post('/addAddOnToDish', function(req, res) {
 	var source = '[POST /restaurants/addAddOnToDish]';
	let restaurantId = req.body.restaurantId;
	let dishId = req.body.dishId;
	let addOnId = req.body.addOnId;

	Restaurant.findById(restaurantId)
	.then(restaurant => {
		Dish.findById(dishId)
		.then(dish => {
			AddOn.findById(addOnId)
			.then(addOn => {
				dish.addAddOns(addOn)
				.then(() => {
					res.json({
				  		status: 'Success'
				  	});
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


router.get('/', function(req, res) {
 	var source = '[GET /restaurants/]';

 	Restaurant.findAll()
 	.then(restaurants => {
 		res.send(restaurants);
 	})
 	.catch(e => {
		console.log(e);
		res.status(500).send("" + e);
	})
})

router.get('/:restaurantId/dishes', function(req, res) {
 	var source = '[GET /restaurants/dishes]';
 	let restaurantId = req.params.restaurantId;

	Restaurant.findById(restaurantId)
	.then(restaurant => {
	 	restaurant.getDishes()
	 	.then(dishes => {
	 		res.send(dishes);
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

router.get('/:restaurantId/addOns', function(req, res) {
 	var source = '[GET /restaurants/addOns]';
 	let restaurantId = req.params.restaurantId;

	Restaurant.findById(restaurantId)
	.then(restaurant => {
	 	restaurant.getAddOns()
	 	.then(addOns => {
	 		res.send(addOns);
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


router.get('/:restaurantId/menu', function(req, res) {
 	var source = '[GET /restaurants/menu]';
 	let restaurantId = req.params.restaurantId;
	
	Restaurant.findOne({
	    where: {id: restaurantId},
	    attributes: {exclude: ['createdAt','updatedAt']},
	    include: [{
	      model: Section,
	      as: 'Sections',
	      attributes: {exclude: ['createdAt','updatedAt']},
	      through: {attributes:[]},
	      include: [{
	        model: Dish,
	        as: 'Dishes',
	        attributes: {exclude: ['createdAt','updatedAt']},
	        through: {attributes:[]},
	        include: [{
		        model: AddOn,
		        as: 'AddOns',
		        attributes: {exclude: ['createdAt','updatedAt']},
		        through: {attributes:[]},
		    }]
	      }]
	    }],
	  })
	.then(restaurants => {
		res.send(restaurants);
	})
	.catch(e => {
		console.log(e);
		res.status(500).send("" + e);
	})
})



module.exports = router;