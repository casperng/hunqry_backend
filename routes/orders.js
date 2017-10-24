const express = require('express');
const router = express.Router();
const Restaurant = require('../models').Restaurant;
const Table = require('../models').Table;
const Order = require('../models').Order;
const Dish = require('../models').Dish;
const AddOn = require('../models').AddOn;

router.post('/save', function(req, res) {
	var source = '[POST /restaurants/save]';
	let restaurantId = req.body.restaurantId;
	let tableId = req.body.tableId;
	let items = req.body.items;
	//res.send(items);
	
	Order.create({ price: req.body.price })
	.then(order => {
		items.forEach(item => {
			Dish.findById(item.id)
			.then(dish => {
				order.addItems(dish)
				item.AddOns.forEach(addOn => {
					AddOn.findById(addOn.id)
					.then(addOn => {
						dish.addOrderAddOns(addOn)
					})
				})
			})
		})
		Restaurant.findById(restaurantId)
		.then(restaurant => {
			restaurant.addOrders(order)
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