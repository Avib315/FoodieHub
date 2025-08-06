require("dotenv").config();
require("./db.js").connect();
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const notificationService = require("../BL/notification.service.js");

const adminController = require("./controllers/admin.controller.js");
const recipeController = require("./controllers/recipe.controller.js");

const userController = require("./controllers/user.controller.js");
const { addSavedRecipe } = require("../BL/savedRecipe.service.js");
const { register } = require("../BL/user.service.js");

const testRecipes = [
    {
        userId: "6892a111ba501fa3d45d0e03",
        category: "appetizer",
        title: "Stuffed Mushrooms",
        description: "Mushrooms filled with herbs and cheese.",
        instructions: [
            { stepNumber: 1, text: "Mix stuffing and fill mushrooms." },
            { stepNumber: 2, text: "Bake for 15 minutes." }
        ],
        ingredients: [
            { name: "Mushrooms", quantity: 6, unit: "unit" },
            { name: "Cream cheese", quantity: 3, unit: "tablespoon" }
        ],
        prepTime: 20,
        servings: 2,
        difficultyLevel: 2,
        imageUrl: null,
        status: "pending"
    },
    {
        userId: "6892a111ba501fa3d45d0e04",
        category: "dessert",
        title: "Fruit Salad",
        description: "Chopped fresh fruits mixed together.",
        instructions: [
            { stepNumber: 1, text: "Cut and mix all fruits." }
        ],
        ingredients: [
            { name: "Apple", quantity: 1, unit: "unit" },
            { name: "Banana", quantity: 1, unit: "unit" },
            { name: "Grapes", quantity: 0.5, unit: "cup" }
        ],
        prepTime: 10,
        servings: 2,
        difficultyLevel: 1,
        imageUrl: null,
        status: "active"
    },
    {
        userId: "6892a111ba501fa3d45d0e05",
        category: "drink",
        title: "Lemonade",
        description: "Refreshing homemade lemonade.",
        instructions: [
            { stepNumber: 1, text: "Mix lemon juice, water, and sugar." }
        ],
        ingredients: [
            { name: "Lemon", quantity: 2, unit: "unit" },
            { name: "Sugar", quantity: 3, unit: "tablespoon" },
            { name: "Water", quantity: 2, unit: "cup" }
        ],
        prepTime: 5,
        servings: 2,
        difficultyLevel: 1,
        imageUrl: null,
        status: "draft"
    },
    {
        userId: "6892a111ba501fa3d45d0e06",
        category: "main",
        title: "Veggie Burger",
        description: "Homemade vegetarian burger.",
        instructions: [
            { stepNumber: 1, text: "Form patties and grill." }
        ],
        ingredients: [
            { name: "Chickpeas", quantity: 1, unit: "cup" },
            { name: "Breadcrumbs", quantity: 0.5, unit: "cup" }
        ],
        prepTime: 30,
        servings: 2,
        difficultyLevel: 3,
        imageUrl: null,
        status: "active"
    },
    {
        userId: "6892a111ba501fa3d45d0e01",
        category: "main",
        title: "Tofu Stir Fry",
        description: "Crispy tofu with stir-fried veggies in soy sauce.",
        instructions: [
            { stepNumber: 1, text: "Fry tofu until golden." },
            { stepNumber: 2, text: "Add vegetables and stir-fry with sauce." }
        ],
        ingredients: [
            { name: "Tofu", quantity: 200, unit: "gram" },
            { name: "Bell pepper", quantity: 1, unit: "unit" },
            { name: "Soy sauce", quantity: 2, unit: "tablespoon" }
        ],
        prepTime: 20,
        servings: 2,
        difficultyLevel: 2,
        imageUrl: null,
        status: "active"
    },
    {
        userId: "6892a111ba501fa3d45d0e01",
        category: "dessert",
        title: "Mini Cheesecakes",
        description: "Individual-sized creamy cheesecakes.",
        instructions: [
            { stepNumber: 1, text: "Prepare crust and press into muffin tins." },
            { stepNumber: 2, text: "Pour in filling and bake." }
        ],
        ingredients: [
            { name: "Cream cheese", quantity: 200, unit: "gram" },
            { name: "Sugar", quantity: 0.25, unit: "cup" },
            { name: "Graham crackers", quantity: 1, unit: "cup" }
        ],
        prepTime: 35,
        servings: 6,
        difficultyLevel: 3,
        imageUrl: null,
        status: "pending"
    },
    {
        userId: "6892a111ba501fa3d45d0e02",
        category: "drink",
        title: "Green Smoothie",
        description: "Healthy smoothie with spinach and banana.",
        instructions: [
            { stepNumber: 1, text: "Blend all ingredients until smooth." }
        ],
        ingredients: [
            { name: "Spinach", quantity: 1, unit: "cup" },
            { name: "Banana", quantity: 1, unit: "unit" },
            { name: "Almond milk", quantity: 1, unit: "cup" }
        ],
        prepTime: 5,
        servings: 1,
        difficultyLevel: 1,
        imageUrl: null,
        status: "active"
    },
    {
        userId: "6892a111ba501fa3d45d0e02",
        category: "appetizer",
        title: "Garlic Bread",
        description: "Toasted bread with garlic butter.",
        instructions: [
            { stepNumber: 1, text: "Spread garlic butter on slices." },
            { stepNumber: 2, text: "Bake until golden." }
        ],
        ingredients: [
            { name: "Baguette", quantity: 1, unit: "unit" },
            { name: "Butter", quantity: 2, unit: "tablespoon" },
            { name: "Garlic", quantity: 2, unit: "unit" }
        ],
        prepTime: 15,
        servings: 4,
        difficultyLevel: 1,
        imageUrl: null,
        status: "rejected"
    },
    {
        userId: "6892a111ba501fa3d45d0e03",
        category: "soup",
        title: "Miso Soup",
        description: "Traditional Japanese miso soup.",
        instructions: [
            { stepNumber: 1, text: "Boil dashi and add tofu, miso, and seaweed." }
        ],
        ingredients: [
            { name: "Miso paste", quantity: 2, unit: "tablespoon" },
            { name: "Tofu", quantity: 100, unit: "gram" },
            { name: "Seaweed", quantity: 0.5, unit: "cup" }
        ],
        prepTime: 15,
        servings: 2,
        difficultyLevel: 1,
        imageUrl: null,
        status: "active"
    },
    {
        userId: "6892a111ba501fa3d45d0e03",
        category: "salad",
        title: "Chickpea Salad",
        description: "Protein-rich salad with chickpeas and herbs.",
        instructions: [
            { stepNumber: 1, text: "Mix all ingredients in a bowl." }
        ],
        ingredients: [
            { name: "Chickpeas", quantity: 1, unit: "cup" },
            { name: "Parsley", quantity: 2, unit: "tablespoon" },
            { name: "Lemon juice", quantity: 1, unit: "tablespoon" }
        ],
        prepTime: 10,
        servings: 2,
        difficultyLevel: 1,
        imageUrl: null,
        status: "draft"
    },
    {
        userId: "6892a111ba501fa3d45d0e04",
        category: "main",
        title: "Mac and Cheese",
        description: "Creamy macaroni with melted cheese.",
        instructions: [
            { stepNumber: 1, text: "Boil pasta and mix with cheese sauce." }
        ],
        ingredients: [
            { name: "Macaroni", quantity: 1, unit: "cup" },
            { name: "Cheddar", quantity: 0.5, unit: "cup" },
            { name: "Milk", quantity: 0.5, unit: "cup" }
        ],
        prepTime: 20,
        servings: 2,
        difficultyLevel: 2,
        imageUrl: null,
        status: "active"
    },
    {
        userId: "6892a111ba501fa3d45d0e04",
        category: "dessert",
        title: "Brownies",
        description: "Fudgy chocolate brownies.",
        instructions: [
            { stepNumber: 1, text: "Mix batter and bake for 25 minutes." }
        ],
        ingredients: [
            { name: "Flour", quantity: 0.5, unit: "cup" },
            { name: "Cocoa powder", quantity: 0.25, unit: "cup" },
            { name: "Sugar", quantity: 0.5, unit: "cup" }
        ],
        prepTime: 30,
        servings: 6,
        difficultyLevel: 2,
        imageUrl: null,
        status: "active"
    }
];



