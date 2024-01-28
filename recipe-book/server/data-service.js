const { Sequelize, DataTypes } = require('sequelize');
const chalk = require('chalk');

// PostgreSQL connection configuration
// const sequelize = new Sequelize('RecipeDB', 'postgres', 'Xlxc101302#', {
//   host: 'localhost',
//   dialect: 'postgres',
//   port: 5432,
// });

//render.com connection configuration
const sequelize = new Sequelize(
  'recipedb_q8ko',
  'xwang345',
  'sXjsgyEmDEGga4IVc4G7SFgnBZmwp3I8',
  {
    host: 'dpg-cmp4bgmn7f5s73dblc20-a.oregon-postgres.render.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // You may need to set this to false depending on your database configuration
      },
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(chalk.green('Connection has been established successfully.'));
  })
  .catch((err) => {
    console.log(`Unable to connect to the database: ${err}`);
  });

// Define the 'Recipe' model
const recipes = sequelize.define(
  'recipes',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT('long'),
    },
    source: {
      type: DataTypes.TEXT('long'),
    },
    url: {
      type: DataTypes.TEXT('long'),
    },
    shareas: {
      type: DataTypes.TEXT('long'),
    },
    yield: {
      type: DataTypes.FLOAT,
    },
    totaltime: {
      type: DataTypes.FLOAT,
    },
  },
  {
    tableName: 'recipes',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the cautions model
const cautions = sequelize.define(
  'cautions',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  },
  {
    tableName: 'cautions',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the recipe_cautions model
const recipe_cautions = sequelize.define(
  'recipe_cautions',
  {
    recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      references: {
        model: recipes,
        key: 'id',
      },
    },
    caution_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: cautions,
        key: 'id',
      },
    },
  },
  {
    tableName: 'recipe_cautions',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the cuisinetype model
const cuisinetype = sequelize.define(
  'cuisinetype',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  },
  {
    tableName: 'cuisinetype',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the recipe_cuisinetype model
const recipe_cuisinetype = sequelize.define(
  'recipe_cuisinetype',
  {
    recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: recipes,
        key: 'id',
      },
    },
    cuisinetype_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: cuisinetype,
        key: 'id',
      },
    },
  },
  {
    tableName: 'recipe_cuisinetype',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the ingredients model
const ingredients = sequelize.define(
  'ingredients',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: recipes,
        key: 'id',
      },
    },
    text: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    measure: {
      type: DataTypes.TEXT('long'),
    },
    food: {
      type: DataTypes.TEXT('long'),
    },
    weight: {
      type: DataTypes.REAL,
    },
    foodcategory: {
      type: DataTypes.TEXT('long'),
    },
    foodid: {
      type: DataTypes.TEXT('long'),
    },
    image: {
      type: DataTypes.TEXT('long'),
    },
  },
  {
    tableName: 'ingredients',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the dietlabels model
const dietlabels = sequelize.define(
  'dietlabels',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  },
  {
    tableName: 'dietlabels',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the recipe_dietlabel model
const recipe_dietlabel = sequelize.define(
  'recipe_dietlabel',
  {
    recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: recipes,
        key: 'id',
      },
    },
    dietlabel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: dietlabels,
        key: 'id',
      },
    },
  },
  {
    tableName: 'recipe_dietlabel',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the healthlabels model
const healthlabels = sequelize.define(
  'healthlabels',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  },
  {
    tableName: 'healthlabels',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the recipe_healthlabels model
const recipe_healthlabels = sequelize.define(
  'recipe_healthlabels',
  {
    recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: recipes,
        key: 'id',
      },
    },
    healthlabel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: healthlabels,
        key: 'id',
      },
    },
  },
  {
    tableName: 'recipe_healthlabels',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the images model
const images = sequelize.define(
  'images',
  {
    foodid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT('long'),
    },
  },
  {
    tableName: 'images',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the recipe_image model
const recipe_image = sequelize.define(
  'recipe_image',
  {
    recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      references: {
        model: recipes,
        key: 'id',
      },
    },
    image_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: images,
        key: 'foodid',
      },
    },
  },
  {
    tableName: 'recipe_image',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the mealtype model
const mealtype = sequelize.define(
  'mealtype',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  },
  {
    tableName: 'mealtype',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the recipe_mealtype model
const recipe_mealtype = sequelize.define(
  'recipe_mealtype',
  {
    recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: recipes,
        key: 'id',
      },
    },
    mealtype_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: mealtype,
        key: 'id',
      },
    },
  },
  {
    tableName: 'recipe_mealtype',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the nutrientnames model
const nutrientnames = sequelize.define(
  'nutrientnames',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nutrient_name: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  },
  {
    tableName: 'nutrientnames',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// Define the totalnutrients model
const totalnutrients = sequelize.define(
  'totalnutrients',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: recipes,
        key: 'id',
      },
    },
    label: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    unit: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    nutrient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: nutrientnames,
        key: 'id',
      },
    },
  },
  {
    tableName: 'totalnutrients',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// define the dishtype model
const dishtypes = sequelize.define(
  'dishtypes',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'dishtypes',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

// define the recipe_dishtype model
const recipe_dishtype = sequelize.define(
  'recipe_dishtype',
  {
    recipe_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: recipes,
        key: 'id',
      },
    },
    dishtype_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: dishtypes,
        key: 'id',
      },
    },
  },
  {
    tableName: 'recipe_dishtype',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields
  }
);

const recipe_video = sequelize.define(
  'recipe_video',
  {
    video_id: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    published_at: {
      type: DataTypes.DATE,
    },
    channel_id: {
      type: DataTypes.TEXT('long'),
    },
    title: {
      type: DataTypes.TEXT('long'),
    },
    description: {
      type: DataTypes.TEXT('long'),
    },
    thumbnail_default_url: {
      type: DataTypes.TEXT('long'),
    },
    thumbnail_default_width: {
      type: DataTypes.INTEGER,
    },
    thumbnail_default_height: {
      type: DataTypes.INTEGER,
    },
    thumbnail_medium_url: {
      type: DataTypes.TEXT('long'),
    },
    thumbnail_medium_width: {
      type: DataTypes.INTEGER,
    },
    thumbnail_medium_height: {
      type: DataTypes.INTEGER,
    },
    thumbnail_high_url: {
      type: DataTypes.TEXT('long'),
    },
    thumbnail_high_width: {
      type: DataTypes.INTEGER,
    },
    thumbnail_high_height: {
      type: DataTypes.INTEGER,
    },
    channel_title: {
      type: DataTypes.TEXT('long'),
    },
    live_broadcast_content: {
      type: DataTypes.TEXT('long'),
    },
    publish_time: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'video',
    timestamps: false, // set to true if you want 'createdAt' and 'updatedAt' fields\
    schema: 'video',
  }
);

module.exports.initialize = () => {
  console.log(
    chalk.bgBlueBright('===         initialize function          ===')
  );
  sequelize.query('CREATE SCHEMA IF NOT EXISTS video;');

  return new Promise((resolve, reject) => {
    try {
      sequelize
        .sync()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(`Unable to create table`);
        });
    } catch (err) {
      reject('Unable to create Recipes table');
    }
  });
};
