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