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

  addRecipe: (recipeInfo) => {
    console.log(`controller addRecipe: recipeInfo: ${recipeInfo}`)
    return recipeModel.addRecipe(recipeInfo)
    .then(r => {
      var ret = _.map([r], helper.formatRecipe)
      return ret;
    })    

  }

}