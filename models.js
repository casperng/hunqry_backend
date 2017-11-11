// Establish connection to database
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.HUNQRY_STAGING_DATABASE, process.env.HUNQRY_STAGING_USER, process.env.HUNQRY_STAGING_PASSWORD, {
  host: process.env.HUNQRY_STAGING_HOST,
  port: process.env.HUNQRY_STAGING_PORT,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 2,
    idle: 10000
  }
});

// Test connection to database
sequelize
  .authenticate()
  .then(() => {
    console.log('Successfully connected to database.');
  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
  });

const Restaurant = sequelize.define('restaurant', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
  	type: Sequelize.STRING,
    allowNull:  false
  },
  displayPicture: {
  	type: Sequelize.STRING,
  	allowNull: true,
  	unique: true
  },
  openTime: {
  	type: Sequelize.TIME,
  	allowNull: false
  },
  closeTime: {
  	type: Sequelize.TIME,
  	allowNull: false,
  },
  paylahLink: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Dish = sequelize.define('dish', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  displayPicture: {
  	type: Sequelize.STRING,
  	allowNull: true,
  	unique: true
  },
  price: {
  	type: Sequelize.REAL,
  	allowNull: false
  },
  description: {
  	type: Sequelize.STRING,
  	allowNull: true
  }
});

const AddOn = sequelize.define('addOn', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  displayPicture: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  },
  price: {
    type: Sequelize.REAL,
    allowNull: false
  }
});

const Table = sequelize.define('table', {
  tableId: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  }
});

const Order = sequelize.define('order', {
  price: {
    type: Sequelize.REAL,
    allowNull: false
  }
});

const Section = sequelize.define('section', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Category = sequelize.define('category', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Taxes = sequelize.define('taxes', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  value: {
    type: Sequelize.REAL,
    allowNull: false
  }
})

// const User = sequelize.define('user', {
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   emailId: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   accountType: { // M-merchant, C-customer
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// })

Restaurant.hasMany(Table, {as: 'Tables'});
Restaurant.hasMany(Dish, {as: 'Dishes'});
Restaurant.hasMany(Order, {as: 'orders'});
Restaurant.hasMany(AddOn, {as: 'AddOns'});

Restaurant.belongsToMany(Taxes, {as: 'Taxes', through: 'restaurantTaxes'});

Restaurant.belongsToMany(Category, {as: 'Categories', through: 'restaurantCategories'});
Category.belongsToMany(Restaurant, {as: 'Restaurants', through: 'restaurantCategories'});

Restaurant.belongsToMany(Section, {as: 'Sections', through: 'restaurantSections'});
Section.belongsToMany(Dish, {as: 'Dishes', through: 'dishSections'});

const DishAddOn = sequelize.define('dishAddOn', {});
Dish.belongsToMany(AddOn, { as: 'AddOns', through: 'dishAddOn' });
AddOn.belongsToMany(Dish, { through: 'dishAddOn' });

Dish.belongsToMany(AddOn, {as: 'orderAddOns', through: 'orderDishAddOn' });
AddOn.belongsToMany(Dish, { through: 'orderDishAddOn' });

Order.belongsToMany(Dish, {as: 'Items', through: 'orderItems'});
Dish.belongsToMany(Order, {as: 'Orders', through: 'orderItems'});
Restaurant.belongsToMany(Order, {as: 'Orders', through: 'restaurantOrders'});
Table.belongsToMany(Order, {as: 'Orders', through: 'tableOrders'});

sequelize.sync();

module.exports.Restaurant = Restaurant;
module.exports.Dish = Dish;
module.exports.AddOn = AddOn;
module.exports.Section = Section;
module.exports.Table = Table;
module.exports.Order = Order;
module.exports.Category = Category;
module.exports.Taxes = Taxes;

// use hunqry;
// show tables;
// SET FOREIGN_KEY_CHECKS=0;
// drop table addons;
// drop table categories;
// drop table dishaddons;
// drop table dishes;
// drop table dishsections;
// drop table orderdishaddon;
// drop table orderitems;
// drop table orders;
// drop table restaurantaddons;
// drop table restaurantcategories;
// drop table restaurantorders;
// drop table restaurants;
// drop table restaurantsections;
// drop table sections;
// drop table tableorders;
// drop table tables;

// show tables;
// SET FOREIGN_KEY_CHECKS=0;
// drop table addOns;
// drop table categories;
// drop table dishAddOns;
// drop table dishes;
// drop table dishSections;
// drop table orderDishAddOn;
// drop table orderItems;
// drop table orders;
// drop table restaurantCategories;
// drop table restaurantOrders;
// drop table restaurants;
// drop table restaurantSections;
// drop table sections;
// drop table tableOrders;
// drop table tables;
// drop table taxes;
// drop table restaurantTaxes;


//http:www.dbs.com.sg/personal/mobile/paylink/index.html?tranRef=7095T5obJu