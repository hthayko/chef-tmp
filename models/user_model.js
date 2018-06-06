const _ = require("lodash")
const DB = require("./shared_db")
const bCrypt = require('bcrypt')

module.exports = {
  getByID : (id) => {
    const queryString = "SELECT * FROM users where id = $1"
    return DB.one(queryString, [id]);
  },

  getByUsername : (username) => {    
    const queryString = "SELECT * FROM users WHERE username=$1"
    return DB.one(queryString, [username]);
  },

  addUser : (userInfo) => {
    const queryString = "INSERT INTO users(${this:name})  VALUES(${this:csv}) RETURNING *;"
    return DB.one(queryString, userInfo);
  },

  isValidPassword: (userInfo, password) => {
    var res = bCrypt.compareSync(password, userInfo.password);
    console.log(`result of compare ${password}, ${userInfo.password} is: ${res}`)
    return bCrypt.compareSync(password, userInfo.password);
  }
}