const testUsers = [
  {
    _id: "6892a1111ba501fa3d45d0e01",
    username: "dana_01",
    email: "dana_01@example.com",
    password: "123456",
    firstName: "Dana",
    lastName: "Levi"
  },
  {
    _id: "6892a1111ba501fa3d45d0e02",
    username: "dana_02",
    email: "dana_02@example.com",
    password: "123456",
    firstName: "Dana",
    lastName: "Mizrahi"
  },
  {
    _id: "6892a1111ba501fa3d45d0e03",
    username: "dana_03",
    email: "dana_03@example.com",
    password: "123456",
    firstName: "Dana",
    lastName: "Ben-David"
  },
  {
    _id: "6892a1111ba501fa3d45d0e04",
    username: "dana_04",
    email: "dana_04@example.com",
    password: "123456",
    firstName: "Dana",
    lastName: "Cohen"
  },
  {
    _id: "6892a1111ba501fa3d45d0e05",
    username: "dana_05",
    email: "dana_05@example.com",
    password: "123456",
    firstName: "Dana",
    lastName: "Amar"
  },
  {
    _id: "6892a1111ba501fa3d45d0e06",
    username: "dana_06",
    email: "dana_06@example.com",
    password: "123456",
    firstName: "Dana",
    lastName: "Gabbay"
  },
  {
    _id: "6892b2011ba501fa3d45d0e07",
    username: "noa_01",
    email: "noa_01@example.com",
    password: "123456",
    firstName: "Noa",
    lastName: "Barak"
  },
  {
    _id: "6892b2011ba501fa3d45d0e08",
    username: "noa_02",
    email: "noa_02@example.com",
    password: "123456",
    firstName: "Noa",
    lastName: "Harari"
  },
  {
    _id: "6892b2011ba501fa3d45d0e09",
    username: "noa_03",
    email: "noa_03@example.com",
    password: "123456",
    firstName: "Noa",
    lastName: "Eliyahu"
  },
  {
    _id: "6892b2011ba501fa3d45d0e0a",
    username: "noa_04",
    email: "noa_04@example.com",
    password: "123456",
    firstName: "Noa",
    lastName: "Tal"
  },
  {
    _id: "6892b2011ba501fa3d45d0e0b",
    username: "noa_05",
    email: "noa_05@example.com",
    password: "123456",
    firstName: "Noa",
    lastName: "Turgeman"
  },
  {
    _id: "6892b2011ba501fa3d45d0e0c",
    username: "lior_01",
    email: "lior_01@example.com",
    password: "123456",
    firstName: "Lior",
    lastName: "Zamir"
  },
  {
    _id: "6892b2011ba501fa3d45d0e0d",
    username: "lior_02",
    email: "lior_02@example.com",
    password: "123456",
    firstName: "Lior",
    lastName: "Sharabi"
  },
  {
    _id: "6892b2011ba501fa3d45d0e0e",
    username: "lior_03",
    email: "lior_03@example.com",
    password: "123456",
    firstName: "Lior",
    lastName: "Yosef"
  },
  {
    _id: "6892b2011ba501fa3d45d0e0f",
    username: "lior_04",
    email: "lior_04@example.com",
    password: "123456",
    firstName: "Lior",
    lastName: "Nahum"
  },
  {
    _id: "6892b2011ba501fa3d45d0e10",
    username: "maya_01",
    email: "maya_01@example.com",
    password: "123456",
    firstName: "Maya",
    lastName: "Peretz"
  },
  {
    _id: "6892b2011ba501fa3d45d0e11",
    username: "maya_02",
    email: "maya_02@example.com",
    password: "123456",
    firstName: "Maya",
    lastName: "Biton"
  },
  {
    _id: "6892b2011ba501fa3d45d0e12",
    username: "maya_03",
    email: "maya_03@example.com",
    password: "123456",
    firstName: "Maya",
    lastName: "Azoulay"
  },
  {
    _id: "6892b2011ba501fa3d45d0e13",
    username: "yarden_01",
    email: "yarden_01@example.com",
    password: "123456",
    firstName: "Yarden",
    lastName: "Avital"
  },
  {
    _id: "6892b2011ba501fa3d45d0e14",
    username: "yarden_02",
    email: "yarden_02@example.com",
    password: "123456",
    firstName: "Yarden",
    lastName: "Mor"
  },
  {
    _id: "6892b2011ba501fa3d45d0e15",
    username: "yarden_03",
    email: "yarden_03@example.com",
    password: "123456",
    firstName: "Yarden",
    lastName: "Ronen"
  }
];



