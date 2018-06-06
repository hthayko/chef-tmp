const _ = require("lodash")
const DB = require("./shared_db")
const bCrypt = require('bcrypt')

module.exports = {
  getByUserID : (userID) => {
    const queryString = "SELECT r.* FROM ur join recipe r " +
    "on r.id = ur.recipe_id " +
    "where user_id = $1 and is_active=true;"
    return DB.any(queryString, [userID]);
  },

  addUR : (userID, recipeID) => {    
    const queryString = "INSERT INTO ur(user_id, recipe_id, is_active, created_at)  " + 
      "VALUES($1, $2, true, now()) " + 
      "ON CONFLICT (user_id, recipe_id) " +
      "DO UPDATE SET is_active=true;";
    return DB.none(queryString, [userID, recipeID]);
  },

  removeUR: (userID, recipeID) => {
    const queryString = "UPDATE ur SET is_active=false " +
      "WHERE user_id = $1 and recipe_id = $2 RETURNING *;"
    return DB.one(queryString, [userID, recipeID]);
  }
}

