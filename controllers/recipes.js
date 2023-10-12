const Recipe = require('../models/recipe')
const Collection = require('../models/collection')
const { uploadFile, deleteImageFromS3 } = require("../config/s3Client");
const { aiImageGeneratorAndS3Upload, chatGPTQuery } = require("../config/openAi");
// const multer = require('multer');
// const upload = multer();
const validator = require('validator');
const { getBbcGoodFoodRecipe, determineRecipeSourceAndParse } = require("../config/cheerio")


module.exports = {
    index,
    userIndex,
    new: newAddRecipe,
    create,
    newCopyRecipe,
    copy: copyRecipe,
    newImportRecipe,
    import: importRecipeWithScrapingTools,
    duplicate,
    show,
    delete: deleteRecipe,
    addToCollection,
    editRecipe,
    updateRecipe,
    comingSoon,
    // editRecipeIngredients,
    // editRecipeInstructions,
}

async function index(req, res) {
    const recipes = await Recipe.find({})
        .populate('tags')
        .exec()
        res.render('recipes/index', { recipes, stylesheet: '../public/stylesheets/recipeIndex.css' })
}

async function userIndex(req, res) {
    const recipes = await Recipe.find({ 'author': req.user._id })
        .populate('tags')
        .exec()
        res.render('recipes/index', { recipes, stylesheet: '../public/stylesheets/recipeIndex.css' })
}


function newAddRecipe(req, res) {
    res.render('recipes/new', { stylesheet: '../public/stylesheets/recipeNew.css' })
}