const allRecipeIds = [
  "6890f588b07387c3dd488f73",
  "6890f588b07387c3dd488f7b",
  "6891f6d88449228fcdd5c70e",
  "6891fa3cc33073dc0b7fbb48",
  "6892737509aaf0aab630d8ee",
  "6892737809aaf0aab630d8f6",
  "6892737909aaf0aab630d8fd",
  "6892737909aaf0aab630d904",

  "6892737909aaf0aab630d90b",
  "6892737909aaf0aab630d910",
  "6892737a09aaf0aab630d917",
  "6892737a09aaf0aab630d91f",
  "6892737a09aaf0aab630d925",
  "6892737a09aaf0aab630d92a",
  "6892737a09aaf0aab630d930",
  "6892737b09aaf0aab630d936",
  "6892737b09aaf0aab630d93d",
  "6892737b09aaf0aab630d943",
  "6892737b09aaf0aab630d949",
  "6892737b09aaf0aab630d950",
  "689275152d03834a0700e0dc",
  "689275172d03834a0700e0e3",
  "6892756a5d35d9fa7f5415fb",
  "6892756d5d35d9fa7f541602",
  "6892756d5d35d9fa7f541608",
  "6892756e5d35d9fa7f54160e",
  "6892756e5d35d9fa7f541613",
  "6892756e5d35d9fa7f54161a",
  "6892756e5d35d9fa7f541621",
  "6892756e5d35d9fa7f541628",
  "6892756f5d35d9fa7f541630",
  "6892756f5d35d9fa7f541636",
  "6892756f5d35d9fa7f54163c",
  "6892756f5d35d9fa7f541642"
];

