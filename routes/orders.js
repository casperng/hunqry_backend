// const express = require('express');
// const router = express.Router();
// const Restaurant = require('../models').Restaurant;
// const Table = require('../models').Table;

// router.post('/save', function(req, res) {
// 	let restaurantId = req.body.restaurantId;
// 	let tableId = req.body.tableId;

// 	Restaurant.findById(restaurantId)
// 	.then(restaurant => {
// 		restaurant.getTables({
// 			where: {
// 				tableId: tableId
// 			}
// 		})
// 		.then(table => {
// 			restaurant.addOrder()
// 			.then(() => {
// 				table.addOrder()
// 				.then(() => {
// 					res.json({
// 				  		status: 'Success'
// 				  	});
// 				})
// 				.catch(e => {
// 				  	console.log(source, e);
// 				  	res.status(500).send("" + e);
// 				})	
// 			})
// 			.catch(e => {
// 			  	console.log(source, e);
// 			  	res.status(500).send("" + e);
// 			})
// 		})
// 	})
// })

// module.exports = router;