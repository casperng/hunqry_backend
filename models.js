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
  },
  takeAwayOnly: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  closedNow: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
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
  },
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


Restaurant.hasMany(Dish, {as: 'Dishes'});
Restaurant.hasMany(AddOn, {as: 'AddOns'});

Restaurant.belongsToMany(Taxes, {as: 'Taxes', through: 'restaurantTaxes'});

Restaurant.belongsToMany(Category, {as: 'Categories', through: 'restaurantCategories'});
Category.belongsToMany(Restaurant, {as: 'Restaurants', through: 'restaurantCategories'});

Restaurant.belongsToMany(Section, {as: 'Sections', through: 'restaurantSections'});
Section.belongsToMany(Dish, {as: 'Dishes', through: 'dishSections'});

const DishAddOn = sequelize.define('dishAddOn', {});
Dish.belongsToMany(AddOn, { as: 'AddOns', through: 'dishAddOn' });
AddOn.belongsToMany(Dish, { through: 'dishAddOn' });

sequelize.sync();

module.exports.Restaurant = Restaurant;
module.exports.Dish = Dish;
module.exports.AddOn = AddOn;
module.exports.Section = Section;
module.exports.Category = Category;
module.exports.Taxes = Taxes;
