const Recipe = require('../models/recipe')
const Collection = require('../models/collection')
const { uploadFile } = require("../config/s3Client");
const { aiImageGeneratorAndS3Upload, chatGPTQuery } = require("../config/openAi");
// const multer = require('multer');
// const upload = multer();
const validator = require('validator');
const { getBbcGoodFoodRecipe, determineRecipeSourceAndParse } = require("../config/cheerio")


module.exports = {
    index,
    new: newAddRecipe,
    create,
    newCopyRecipe,
    copy: copyRecipe,
    newImportRecipe,
    import: importRecipeWithScrapingTools,
    show,
    delete: deleteRecipe,
    addToCollection,
    editRecipe,
    updateRecipe,
    // editRecipeIngredients,
    // editRecipeInstructions,
}

async function index(req, res) {
    const recipes = await Recipe.find({})
        .populate('tags')
        .exec()
        res.render('recipes/index', { recipes })
}


function newAddRecipe(req, res) {
    res.render('recipes/new')
}


async function create(req, res) {
  // console.log("Controller Create Function: req.body", req.body)
  if (!req.user) return res.redirect('/auth/google');

  const recipe = new Recipe(req.body);
  recipe.author = req.user._id;
  recipe.userName = req.user.name;
  recipe.gId = req.user.googleId;

  try {
    if(req.file) {
      const result = await uploadFile(req.file);
      recipe.photo = result.Location;

      await recipe.save().catch(err => {
        console.log("Controller: User Image Recipe Save Error", err);
        return res.redirect('/recipes');
      });
      res.redirect(`/recipes/${recipe._id}`);
      
    } else {
      const aiImage = await aiImageGeneratorAndS3Upload(recipe);
      recipe.photo = aiImage.Location;

      await recipe.save().catch(err => {
        console.log("Controller: AI Image Recipe Save Error", err);
        return res.redirect('/recipes');
      });
      res.redirect(`/recipes/${recipe._id}`);
    }

  } catch (error) {
    console.log("Controller: Recipe Catch Block Error", error)
    return res.redirect('/recipes');
  }
}

async function newCopyRecipe(req, res) {
  res.render('recipes/copy')
}

async function copyRecipe(req, res) {
  console.log("Controller: Copy function hit")
  console.log("Controller Copy Function: req.body", req.body)
  console.log("Controller Copy Function: req.user", req.user)

  const recipeLink = req.body.recipeLink
  
  const isValidUrl = validator.isURL(recipeLink, {
    require_protocol: true,
  });
  
  if (!isValidUrl) {
    console.log("Recipe Controller: Value is not a valid URL")
  }
  
  const bbcRecipe = await getBbcGoodFoodRecipe(recipeLink)

  if (!req.user) return res.redirect('/auth/google');
  
  bbcRecipe.author = req.user._id
  bbcRecipe.userName = req.user.name
  bbcRecipe.gId = req.user.googleId
  bbcRecipe.category = req.body.category

  console.log("Controller: bbcRecipe", bbcRecipe)

  const recipe = new Recipe(bbcRecipe);
  
  await recipe.save().catch(err => {
    console.log("Controller: BBC Scrape Recipe Save Error", err);
    return res.redirect('/recipes');
  });
  res.redirect(`/recipes/${recipe._id}`);
}

async function newImportRecipe(req, res) {
  res.render('recipes/import')
}

async function importRecipeWithScrapingTools(req, res) {
  if (!req.user) return res.redirect('/auth/google');

  const recipeLink = req.body.recipeLink
  
  const isValidUrl = validator.isURL(recipeLink, {
    require_protocol: true,
  })
  
  if (!isValidUrl) {
    console.log("Recipe Controller: Value is not a valid URL")
  }
  
  const parsedHTML = await determineRecipeSourceAndParse(recipeLink)
  // console.log("Recipe Controller: importRecipe parsedHTML", parsedHTML)

  // const parsedHTMLString = JSON.stringify(parsedHTML)
}


// OpenAI Call
// async function importRecipe(req, res) {
//   console.log("Controller: Import function hit")
//   console.log("Controller Import Function: req.body", req.body)
//   console.log("Controller Import Function: req.user", req.user)

//   if (!req.user) return res.redirect('/auth/google');

//   const recipeLink = req.body.recipeLink
  
//   const isValidUrl = validator.isURL(recipeLink, {
//     require_protocol: true,
//   })
  
//   if (!isValidUrl) {
//     console.log("Recipe Controller: Value is not a valid URL")
//   }
  
//   const parsedHTML = await getRecipeHTML(recipeLink)
//   console.log("Recipe Controller: importRecipe parsedHTML", parsedHTML)

//   const parsedHTMLString = JSON.stringify(parsedHTML)

//   try {
//     const chatGPTResponse = await chatGPTQuery(parsedHTMLString);
//     console.log("Recipe Controller: chatGPTResponse parsedHTMLString", parsedHTMLString)
    
//     console.log("Recipe Controller: importRecipe chatGPTResponse", chatGPTResponse);
//     res.json({ reply: chatGPTResponse });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// }


async function show(req, res) {
    const recipe = await Recipe.findById(req.params.id)
    .populate('tags')
    .exec()
    const collections = await Collection.find({})
        res.render('recipes/show', { recipe, collections })
}
    


async function deleteRecipe(req, res, next) {
  try {
      await Recipe.deleteOne({'_id': req.params.id})
      res.redirect('/recipes')
  } catch(err) {
      console.log(err)
      return next(err)
  }
}

async function addToCollection(req, res) {
  const collection = await Collection.findById(req.body.collection_id);
  collection.recipes.push(req.params.id);
  await collection.save();
  res.redirect(`/recipes/${req.params.id}`);
}

async function editRecipe(req, res) {
  const recipe = await Recipe.findById(req.params.id);
  res.render('recipes/update', { recipe });
}

async function updateRecipe(req, res) {
  const recipe = await Recipe.findById(req.params.id);
  recipe.name = req.body.name;
  recipe.description = req.body.description;
  recipe.prepTime = req.body.prepTime;
  recipe.cookTime = req.body.cookTime;
  recipe.category = req.body.category;
  recipe.servings = req.body.servings;
  await recipe.save();
  res.redirect(`/recipes/${req.params.id}`);
}
