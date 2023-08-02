const axios = require('axios'); 
const cheerio = require('cheerio');

async function getBbcGoodFoodRecipe(recipeLink) {
    console.log("Cheerio: getBbcGoodFoodRecipe function hit and recipeLink", recipeLink)
    
    axios.get(recipeLink) 
	.then(response => {
        console.log("Axios: getBbcGoodFoodRecipe axios get function worked")
        // console.log("Axios: GetBBC response.data", response.data);
        // console.log("Axios: GetBBC response.status", response.status);
        // console.log("Axios: GetBBC response.statusText", response.statusText);
        // console.log("Axios: GetBBC response.headers", response.headers);
        // console.log("Axios: GetBBC response.config", response.config);
        
        const $ = cheerio.load(response.data)
        
        const title = $('.post-header__title > h1').text()
        console.log("Axios: title", title)

        // const cookAndPrepTimeHtml = $('.cook-and-prep-time').html()
        // const $cookAndPrepTime = cheerio.load(cookAndPrepTimeHtml)

        
        // const prepTime = $cookAndPrepTime('li > span > time').first().text();
        // console.log("Axios: prepTime", prepTime)
        
        // const cookTime = $cookAndPrepTime('li > span > time').last().text();
        // console.log("Axios: cookTime", cookTime)
        
        const planningHtml = $('.post-header__planning').html()
        const $planning = cheerio.load(planningHtml)
        
        
        const prepTime = $planning('time').first().text();
        console.log("Axios: prepTime", prepTime)
        
        const cookTime = $planning('time').last().text();
        console.log("Axios: cookTime", cookTime)
        
        const servingsFullString = $planning('.post-header__servings').text();
        const servingsNumString = servingsFullString.replace("Serves ","")
        const servings = Number(servingsNumString)
        console.log("Axios: servings", servings)


        
        const ingredientsHtml = $('.recipe__ingredients').html()
        const $ingredients = cheerio.load(ingredientsHtml)

        let ingredients = [];

        $ingredients('section').each(function() {
            $(this).find('li').each(function() {
                ingredients.push($(this).text().trim());
            });
        });

        console.log("Axios: ingredients", ingredients);




        const instructionsHtml = $('.recipe__method-steps').html()
        const $instructions = cheerio.load(instructionsHtml)

        let unformattedInstructions = []

        $instructions('li').each((index, element) => {
            unformattedInstructions.push($(element).text());
          });
        
        let instructions = unformattedInstructions.map(instruction => instruction.replace(/STEP \d+/, ''));

        
        console.log("Axios: instructions", instructions);
        
        





        
      })

    .catch(error => {
        console.log(error);
    })
}

module.exports = { getBbcGoodFoodRecipe }