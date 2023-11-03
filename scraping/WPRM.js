function getWPRMRecipe($, recipeLink) {
    try {
        // photoLink
        const photoLink = $('.wprm-recipe-image img').attr('src')
        console.log("Cheerio: WPRM photoLink", photoLink)
        
        //  Name
        const name = $('.wprm-recipe-container .wprm-recipe-name').text()
        console.log("Cheerio: WPRM name", name)
        
        // Description
        const description = $('.wprm-recipe-container .wprm-recipe-summary').text()
        console.log("Cheerio: WPRM description", description)
        
        // Prep Time
        let prepTime

        const prepMinsText = $('.wprm-recipe-container .wprm-recipe-prep_time-minutes').clone().children().remove().end().text()
        console.log("Cheerio: getWPRMRecipe prepMinsText", prepMinsText)
        
        let prepMins
        
        if(prepMinsText) {
            prepMins = parseInt(prepMinsText, 10)
        }
        
        const prepHoursText = $('.wprm-recipe-container .wprm-recipe-prep_time-hours').clone().children().remove().end().text()
        const prepHours = parseInt(prepHoursText, 10)
        
        if(!prepHours) {
            prepTime = prepMins
            console.log("Cheerio: WPRM prepTime", prepTime)

        } else {
            prepTime = ((prepHours * 60) + prepMins)
            console.log("Cheerio: WPRM prepTime", prepTime)
        }
        
        // Cook Time
        let cookTime
        
        const cookMinsText = $('.wprm-recipe-container .wprm-recipe-cook_time-minutes').clone().children().remove().end().text()
        console.log("Cheerio: getWPRMRecipe cookMinsText", cookMinsText)

        let cookMins
        
        if(cookMinsText) {
            cookMins = parseInt(cookMinsText, 10)
        }
        
        const cookHoursText = $('.wprm-recipe-container .wprm-recipe-cook_time-hours').clone().children().remove().end().text()
        const cookHours = parseInt(cookHoursText, 10)
        
        if(!cookHours) {
            cookTime = cookMins
            console.log("Cheerio: WPRM cookTime", cookTime)
            
        } else {
            cookTime = ((cookHours * 60) + cookMins)
            console.log("Cheerio: WPRM cookTime", cookTime)
        }
        
        // Total Time
        let totalTime
        
        const totalMinsText = $('.wprm-recipe-container .wprm-recipe-total_time-minutes').clone().children().remove().end().text()
        console.log("Cheerio: getWPRMRecipe totalMinsText", totalMinsText)
        
        let totalMins
        
        if(totalMinsText) {
            totalMins = parseInt(totalMinsText, 10)
        }
        
        const totalHoursText = $('.wprm-recipe-container .wprm-recipe-total_time-hours').clone().children().remove().end().text()
        const totalHours = parseInt(totalHoursText, 10)
        
        if(!totalHours) {
            totalTime = totalMins
            console.log("Cheerio: WPRM totalTime", totalTime)
            
        } else {
            totalTime = ((totalHours * 60) + totalMins)
            console.log("Cheerio: WPRM totalTime", totalTime)
        }

        // Time Calculations
        if(prepTime && cookTime) {
            prepTime = prepTime
            cookTime = cookTime

        } else if(!prepTime && cookTime && totalTime) {
            prepTime = (totalTime - cookTime)
            cookTime = cookTime

        } else if(prepTime && !cookTime && totalTime) {
            prepTime = prepTime
            cookTime = (totalTime - prepTime)

        } else if(!prepTime && !cookTime && totalTime) {
            prepTime = (totalTime * .4)
            cookTime = (totalTime * .6)
        } else {
            prepTime = 0
            cookTime = 0
        }
        
        // Servings
        let servingsText = $('.wprm-recipe-container .wprm-recipe-servings-container .wprm-recipe-servings[type="number"]').attr('value');

        // If the input element doesn't exist, get the text from the span element
        if (!servingsText) {
            servingsText = $('.wprm-recipe-servings-container .wprm-recipe-servings:not([type="number"])').text();
        }

        const servings = parseInt(servingsText, 10)
        console.log("Cheerio: WPRM servings", servings)

        // Ingredients
        let ingredients = []

        $('.wprm-recipe-container .wprm-recipe-ingredient').each(function() {
            const ingredient = $(this).text();
            console.log("Cheerio: getWPRMRecipe ingredient", ingredient);
            
            ingredients.push({ingredient});
        })

        console.log("Cheerio: getWPRMRecipe ingredients", ingredients)
        
        // Instructions
        let instructions = []

        $('.wprm-recipe-container .wprm-recipe-instruction-text').each(function() {
            const instruction = $(this).text();
            console.log("Cheerio: getWPRMRecipe instruction", instruction);
            
            instructions.push({instruction});
        })

        // console.log("Cheerio: getWPRMRecipe instructions", instructions)

        // Source
        const metaTag = $('meta[property="og:site_name"]')
        const siteName = metaTag.attr('content');

        
        let parsedRecipe = {
            name: name,
            description: description,
            prepTime: prepTime,
            cookTime: cookTime,
            servings: servings,
            ingredients: ingredients,
            instructions: instructions,
            photo: photoLink,
            publisher: siteName,
            link: recipeLink,
        }
        
        console.log("Cheerio: getWPRMRecipe parsedRecipe", parsedRecipe)
        
        return parsedRecipe
    
    } catch(err) {
        console.log("WPRM Scraping Tool Error", err)
        return
    }
}

module.exports = { getWPRMRecipe }