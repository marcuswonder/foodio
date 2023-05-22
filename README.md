# Foodio

<br>

## Overview

We get recipes from so many different places these days - established food publications, bloggers and Instagram (just to name a few) - that it can be a challenge to keep track of them all. How many times have you found a recipe online and then not been able to get back to it at a later date. 
Foodio is the place to find, collect, share, and print your favourite recipes with your family and friends.

<br>

### The Vision for Foodio
Users will be able to browse recipes from within the app, paste in links from independent sources, as well as create their own recipes to form collections of their favourites. These collections can then be browsed by or shared with their friends, and printed as A4 instructions or shared as glossy, real-world gifts using one of our standard templates. Foodio would become a platform for hobbyist cooks to take their passion for cooking and turn it into a real gift.

Imagine this: you're on a beautiful holiday in Greece and you are loving the food - but you don't know what to make it. You want to remember the food, and make it when you get home. Search the app (or the internet) for the meal you just ate, find some recipes and save them to your 'Greece' collection. When you get home, you explore similar recipes and over time curate a list of 12 favourite Greek recipes.

The holidays come and you want to share a personal gift that will mean a lot to your friends: print gift books of your Greece collection alongside pictures from your holiday in a beautifully bound recipe book!

<br>

In my planning materials, I laid out the following MVP and Icebox functionality:

<br>

### Minimum Viable Product
As a user, I must be able to:
<ul>
    <li> Log in with my account
    <li> Create new recipes
    <li> Browse my recipes
    <li> Browse other people’s recipes
    <li> Save recipes into collections
</ul>

### Icebox
As a user, it would be nice to be able to:
<ul>
    <li> Browse a feed, populated with other people’s collections
    <li> Paste in links from blogs or other sites and have the app convert into a recipe.
    <li> Browse other people’s collections
    <li> Comment on other people’s recipes
    <li> Like other people’s recipes
    <li> Browse other people’s recipes based on specific ingredients or cuisines
    <li> Find recipes from established food publications (BBC, NYT etc.)
    <li> Share recipes with friends within the application
    <li> Upload and format photos or stories for my recipe collection
    <li> Share my personalised recipe collection with friends
    <li> Choose a design for my recipe collection 
    <li> Print personalised recipe collection into a book
</ul>

<br>
<br>


## Deployment Link
<a href="https://foodio-io-app.herokuapp.com/">Release your inner Foodio!</a>

<br>
<br>

## Getting Started
Simply visit the link above and sign up with your Google Account. Go to 'Recipes' page and start creating your favourites. You can add a recipe to a collection from the bottom of each recipe page, or from 'Collections'.

<br>
<br>

## Timeframe & Working Team
This was the second project assigned as part of my Software Engineering Immersive course at General Assembly; it was a solo project for which we were given 5 working days. I worked over the weekend totalling 7 full days of development.

<br>
<br>


## Technologies Used
During this project I used the MEN Stack with Heroku for deployment:
<ul>
    <li> MongoDB
    <li> Mongoose
    <li> Express
    <li> Node.JS
    <li> Heroku
</ul>

<br>
<br>

## Brief
We were issued the following brief from our instructors:
<br>

### Technical Requirements
<ul>
    <li> Have at least 2 data entities in addition to the "User" Model. One entity that represents the main functional idea for your app and another with a 1:M or M:M relationship with that main entity (embedded or referenced).
    <li> Use OAuth authentication.
    <li> Implement basic authorization by restricting access to certain features, such as editing and deleting a resource, to an authenticated user, or the user that created that resource.
    <li> Have complete CRUD data operations between all data entities. For example, you can have functionality that Creates & Updates a post (data entity) and satisfy Delete functionality by implementing the ability to delete comments (data entity).
    <li> Be styled such that the app looks and feels similar to apps we use on a daily basis - in other words, it should have a consistent and neat presentation.
    <li> Be deployed online (Heroku).    
</ul>

<br>
<br>

