update 
recipe2 r2
set keywords = array_to_json(array(select json_array_elements(keywords::json)::json->>'keyword' from recipe2 
where id = r2.id));

CREATE TABLE recipe(
  ID SERIAL PRIMARY KEY,
  "web-scraper-order" VARCHAR,
  "web-scraper-start-url" VARCHAR,
  item VARCHAR,
  "item-href" VARCHAR,
  caption VARCHAR,
  author VARCHAR,
  yield VARCHAR,
  time VARCHAR,
  keywords VARCHAR,
  nutrition VARCHAR,
  instructions VARCHAR,
  ingredient VARCHAR,
  info VARCHAR,
  dish_image_url VARCHAR  
);

CREATE TABLE users(
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  password VARCHAR,
  username VARCHAR,
  avatar VARCHAR,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  modified_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()  
);

CREATE TABLE ur(
  ID SERIAL PRIMARY KEY,
  user_id INTEGER,
  recipe_id INTEGER,
  is_active boolean,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

create unique index ur_user_id_recipe_id on ur(user_id, recipe_id);