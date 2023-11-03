function getTastyRecipesRecipe($, recipeLink) {
    try {
        // photoLink
        const photoLink = $('.entry-content > p:nth-of-type(2) > img').attr('src');
        console.log("TastyRecipes: photoLink", photoLink)
        
        // Name
        const name = $('.entry-header > .entry-title').first().text()
        console.log("TastyRecipes: name", name)

        // Description
        const tastyRecipesDescriptionBody = $('.tasty-recipes-description-body')
        let description


        if(tastyRecipesDescriptionBody.length > 0) {
            description = $('.tasty-recipes-description-body > p').text()
            
        } else {
            description = $('.tasty-recipes-description > p').text()
        }
        

        // Prep Time
        const prepTimeText = $('.tasty-recipes-prep-time').text()
        console.log("TR: prepTimeText", prepTimeText)

        prepTime = convertToMinutes(prepTimeText)

        // Cook Time
        const cookTimeText = $('.tasty-recipes-cook-time').text()
        console.log("TR: cookTimeText", cookTimeText)

        cookTime = convertToMinutes(cookTimeText)

        // Total Time
        const totalTimeText = $('.tasty-recipes-total-time').text()
        console.log("TR: totalTimeText", totalTimeText)

        totalTime = convertToMinutes(totalTimeText)

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
        let servings = $('.tasty-recipes-yield span[data-amount]').data('amount');

        // Ingredients
        const tastyRecipeIngredient = $('.tasty-recipe-ingredients')
        const tastyRecipesIngredient = $('.tasty-recipes-ingredients')
        const dataTrIngredientCheckbox = $('li[data-tr-ingredient-checkbox]')

        if(dataTrIngredientCheckbox.length > 0) {
            $('.li[data-tr-ingredient-checkbox').each(function(){
                let ingredient = $(this).text()
                ingredients.push(ingredient)
            })

            console.log("TR: dataTRIngredientCheckbox ingredients", ingredients);

            
        } else if(tastyRecipeIngredient) {
            $('.tasty-recipe-ingredients ul li').each(function(){
                let ingredient = $(this).text()
                ingredients.push(ingredient)
            })

            console.log("TR: tastyRecipeIngredient ingredients", ingredients);

        } else if(tastyRecipesIngredient) {
            $('.tasty-recipes-ingredients ul li').each(function(){
                let ingredient = $(this).text()
                ingredients.push(ingredient)
            })

            console.log("TR: tastyRecipesIngredient ingredients", ingredients);

        } else {
            ingredients = []

            console.log("TR: else ingredients", ingredients);
        }


        // Instructions

        // Source






    





    let parsedRecipe = {
        name: name,
        description: description,
        prepTime: prepTime,
        cookTime: cookTime,
        servings: servings,
        // ingredients: ingredients,
        // instructions: instructions,
        photo: photoLink,
        // publisher: siteName,
        // link: recipeLink,
    }

    console.log("TastyRecipes: getTastyRecipesRecipe parsedRecipe", parsedRecipe)

    return 
    // return parsedRecipe
    
    } catch(err) {
        console.log("TR Scraping Tool Error", err)
        return
    }
}

function convertToMinutes(timeString) {
    console.log("TR: convertToMinutes timeString", timeString)

    // Regular expression to match hours and minutes
    const hourMatch = timeString.match(/(\d+)\s*hour/);
    console.log("TR: convertToMinutes hourMatch", hourMatch)
    
    const minuteMatch = timeString.match(/(\d+)\s*min/);
    console.log("TR: convertToMinutes minuteMatch", minuteMatch)

    // Initialize total minutes to 0
    let totalMinutes = 0;

    // If there's a match for hours, convert to minutes and add to total
    if (hourMatch) {
        totalMinutes += parseInt(hourMatch[1]) * 60;
    }

    // If there's a match for minutes, add to total
    if (minuteMatch) {
        totalMinutes += parseInt(minuteMatch[1]);
    }

    console.log("TR: covertToMinutes totalMinutes", totalMinutes)
    return totalMinutes;
}

module.exports = { getTastyRecipesRecipe }