const Tag = require('../models/tag')
const Recipe = require('../models/recipe')
const Collection = require('../models/collection')

module.exports = {
    newRecipeTag,
    create,
    newCollectionTag
}

async function newRecipeTag(req, res) {
    const recipe = await Recipe.findById(req.params.id);
    res.render('tags/newrecipetags', { recipe });
}

async function create(req, res) {
    if (!req.user) return res.redirect('/auth/google');
    const tag = new Tag(req.body);
    // tag.author = req.user._id;
    // tag.userName = req.user.name
    // tag.gId = req.user.googleId
    await tag.save();
    const recipe = await Recipe.findById(req.params.id);
    recipe.tags.push(tag);
    await recipe.save();
    if (err) return res.redirect('/recipes');
    console.log(err);
    res.redirect(`/recipes/${recipe._id}/tags`);
}

async function newCollectionTag(req, res) {
    console.log("New Collection Tag hit");
    console.log(req.params.id);
    const collection = await Collection.findById(req.params.id);
    if (err) {
        console.error(err);
        return res.status(500).send('Error finding collection');
    }
    if (!collection) {
        return res.status(404).send('Collection not found');
    }
    res.render('tags/newcollectiontags', { collection });
}

