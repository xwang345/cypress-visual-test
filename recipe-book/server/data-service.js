const { Sequelize, DataTypes } = require('sequelize');
const chalk = require('chalk');

// PostgreSQL connection configuration
// const sequelize = new Sequelize('RecipeDB', 'postgres', 'Xlxc101302#', {
//   host: 'localhost',
//   dialect: 'postgres',
//   port: 5432,
// });

//render.com connection configuration
const sequelize = new Sequelize('recipedb_q8ko', 'xwang345', 'sXjsgyEmDEGga4IVc4G7SFgnBZmwp3I8', {
  host: 'dpg-cmp4bgmn7f5s73dblc20-a.oregon-postgres.render.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // You may need to set this to false depending on your database configuration
    }
  }
});

sequelize.authenticate().then(() => {
  console.log(chalk.green('Connection has been established successfully.'));
}).catch((err) => {
  console.log(`Unable to connect to the database: ${err}`);
});

// Define the 'Recipe' model
const recipes = sequelize.define('recipes', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  label: {
      type: DataTypes.STRING,
      allowNull: false
  },
  image: {
      type: DataTypes.STRING
  },
  source: {
      type: DataTypes.STRING
  },
  url: {
      type: DataTypes.STRING
  },
  shareas: {
      type: DataTypes.STRING
  },
  yield: {
      type: DataTypes.FLOAT
  },
  totaltime: {
      type: DataTypes.FLOAT
  }
}, {
  tableName: 'recipes',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the ingredient_image model
const ingredient_image = sequelize.define('ingredient_image', {
  foodid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
  },
  image: {
      type: DataTypes.BLOB('long') // Store JPG format image file
  }
}, {
  tableName: 'ingredient_image',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the cautions model
const cautions = sequelize.define('cautions', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  }
}, {
  tableName: 'cautions',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the recipe_cautions model
const recipe_cautions = sequelize.define('recipe_cautions', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      references: {
          model: recipes,
          key: 'id'
      }
  },
  caution: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
          model: cautions,
          key: 'id'
      }
  }
}, {
  tableName: 'recipe_cautions',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the cuisinetype model
const cuisinetype = sequelize.define('cuisinetype', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  }
}, {
  tableName: 'cuisinetype',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the recipe_cuisinetype model
const recipe_cuisinetype = sequelize.define('recipe_cuisinetype', {
  recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
          model: recipes,
          key: 'id'
      }
  },
  cuisinetype: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
          model: cuisinetype,
          key: 'id'
      }
  }
}, {
  tableName: 'recipe_cuisinetype',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the ingredients model
const ingredients = sequelize.define('ingredients', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: recipes,
          key: 'id'
      }
  },
  text: {
      type: DataTypes.STRING,
      allowNull: false
  },
  quantity: {
      type: DataTypes.REAL,
      allowNull: false
  },
  measure: {
      type: DataTypes.STRING
  },
  food: {
      type: DataTypes.STRING
  },
  weight: {
      type: DataTypes.REAL
  },
  foodcategory: {
      type: DataTypes.STRING
  },
  foodid: {
      type: DataTypes.STRING,
      references: {
          model: ingredient_image,
          key: 'foodid'
      }
  },
  image: {
      type: DataTypes.TEXT
  }
}, {
  tableName: 'ingredients',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the dietlabels model
const dietlabels = sequelize.define('dietlabels', {
  id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  }
}, {
  tableName: 'dietlabels',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the recipe_dietlabel model
const recipe_dietlabel = sequelize.define('recipe_dietlabel', {
  recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
          model: recipes,
          key: 'id'
      }
  },
    dietlabel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: dietlabels,
        key: 'id'
      }
    }
}, {
  tableName: 'recipe_dietlabel',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the healthlabels model
const healthlabels = sequelize.define('healthlabels', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  }
}, {
  tableName: 'healthlabels',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the recipe_healthlabels model
const recipe_healthlabels = sequelize.define('recipe_healthlabels', {
  recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
          model: recipes,
          key: 'id'
      }
  },
  healthlabel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
          model: healthlabels,
          key: 'id'
      }
  }
}, {
  tableName: 'recipe_healthlabels',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});


