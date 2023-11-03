const axios = require('axios'); 
const cheerio = require('cheerio');
const { getBbcGoodFoodRecipe } = require('../scraping/bbcGoodFood')
const { getWPRMRecipe } = require('../scraping/WPRM')
const { getTastyRecipesRecipe } = require('../scraping/tastyRecipes')

// const { chatGPTQuery } = require("./openAi");
// const { generateChatGPTPrompt } = require("./openAiIngredientPrompt")

async function determineRecipeSourceAndParse(recipeLink) {
    try {
        const response = await axios.get(recipeLink);
        const $ = cheerio.load(response.data)

        // WPRM Match
        const WPRMSearch = 'wprm'
        const WPRMElementCount = $('[class*="' + WPRMSearch + '"]').length
        
        // Tasty Recipes Match
        const tastyRecipesSearch = 'tasty-recipes'
        const tastyRecipesElementCount = $('[class*="' + tastyRecipesSearch + '"]').length

        // Logic
        if(recipeLink.includes('bbcgoodfood.com')) {
            console.log("Cheerio: determineRecipeSource BBC Good Food Identified")
            
            const ingredientsHtml = $('.recipe__ingredients').html()
            const $ingredients = cheerio.load(ingredientsHtml)
            const instructionsHtml = $('.recipe__method-steps').html()
            const $instructions = cheerio.load(instructionsHtml)

            const parsedRecipe = getBbcGoodFoodRecipe($, $ingredients, $instructions, recipeLink)
            return parsedRecipe
            
        } else if(WPRMElementCount > 10) {
            console.log("Cheerio: determineRecipeSource WPRM Identified")
            const parsedRecipe = getWPRMRecipe($, recipeLink)
            return parsedRecipe
            
        } else if(tastyRecipesElementCount > 10) {
            console.log("Cheerio: determineRecipeSource Tasty Recipes Identified")
            const parsedRecipe = getTastyRecipesRecipe($)
            return parsedRecipe
            
        } else {
            console.log("Cheerio: determineRecipeSource Generic Website Identified")
            return
            // const parsedRecipe = await genericScrapeTool($)
            // return parsedRecipe
        }    

    } catch (error) {
        console.log("Cheerio: Error retrieving HTML", error)
    }
}

module.exports = { determineRecipeSourceAndParse }