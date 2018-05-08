const _ = require("lodash")
const DB = require("./shared_db")


module.exports = {
  getFavorites : (count) => {
    count = count || 9;
    console.log(`model getFavorites: count: ${count}`)
    const queryString = "SELECT * FROM recipe LIMIT $1"
    return DB.any(queryString, [count]);
  },

  getByID : (id) => {    
    console.log(`model getByID: id: ${id}`)
    const queryString = "SELECT * FROM recipe WHERE id=$1"
    return DB.one(queryString, [id]);
  },

  getBySearchTerm: (term, limit, offset) => {
    limit = limit || 20;
    offset = offset || 0;
    console.log(`model getBySearchTerm: term: ${term}`)
    const queryString = `SELECT * FROM recipe WHERE caption ilike '%${term}%' OR keywords ilike '%${term}%' ` +
    "ORDER BY ID ASC " +
    "LIMIT $1 " +
    "OFFSET $2";
    return DB.any(queryString, [limit, offset]);
  }
}

