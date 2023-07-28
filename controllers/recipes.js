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

        recipe.save(function (err) {
          if (err) {
            console.log("Controller: User Image Recipe Save Error", err)
            return res.redirect('/recipes');
          }
          res.redirect(`/recipes/${recipe._id}`);
        });
        
      } else {
        const aiImage = await aiImageGeneratorAndS3Upload(recipe);
        recipe.photo = aiImage.Location;

        recipe.save(function (err) {
          if (err) {
            console.log("Controller: AI Image Recipe Save Error", err)
            return res.redirect('/recipes');
          }
          res.redirect(`/recipes/${recipe._id}`);
        });
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

function addToCollection(req, res) {
    console.log("I'm hit!")
    console.log(req.params) // Recipe 
    console.log(req.body.collection_id) // Collection
    Collection.findById(req.body.collection_id, function(err, collection) {
        collection.recipes.push(req.params.id);
        collection.save()
        res.redirect(`/recipes/${req.params.id}`);
    })
}

function editRecipe(req, res) {
    console.log("Edit Recipe is being hit")
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('recipes/update', { recipe })
    })
}

function updateRecipe(req, res) {
    console.log("Edit Recipe being hit!")
    console.log(req.body)
    Recipe.findById(req.params.id, function(err, recipe) {
        recipe.name = req.body.name
        recipe.description = req.body.description
        recipe.prepTime = req.body.prepTime
        recipe.cookTime = req.body.cookTime
        recipe.category = req.body.category
        recipe.servings = req.body.servings
        recipe.save()
        res.redirect(`/recipes/${req.params.id}`)
    })
}
