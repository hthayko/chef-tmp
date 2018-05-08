const _ = require("lodash")


module.exports = {
  formatRecipe : (r) => {
    var o = r;
    delete o["web-scraper-order"];
    delete o["web-scraper-start-url"];
    delete o["item"];
    delete o["item-href"];
    o.instructions = _.map(JSON.parse(r.instructions), 'instructions')
    o.ingredients = _.map(JSON.parse(r.ingredient), 'ingredient')
    o.ingredients = _.map(o.ingredients, ing => {
      return {
        "quant" : ing.split('\n                \n                \n                  ')[0],
        "text"  : ing.split('\n                \n                \n                  ')[1]
      }
    })
    delete o["ingredient"];
    return o;
  }
}