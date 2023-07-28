const Recipe = require('../models/recipe')
const Collection = require('../models/collection')
const { uploadFile } = require("../config/s3Client");
const { aiImageGeneratorAndS3Upload } = require("../config/openAi");
const multer = require('multer');
const upload = multer();


module.exports = {
    index,
    new: newRecipe,
    create,
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


function newRecipe(req, res) {
    res.render('recipes/new')
}


async function create(req, res) {
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




async function show(req, res) {
    const recipe = await Recipe.findById(req.params.id)
    .populate('tags')
    .exec()
    console.log("recipe", recipe)
    const collections = await Collection.find({})
        res.render('recipes/show', { recipe, collections })
}
    


  async function deleteRecipe(req, res, next) {
    try {
        await Recipe.remove({'_id': req.params.id})
        res.redirect('/recipes')
    } catch(err) {
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
