const _ = require("lodash")
const recipeModel = require("../models/recipe_model")
const helper = require("./helper")

module.exports = {
  getFavorites : (count) => {
    console.log(`controller getFavorites: count: ${count}`)
    return recipeModel.getFavorites(count)
    .then(recipes => {
      var ret = _.map(recipes, helper.formatRecipe)
      return ret;
    })
  },

  getByID: (id) => {
    console.log(`controller getByID: id: ${id}`)
    return recipeModel.getByID(id)
    .then(helper.formatRecipe)
  },

  getBySearchTerm: (term, limit, offset) => {
    console.log(`controller getBySearchTerm: term: ${term}`)
    if (term.length < 3) return Promise.reject({message : "need at least 3 letters!"})

    return recipeModel.getBySearchTerm(term, limit, offset)
    .then(recipes => {
      var ret = _.map(recipes, helper.formatRecipe)
      return ret;
    })
  },

}

// {
// id: 1,
// caption: "Lime-Sugar Dipping Salt",
// author: "Melissa Clark",
// yield: "  3/4 cup", 
// time: "5 minutes",
// keywords: ["Lime Zest", "Salt","Sugar"],
// nutrition: "223 calories; 0 grams fat; 0 grams saturated fat; 0 grams monounsaturated fat; 0 grams polyunsaturated fat; 60 grams carbohydrates; 2 grams dietary fiber; 51 grams sugars; 0 grams protein; 349 milligrams sodium",  
// instructions: ["Stir salt and sugar together in a small bowl. Zest limes directly into salt-sugar mixture. Using your fingers, rub together to grind the zest more finely.","Transfer to a tightly sealed container until ready to serve. Dipping salt can be prepared up to a week in advance and stored at room temperature."],
// ingredients: [{quant: "¼", text: "cup kosher salt"}, {quant: "½", text: "cup sugar"}, {quant: "3", text: "limes"}],
// dish_image_url: "https://static01.nyt.com/images/2018/03/28/dining/28apperex3/merlin_135722703_50e5dc8f-5aae-4f4a-b8db-06c6d4924ac0-articleLarge.jpg"
// }

// {
// web-scraper-order: "1525160524-1369",
// web-scraper-start-url: "https://cooking.nytimes.com/search?q=&page=1",
// item: "Lemon Meltaways By Yossy Arefi About 30 minutes, plus chilling",
// item-href: "https://cooking.nytimes.com/recipes/1019260-lemon-meltaways?action=click&module=Global%20Search%20Recipe%20Card&pgType=search&rank=38",
// caption: "Lemon Meltaways",
// author: "Yossy Arefi",
// yield: "About 40 cookies",
// time: "About 30 minutes, plus chilling",
// keywords: "[{"keyword":"Lemon Juice"},{"keyword":"Lemon Zest"}]",
// nutrition: "92 calories; 4 grams fat; 2 grams saturated fat; 0 grams trans fat; 1 gram monounsaturated fat; 0 grams polyunsaturated fat; 11 grams carbohydrates; 0 grams dietary fiber; 6 grams sugars; 0 grams protein; 15 milligrams cholesterol; 24 milligrams sodium",
// instructions: "[{"instructions":"Add butter, 1 1/4 cups/154 grams confectioners’ sugar, and lemon zest to the bowl of a stand mixer fitted with the paddle attachment. Mix on low speed until the sugar is moistened, then turn the mixer to medium-high and beat until light and fluffy, about 3 minutes. Scrape down the sides of the bowl, and add the lemon juice and egg yolk. Mix to combine."},{"instructions":"Reduce the speed to low, add the flour, cornstarch and salt, and mix until just combined."},{"instructions":"Divide the dough into 2 pieces and set each piece on a length of parchment paper or plastic wrap. Fold the paper over the sticky dough, and use your hands to form it into a cylinder about 1 1/2 inches wide. Roll the cylinder a few times to help shape it, but don’t worry if it isn’t perfect. Chill the dough until completely firm, at least 2 hours."},{"instructions":"When you are ready to bake, heat oven to 350 degrees, and line two baking sheets with parchment paper."},{"instructions":"Slice the dough into rounds just under 1/4-inch thick and arrange them at least 1-inch apart on the prepared baking sheets. Bake the cookies for 12 to 17 minutes, rotating the pans from top to bottom and front to back halfway though. The cookies should be golden around the edges, but not brown all of the way through."},{"instructions":"Set the pans on cooling racks and cool for a few minutes. Dust both sides of the warm cookies with the remaining 3/4 cup/92 grams confectioners’ sugar. Let the cookies cool completely, then store  at room temperature in an airtight container. Dust with additional confectioners’ sugar just before serving, if desired."}]",
// ingredient: "[{"ingredient":"1\n \n \n cup/227 grams unsalted butter, softened"},{"ingredient":"2\n \n \n cups/246 grams confectioners’ sugar"},{"ingredient":"1\n \n \n tablespoon packed finely grated lemon zest"},{"ingredient":"2\n \n \n tablespoons fresh lemon juice"},{"ingredient":"1\n \n \n egg yolk"},{"ingredient":"2\n \n \n cups/255 grams all-purpose flour"},{"ingredient":"¼\n \n \n cup/32 grams cornstarch"},{"ingredient":"½\n \n \n teaspoon kosher salt"}]",
// info: "These tender cookies are an elegant teatime snack, packed with bright lemon flavor. Bake them all at once or save half of the dough, well wrapped, in the freezer for later. If you’ve frozen the dough, let it warm slightly before slicing to prevent cracked cookies.",
// dish_image_url: "https://static01.nyt.com/images/2018/04/02/dining/02COOKING-LEMON-MELT1/02COOKING-LEMON-MELT1-articleLarge.jpg"
// },