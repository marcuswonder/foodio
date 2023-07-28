const Recipe = require('../models/recipe')
const Collection = require('../models/collection')
const { uploadFile } = require("../config/s3Client");
const { aiImageGenerator } = require("../config/openAi");
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



// async function create(req, res) {
//     if(!req.user) return res.redirect('/auth/google');
//     const recipe = new Recipe(req.body);
//     recipe.author = req.user._id;
//     recipe.userName = req.user.name
//     recipe.gId = req.user.googleId
//     try {
//         if(req.file) {
//             console.log("recipe create if statement hit")
//             const result = await uploadFile(req.file);
//             console.log("result", result)
//             recipe.photo = result.Location;

//         } else {
//             console.log("recipe create else statement hit")
//             const response = await aiImageGenerator(recipe.name)
//             recipe.photo = response
//         }
//         const result = await uploadFile(req.file);
//         recipe.photo = result.Location;
//         res.redirect(`/recipes/${recipe._id}`);

//     } catch (error) {
//         console.log("Recipe image upload catch error", error)
//         return res.redirect('/recipes');
//     }
    
//     recipe.save(function(err) {
//         if (err) {
//             console.log("Recipe save error", err)
//             return res.redirect('/recipes');
//         }
//     });
// }



// async function create(req, res) {
//     if (!req.user) return res.redirect('/auth/google');
  
//     const recipe = new Recipe(req.body);
//     recipe.author = req.user._id;
//     recipe.userName = req.user.name;
//     recipe.gId = req.user.googleId;
  
//     try {
//       let imageData;
  
//       if (req.file) {
//         imageData = req.file.buffer;
        
//       } else {
//         // If there's no req.file, generate the image using DALL-E API
//         const response = await aiImageGenerator(recipe.name);
//         imageData = response;
//       }
  
//       // Pass the image data to the uploadFile function for AWS S3 upload
//       const result = await uploadFile(imageData);
//       recipe.photo = result.Location;
  
//       // Save the recipe after the image upload
//       recipe.save(function (err) {
//         if (err) {
//           return res.redirect('/recipes');
//         }
  
//         res.redirect(`/recipes/${recipe._id}`);
//       });
  
//     } catch (error) {
//       return res.redirect('/recipes');
//     }
//   }





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
        console.log("Controller: Else Block Hit")

        const aiImage = await aiImageGenerator(recipe);
        console.log("Controller: aiImage", aiImage)
        
        // const result = await uploadFile(aiImage);
        // console.log("Controller: result", result)
        
        recipe.photo = aiImage.Location;
        console.log("Controller: recipe.photo", recipe.photo)

        recipe.save(function (err) {
          if (err) {
            console.log("Controller: AI Image Recipe Save Error", err)
            return res.redirect('/recipes');
          }
    
          res.redirect(`/recipes/${recipe._id}`);
        });
      }
      
  
    } catch (error) {
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