// Hardcoded user and recipe IDs
const userId = '68927e9d8be430cea96b659b';  // Replace per run

// Utility to get 4 unique random items from array
function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const recipeIds = getRandomItems(allRecipeIds, 4);

async function run() {
  try {
    for (const recipeId of recipeIds) {
      await addSavedRecipe(userId, recipeId);
      console.log(`✅ Added recipe ${recipeId} to user ${userId}`);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from DB');
  }
}

run();




// Utility to randomly pick N unique recipe IDs
function getRandomRecipeIds(n) {
  const shuffled = allRecipeIds.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

async function runTest() {
  for (const user of testUsers) {
    try {
      const createdUser = await register(user);
      console.log(`✅ Created user: ${user.username}`);

      const recipeCount = Math.floor(Math.random() * 2) + 3; // 3–4 recipes
      const recipeIds = getRandomRecipeIds(recipeCount);

      for (const recipeId of recipeIds) {
        try {
          await addSavedRecipe(createdUser._id.toString(), recipeId);
          console.log(`  ➕ Added recipe ${recipeId} to ${user.username}`);
        } catch (err) {
          console.error(`  ⚠️ Error adding recipe for ${user.username}:`, err.message);
        }
      }
    } catch (err) {
      console.error(`❌ Failed to create user ${user.username}:`, err.message);
    }
  }

  console.log("🎉 Done!");
}
