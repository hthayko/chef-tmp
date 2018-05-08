var options = {    
  // query: function (e) {
  //   console.log('QUERY:', e.query);
  //   if (e.params) {
  //       console.log('PARAMS:', e.params);
  //   }
  // }
};
var pgp = require('pg-promise')(options);
var parseDbUrl = require("parse-database-url");

const database_url = process.env.CHEF_PP_DATABASE_URL;
var url_data = parseDbUrl(database_url);


var ssl = true;
if (process.env.APP_ENV == "local") {
  ssl = false;
}

const DB = pgp({
    poolSize: 20,
    user: url_data.user,
    password: url_data.password,
    database: url_data.database,
    host: url_data.host,
    port: url_data.port,
    ssl: ssl
});

console.log(`DB pool inited: ${database_url}`)
module.exports = DB