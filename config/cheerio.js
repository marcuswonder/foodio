const axios = require('axios'); 
const cheerio = require('cheerio');

async function getBbcGoodFoodRecipe() {

    axios.get('https://www.bbcgoodfood.com/recipes/easy-vegetable-lasagne') 
	.then(({ data }) => console.log(data));

    const $ = cheerio.load('#__next > div.default-layout > main > div.post.recipe > section > div > div.post-header__body.oflow-x-hidden > div.headline.post-header__title.post-header__title--masthead-layout > h1') // Load markup 

    console.log($.html())

}

module.exports = { getBbcGoodFoodRecipe }