// Define the images model
const images = sequelize.define('images', {
  foodid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
  },
  image: {
      type: DataTypes.BLOB('long') // Store JPG format image file
  }
}, {
  tableName: 'images',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the recipe_image model
const recipe_image = sequelize.define('recipe_image', {
  recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      references: {
          model: recipes,
          key: 'id'
      }
  },
  image_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
          model: images,
          key: 'foodid'
      }
  }
}, {
  tableName: 'recipe_image',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the mealtype model
const mealtype = sequelize.define('mealtype', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  }
}, {
  tableName: 'mealtype',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the recipe_mealtype model
const recipe_mealtype = sequelize.define('recipe_mealtype', {
  recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
          model: recipes,
          key: 'id'
      }
  },
  mealtype_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
          model: mealtype,
          key: 'id'
      }
  }
}, {
  tableName: 'recipe_mealtype',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the nutrientnames model
const nutrientnames = sequelize.define('nutrientnames', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  nutrient_name: {
      type: DataTypes.CHAR(50),
      allowNull: false
  }
}, {
  tableName: 'nutrientnames',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// Define the totalnutrients model
const totalnutrients = sequelize.define('totalnutrients', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: recipes,
          key: 'id'
      }
  },
  label: {
      type: DataTypes.CHAR(255),
      allowNull: false
  },
  quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  unit: {
      type: DataTypes.CHAR(50),
      allowNull: false
  },
  nutrient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: nutrientnames,
          key: 'id'
      }
  }
}, {
  tableName: 'totalnutrients',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

// define the dishtype model
const dishtype = sequelize.define('dishtype', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  }
});

// define the recipe_dishtype model
const recipe_dishtype = sequelize.define('recipe_dishtype', {
  recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
          model: recipes,
          key: 'id'
      }
  },
  dishtype_id: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
          model: dishtype,
          key: 'id'
      }
  }
}, {
  tableName: 'recipe_dishtype',
  timestamps: false // set to true if you want 'createdAt' and 'updatedAt' fields
});

const recipeTables = [
  recipes, 
  ingredient_image, 
  cautions, 
  recipe_cautions, 
  cuisinetype, 
  recipe_cuisinetype, 
  ingredients, 
  dietlabels, 
  recipe_dietlabel, 
  healthlabels, 
  recipe_healthlabels, 
  images, 
  recipe_image, 
  mealtype, 
  recipe_mealtype, 
  nutrientnames, 
  totalnutrients, 
  dishtype, 
  recipe_dishtype
];

module.exports.initialize = () => {
  console.log("============================================");
  console.log("===                                      ===");
  console.log("===         initialize function          ===");
  console.log("===                                      ===");
  console.log("============================================");

  return new Promise((resolve, reject) => {
    // sequelize.sync().then((recipes) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Recipes table");
    // });

    for (let i = 0; i < recipeTables.length; i++) {
      const table = recipeTables[i];
      sequelize.sync().then((table) => {
        resolve(`Successfully created ${table} table`);
      }).catch((err) => { 
        reject(`Unable to create ${table} table`);
      });
    }

    // sequelize.sync().then((ingredient_image) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Ingredient_image table");
    // });

    // sequelize.sync().then((dietlabels) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Dietlabels table");
    // });

    // sequelize.sync().then((images) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Images table");
    // });

    // sequelize.sync().then((cautions) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Cautions table");
    // });

    // sequelize.sync().then((cuisinetype) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Cuisinetype table");
    // });

    // sequelize.sync().then((recipe_cuisinetype) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Recipe_cuisinetype table");
    // });

    // sequelize.sync().then((ingredients) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Ingredients table");
    // });

    // sequelize.sync().then((recipe_dietlabel) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Recipe_dietlabel table");
    // });

    // sequelize.sync().then((healthlabels) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Healthlabels table");
    // });

    // sequelize.sync().then((recipe_healthlabels) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Recipe_healthlabels table");
    // });

    // sequelize.sync().then((recipe_cautions) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Recipe_cautions table");
    // });

    // sequelize.sync().then((recipe_image) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Recipe_image table");
    // });

    // sequelize.sync().then((mealtype) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Mealtype table");
    // });

    // sequelize.sync().then((recipe_mealtype) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Recipe_mealtype table");
    // });

    // sequelize.sync().then((nutrientnames) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Nutrientnames table");
    // });

    // sequelize.sync().then((totalnutrients) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Totalnutrients table");
    // });

    // sequelize.sync().then((dishtype) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Dishtype table");
    // });

    // sequelize.sync().then((recipe_dishtype) => {
    //   resolve();
    // }).catch((err) => {
    //   reject("Unable to create Recipe_dishtype table");
    // });

    reject("Unable to sync database");
  });
};