## Planning
Please find the planning documents that I submitted to my tutors below:
 * [Planning Materials](https://docs.google.com/document/d/1eECnR01gtZfgdtAVSZ_nNGmp_C9PjrOy5LM_XidjHUM) 
 * [Trello](https://trello.com/b/W6WazhrX/project-4) 
<br>
<br>

## Build Process
I did my best to follow a step-by-step approach when designing this app: model -> testing interface -> routes -> controllers. 

I took the following steps during the project:
<ol>
    <li>Models built for 'Recipes' and 'Collections'
    <li>Basic front end UX built
    <li>OAuth implemented
    <li>Routes created for CRUD functionality for 'Recipes' and 'Collections'
    <li>Full CRUD on 'Recipes' and 'Collections' completed
    <li>Create, Read, and Delete 'Ingredients' and 'Instructions' on relevant  arrays in 'Recipe' completed
    <li>Authorizations implemented
    <li>Front end UX styling improved
    <li>Deployed to Heroku
    <li>Heroku deployment bugs resolved
</ol>

Please note that I have started the deployment of tags as the principal object around which to filter the feed, but this is not yet complete.

<br>
<br>

## Challenges
The biggest challenge that I faced in the development of the application was in adding ingredients and instructions to the recipe document. The model looked like this: 
```JavaScript
const recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    tags: {
        type: [String],
        required: true
    },
    nationality: {
        type: [String]
    },
    prepTime: {
        type: Number,
        min: 0,
        max: 1000
    },
    cookTime: {
        type: Number,
        min: 0,
        max: 1000
    },
    servings: {
        type: Number,
        min: 1,
        max: 24
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ingredients: [{
            name: { type: String },
            qty: { type: Number },
            unit: { type: String }
        }],
    instructions: {
        type: [String],
        required: true,
    }
}, {
    timestamps: true
});
```

Initially I was trying to update the req.body with all the necessary information (recipe info + multiple individual ingredients + multiple individual instructions). I wanted to make sure that ingredients/instructions were displayed on the page immediately after being added, so the conclusion was that I had to write the recipe document to the database before adding the ingredients and instructions, which would essentially act as an 'update' to the original recipe object. Therefore, I split the recipe creation into three steps:
<ol>
    <li>Create recipe model with basic info. Redirect to recipe page
    <li>Add ingredients one by one - pushing each now object to the existing recipe document - redirecting to the recipe page
    <li>Add instructions one by one - pushing each now object to the existing recipe document - redirecting to the recipe page
</ol>

<br>

### Create recipe model
```JavaScript
function create(req, res) {
    if(!req.user) return res.redirect('/auth/google');
    const recipe = new Recipe(req.body);
    recipe.author = req.user._id;
    recipe.userName = req.user.name
    recipe.gId = req.user.googleId
    recipe.save(function(err) {
        if (err) return res.redirect('/recipes');
        console.log(err)
        console.log("Recipe create redirect hit!")
        res.redirect(`/recipes/${recipe._id}`);
        });
}
```
<br>
<br>

### Routing & Controllers
I opted to route the ingredients and instructions through their own named controllers, despite all writing to the 'recipe' model. I went back and forth on this decision but, to me, it seemed the clearest way to lay this out and I believed that it would conform most closely to RESTful Routing conventions. It would have been possible to have set up nested models for 'ingredients' and 'instructions - something I may will implement at a later date since I believe that it would make updating those records easier. Below I have provided snippets of the routing and controller code for 'ingredients' only since 'instructions' is essentially the same.

#### Server.js
```JavaScript
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recipes', recipesRouter);
app.use('/collections', collectionsRouter);
app.use('/', ingredientsRouter);
app.use('/', instructionsRouter);
app.use('/', tagsRouter);
```

<br>

#### Ingredients Router
```JavaScript
router.get('/recipes/:id/ingredients', ensureLoggedIn, ingredientsCtrl.show)
router.put('/recipes/:id/ingredients', ensureLoggedIn, ingredientsCtrl.create)
router.delete('/ingredients/:id', ensureLoggedIn, ingredientsCtrl.delete)
```

<br>

#### Ingredients Controller
```JavaScript
module.exports = {
    show,
    create,
    delete: deleteIngredient,
}

function show(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('recipes/ingredients', { recipe })
    })
}


function create(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        recipe.ingredients.push(req.body);
        recipe.save(function(err) {
            if (err) return res.redirect('/recipes')
            console.log(err)
        res.redirect(`/recipes/${recipe._id}/ingredients`);
      });
    });
  }


async function deleteIngredient(req, res) {
  try {
    const recipe = await Recipe.findOne({'ingredients._id': req.params.id});
    const idx = recipe.ingredients.findIndex(i => i._id.toString() === req.params.id);
    recipe.ingredients.splice(idx, 1);
    await recipe.save();
    res.redirect(`/recipes/${recipe._id}/ingredients`);
  } catch (err) {
    console.log(err);
  }
}
```

<br>
<br>

## Wins
Other than the conceptual issues in how to structure the 'ingredients' and 'instructions' in the 'recipe' model, I found the development fairly straightforward. Therefore I would probably count the resolution of that issue as my biggest win; being able to fairly rapidly pull the routing and controller functions out of recipes and into their own dedicated routing paths gave me confidence in my ability to use the MEN stack.

<br>
<br>

## Key Learning Takeaways
Model relationships are key, and fully thinking through the practicalities of how users will add information to a document is absolutely critical. Whilst I had designed an ERD, I hadn't fully visualised this in advance - this is something that I will certainly take away for the next project.

<br>
<br>

## Bugs & Future Improvements
You can find a live tracker of my bug and improvement pipeline on cancan, my project-management app: <a href="https://cancan.herokuapp.com" target="blank">cancan.herokuapp.com</a>

Use the following credentials to log in to the app and navigate to "my boards", and visit the "Foodio" board:

<ul>
    <li>User: guest@guest.com
    <li>Pass: guest
</ul>

 <br>
 <br>
 <br>