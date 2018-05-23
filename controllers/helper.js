const _ = require("lodash")


module.exports = {
  formatRecipe : (r) => {
    var o = r;
    delete o["web-scraper-order"];
    delete o["web-scraper-start-url"];
    delete o["item"];
    delete o["item-href"];
    o.instructions = _.map(JSON.parse(r.instructions), 'instructions')
    o.instructions = _.map(o.instructions, ins => {
      return {
        "time" : extractTimeFromText(ins),
        "text"  : ins
      }      
    })
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


function extractTimeFromText(text) {
  var ret;

  ret = text.match(/\d+ to \d+ minute/); // 12 to 17 minutes
  if(ret) return ret[0];

  ret = text.match(/\d+ minute/);  // 17 minutes, about 5 minutes
  if(ret) return ret[0];

  ret = text.match(/\d+ to \d+ hour/); // 12 to 17 minutes
  if(ret) return ret[0];

  ret = text.match(/\d+ hour/);  // 17 minutes, about 5 minutes
  if(ret) return ret[0];

  ret = text.match(/\d+ to \d+ second/); // 12 to 17 minutes
  if(ret) return ret[0];

  ret = text.match(/\d+ second/);  // 17 minutes, about 5 minutes
  if(ret) return ret[0];

  return null;
}