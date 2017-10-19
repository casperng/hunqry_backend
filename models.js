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

// User table
const User = sequelize.define('user', {
  password: { 
  	type: Sequelize.STRING, 
  	allowNull:  false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: Sequelize.STRING(20),
    allowNull:  true,
    unique: true
  },
  email: {
    type: Sequelize.STRING(255),
    allowNull: true,
    unique: true
  },
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
  category: {
  	type: Sequelize.STRING,
	  allowNull: true,
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
  category: {
  	type: Sequelize.STRING,
	allowNull: false
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

// const Order = sequelize.define('order', {
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
// });

Restaurant.hasMany(Table, {as: 'Tables'});
Restaurant.hasMany(Dish, {as: 'Dishes'});
Restaurant.hasMany(AddOn, {as: 'AddOns'});

const DishAddOn = sequelize.define('dishAddOn', {});

Dish.belongsToMany(AddOn, { through: 'dishAddOn' });
AddOn.belongsToMany(Dish, { through: 'dishAddOn' });

//sequelize.sync();

module.exports.User = User;
module.exports.Restaurant = Restaurant;
module.exports.Dish = Dish;
module.exports.AddOn = AddOn;