const Tag = require('../models/tag')
const Recipe = require('../models/recipe')
const Collection = require('../models/collection')

module.exports = {
    newRecipeTag,
    create,
    newCollectionTag
}

function newRecipeTag(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        res.render('tags/newrecipetags', { recipe })
    })
}

function create(req, res) {
    if(!req.user) return res.redirect('/auth/google');
    const tag = new Tag(req.body);
    // tag.author = req.user._id;
    // tag.userName = req.user.name
    // tag.gId = req.user.googleId
    tag.save()
    Recipe.findById(req.params.id, function(err, recipe) {
        recipe.tags.push(tag)
        recipe.save(function(err) {
        if (err) return res.redirect('/recipes');
        console.log(err)
        res.redirect(`/recipes/${recipe._id}/tags`);
        });
    })
}


// function newCollectionTag(req, res) {
//     console.log("New Collection Tag hit")
//     Collection.findById(req.params.id, function(err, collection) {
//         if (err) {
//             console.error(err);
//             return res.status(500).send('Error finding collection');
//         }
//         if (!collection) {
//             return res.status(404).send('Collection not found');
//         }
//         res.render('tags/newcollectiontags', { collection })
//     })
// }

function newCollectionTag(req, res) {
    console.log("New Collection Tag hit")
    console.log(req.params.id)
    Collection.findById(req.params.id, function(err, collection) {
        console.log(collection)
        if (err) {
            console.error(err);
            return res.status(500).send('Error finding collection');
        }
        if (!collection) {
            return res.status(404).send('Collection not found');
        }
        res.render('tags/newcollectiontags', { collection })
    })
}

// async function newCollectionTag(req, res) {
//     console.log("New Collection Tag hit")
//     console.log(req.params.id)
//     const collection = await Collection.findById(req.params.id)
//         console.log({collection}) 
//         console.log(collection)
//         // Why is collection null here?
//         res.render('tags/newcollectiontags', { collection })
// }