async function create(req, res) {
  if (!req.user) return res.redirect('/auth/google');
  
  const ingredients = req.body.ingredient.map(function(item, index) {
    return { ingredient: item }
  })

  const instructions = req.body.instruction.map(function(item, index) {
    return { instruction: item }
  })


  const recipe = new Recipe(req.body);
  recipe.author = req.user._id;
  recipe.userName = req.user.name;
  recipe.gId = req.user.googleId;
  recipe.ingredients = ingredients
  recipe.instructions = instructions

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

function newImportRecipe(req, res) {
  res.render('recipes/import', {stylesheet: '../public/stylesheets/recipeImport.css' })
}

function comingSoon(req, res) {
  res.render('recipes/coming-soon', {stylesheet: '../public/stylesheets/comingSoon.css' })
}

async function importRecipeWithScrapingTools(req, res) {
  console.log("Recipe Controller: Import function hit")
  console.log("Recipe Controller Import Function: req.body", req.body)
  console.log("Recipe Controller Import Function: req.user", req.user)

  if (!req.user) return res.redirect('/auth/google')

  const recipeLink = req.body.recipeLink
  
  const isValidUrl = validator.isURL(recipeLink, {
    require_protocol: true,
  })
  
  if (!isValidUrl) {
    console.log("Recipe Controller: Value is not a valid URL")
  }
  
  const parsedRecipe = await determineRecipeSourceAndParse(recipeLink)
  console.log("Recipe Controller: importRecipeWithScrapingTool parsedRecipe", parsedRecipe)

  try {
    const isValidPhotoUrl = validator.isURL(parsedRecipe.photo, {
      require_protocol: true,
    })

    if (!isValidPhotoUrl) {
      const photoLink = await aiImageGeneratorAndS3Upload(parsedRecipe)
      parsedRecipe.photo = photoLink.Location
    }
  } catch {
      const photoLink = await aiImageGeneratorAndS3Upload(parsedRecipe)
      parsedRecipe.photo = photoLink.Location
  }

  parsedRecipe.author = req.user._id
  parsedRecipe.userName = req.user.name
  parsedRecipe.gId = req.user.googleId
  parsedRecipe.category = req.body.category

  console.log("Controller: parsedRecipe", parsedRecipe)

  const recipe = new Recipe(parsedRecipe)

  try {
    await recipe.save()
    res.redirect(`/recipes/${recipe._id}`)

  } catch (err) {
    console.log("Controller: Scraped Recipe Save Error", err)

    try {
      res.redirect('/recipes/coming-soon')

    } catch(err) {
      console.log("Controller: Coming Soon Redirect Error", err)
    }
  }
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

async function duplicate(req, res) {
  const recipeToDuplicate = await Recipe.findById(req.params.id)

  const recipeObj = recipeToDuplicate.toObject()
  delete recipeObj._id;
  
  const recipe = new Recipe(recipeObj)

  if(recipeToDuplicate.publisher || recipeToDuplicate.author !== req.user._id) {  
    recipe.photo = null
    recipe.description = null
    recipe.link = null
    recipe.publisher = null
    
  }
  recipe.author = req.user._id;
  recipe.userName = req.user.name;
  recipe.gId = req.user.googleId;

  try {
    await recipe.save()
    console.log("Recipe Controller: Duplicate Recipe Save Complete")
    return res.redirect(`/recipes/${recipe._id}/edit`)
    
  } catch(err) {
    console.log("Recipe Controller: Duplicate Recipe Save Error", err);
    return res.redirect(`/recipes/${recipeToDuplicate._id}`);
  }
}

async function show(req, res) {
    const recipe = await Recipe.findById(req.params.id)
    .populate('tags')
    .exec()
    const collections = await Collection.find({})
        res.render('recipes/show', { recipe, collections, stylesheet: '../public/stylesheets/recipeShow.css' })
}


async function deleteRecipe(req, res, next) {
  console.log("Recipe Controller: deleteRecipe Hit")

  try {
    const recipe = await Recipe.findById(req.params.id)
    console.log("Recipe Controller: deleteRecipe recipe", recipe)

    if(recipe.photo.includes('s3.amazonaws.com')) {
      await deleteImageFromS3(recipe.photo)
    }
    
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
  res.render('recipes/update', { recipe, stylesheet: '/public/stylesheets/recipeUpdate.css' });
}

async function updateRecipe(req, res) {
  console.log("Recipe Controller: updateRecipe req.body", req.body)
  
  const recipe = await Recipe.findById(req.params.id);

  const ingredients = req.body.ingredient.map(function(item, index) {
    return { ingredient: item }
  })

  const instructions = req.body.instruction.map(function(item, index) {
    return { instruction: item }
  })


  recipe.name = req.body.name;
  recipe.description = req.body.description;
  recipe.prepTime = req.body.prepTime;
  recipe.cookTime = req.body.cookTime;
  recipe.category = req.body.category;
  recipe.servings = req.body.servings;
  recipe.ingredients = ingredients;
  recipe.instructions = instructions;

  console.log("Recipe Controller: updateRecipe req.file", req.file)

  try {
    if(req.file) {
      const result = await uploadFile(req.file);
      recipe.photo = result.Location;

      await recipe.save().catch(err => {
        console.log("Recipe Controller: updateRecipe User Image Recipe Save Error", err)
        return res.redirect('/recipes')
      });
      res.redirect(`/recipes/${recipe._id}`)

    } else if(req.body.generateAi === 'on') {
      const aiImage = await aiImageGeneratorAndS3Upload(recipe);
      recipe.photo = aiImage.Location;

      await recipe.save().catch(err => {
        console.log("Recipe Controller: updateRecipe AI Image Recipe Save Error", err);
        return res.redirect('/recipes');
      });
      res.redirect(`/recipes/${recipe._id}`)
    
    } else {
      await recipe.save().catch(err => {
        console.log("Recipe Controller: updateRecipe Existing Image Recipe Save Error", err);
        return res.redirect('/recipes');
      });
      res.redirect(`/recipes/${recipe._id}`)

    }

  } catch (error) {
    console.log("Controller: Recipe Catch Block Error", error)
    return res.redirect('/recipes');
  }
}
