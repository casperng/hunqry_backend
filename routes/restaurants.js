const express = require('express');
const router = express.Router();
const Restaurant = require('../models').Restaurant;
const Dish = require('../models').Dish;
const AddOn = require('../models').AddOn;
const Section = require('../models').Section;
const Table = require('../models').Table;
const Order = require('../models').Order;
const Category = require('../models').Category;
const Taxes = require('../models').Taxes;

/* POST add new restaurant */
router.post('/addNew', function(req, res) {
  var source = '[POST /restaurants/addNew]';
  var categories = req.body.categories.split(',');

  Restaurant.create({
  	name: req.body.name,
  	address: req.body.address,
  	displayPicture: req.body.displayPicture,
  	openTime: req.body.openTime,
  	closeTime: req.body.closeTime,
  	paylahLink: req.body.paylahLink,
  	takeAwayOnly: req.body.takeAwayOnly,
  	closedNow: req.body.closedNow
  })
  .then(restaurant => {
  	categories.forEach(category => {
  		Category.findOrCreate({
			where: {
				name: category
			}
		})
		.then(category => {
			category[0] .addRestaurants(restaurant)
			.then(() => {
				;
			})
			.catch(e => {
			  	console.log(source, e);
			  	res.status(500).send("" + e);
			})
		})
		.catch(e => {
		  	console.log(source, e);
		  	res.status(500).send("" + e);
		})
  	})
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

router.post('/addTax', function(req, res) {
	var source = '[POST /restaurants/addTaxes]';
	let restaurantId = req.body.restaurantId;

	Taxes.create({
		name: req.body.name,
		value: req.body.value
	})
	.then(tax => {
		Restaurant.findById(restaurantId)
		.then(restaurant => {
			restaurant.addTaxes(tax)
			.then(() => {
				res.json({
			  		status: 'Success'
			 	})
			})
			.catch(e => {
			  	console.log(source, e);
			  	res.status(500).send("" + e);
			})
		})
		.catch(e => {
		  	console.log(source, e);
		  	res.status(500).send("" + e);
		  })
	})
	.catch(e => {
	  console.log(source, e);
	  res.status(500).send("" + e);
	})
})

router.post('/addTable', function(req, res) {
	var source = '[POST /restaurants/addTable]';
	let restaurantId = req.body.restaurantId;

	Restaurant.findById(restaurantId)
	.then(restaurant => {
		Table.create({
			tableId: req.body.tableId,
		})
		.then(table => {
			restaurant.addTable(table)
			.then(() => {
				res.json({
			  		status: 'Success'
			  	});
			})
			.catch(e => {
			  	console.log(source, e);
			  	res.status(500).send("" + e);
			  })
		})
		.catch(e => {
		  	console.log(source, e);
		  	res.status(500).send("" + e);
		})
	})
	.catch(e => {
	  	console.log(source, e);
	  	res.status(500).send("" + e);
	})
});


router.post('/addDish', function(req, res) {
	var source = '[POST /restaurants/addDish]';
	let restaurantId = req.body.restaurantId;
	let sectionName = req.body.section;

	Restaurant.findById(restaurantId)
	.then(restaurant => {
		Dish.create({
			name: req.body.name,
		  	displayPicture: req.body.displayPicture,
		  	price: req.body.price,
		  	description: req.body.description,
		  	soldOut: req.body.soldOut
		})
		.then(dish => {
			restaurant.getSections({
				where: {
					name: sectionName
				}
			})
			.then(section => {
				//console.log(section);
				if(section[0] == null) {
					Section.create({
						name: sectionName
					})
					.then(section => {
						section.addDishes(dish)
						.then(() => {
							restaurant.addSections(section)
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
				}
				else {
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
				}
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

 	Restaurant.findAll({
 		attributes: {exclude: ['createdAt','updatedAt']},
	    include: [{
	      model: Category,
	      as: 'Categories',
	      attributes: {exclude: ['createdAt','updatedAt']},
	      through: {attributes:[]},
	    }]
 	})
 	.then(restaurants => {
 		res.send(restaurants);
 	})
 	.catch(e => {
		console.log(e);
		res.status(500).send("" + e);
	})
})

router.get('/categories', function(req, res) {
 	var source = '[GET /restaurants/categories]';	

 	Category.findAll({
 		attributes: {exclude: ['createdAt','updatedAt']},
	    include: [{
	      model: Restaurant,
	      as: 'Restaurants',
	      attributes: {exclude: ['createdAt','updatedAt']},
	      through: {attributes:[]},
	    }]
 	})
 	.then(categories => {
 		res.send(categories);
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
	    },
	    {
	    	model: Taxes,
	    	as: 'Taxes',
	    	attributes: {exclude: ['createdAt','updatedAt']},
	      	through: {attributes:[]},
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

router.get('/:restaurantId/orders', function(req, res) {
	var source = '[GET /restaurants/orders]';
	let restaurantId = req.params.restaurantId;

	// Restaurant.findById(restaurantId)
	// .then(restaurant => {
		Order.findAll({
			where: {
				restaurantId: restaurantId
			},
			attributes: {exclude: ['createdAt','updatedAt']},
			through: {attributes:[]},
		    include: [{
		        model: Dish,
		        as: 'Items',
		        attributes: {exclude: ['createdAt','updatedAt']},
		        through: {attributes:[]},
		        include: [{
			        model: AddOn,
			        as: 'orderAddOns',
			        attributes: {exclude: ['createdAt','updatedAt']},
			        through: {attributes:[]},
			    }]
		    }]
		})
		.then(orders => {
			res.send(orders);
		})
		.catch(e => {
			console.log(e);
			res.status(500).send("" + e);
		}) 
	// })
	// .catch(e => {
	// 	console.log(e);
	// 	res.status(500).send("" + e);
	// }) 
})



module.exports = router;