//Mappings for quick string to number conversion for IDs
let numberToString = {
  0:'zero',
  1:'one',
  2:'two',
  3:'three',
  4:'four',
  5:'five',
  6:'six',
  7:'seven',
  8:'eight',
  9:'nine'
}
let stringToNumber = {
  "zero":0,
  "one":1,
  "two":2,
  "three":3,
  "four":4,
  "five":5,
  "six":6,
  "seven":7,
  "eight":8,
  "nine":9      
}

let recipe = window.recipe
let k;
for (k = 0; k < recipe.instructions.length; k++){
  recipe.instructions[k].id = k;
}

//Constants/shared variables
let arrowEndMargin = 10;
let tlWidth = window.screen.width// - (arrowEndMargin*2);
let tlHeight = 50;
let tlSvgHeight = tlHeight;
let arrowMargin = 5;
let arrowTipX = 8;
let currStepId = 0;
let DEFAULT_INSTRUCTION_TIME_IN_MINS = 2;
let baseURL = ""

let scaledWidths = getScaledWidths(recipe, tlWidth, arrowMargin);
let xPositions = [];

//To store users saved recipes
let isSaved = false;

main(function(){
  highlightArrow(0, 'zero');
});

function main(callback){
  //Initial page setup
  let title = recipe.caption;
  d3.select('#recipename')
      .text(title);
  d3.select('#page-title')
    .text(title + " - Chef + +");
  d3.select('#total-time-label')
      .text("Total Time: " + recipe.time);
  let tlSvg = d3.select('#timeline')
    .attr('width', tlWidth)
    .attr('height', tlSvgHeight);

  //Setting ingredients
  let ingredientsDiv = d3.select('#ingredients');
  let j;
  for (j=0; j<recipe.ingredients.length; j++){
    ingredientsDiv.append('p')
      .attr('id', 'ingredient'+numberToString[j])
      .attr('class', 'ingredient-list')
      .text(recipe.ingredients[j].quant + " " + recipe.ingredients[j].text);
  }

  //Sets whether recipe is saved
  checkSaved();

  //Set click listener for save button
  d3.select('#big-savebtn')
    .on('click', function(){
      clickBookmark();
    });

  //Loads first step into view
  replaceStep();

  //Selected individual
  d3.select('#switch_left')
    .on('click', function(){
      d3.select('#list')
        .style('display', 'none');
      d3.select('#individual')
        .style('display', 'flex');
    });

  //Selected list
  d3.select('#switch_right')
    .on('click', function(){
      d3.select('#list')
        .style('display', 'flex');
      d3.select('#individual')
        .style('display', 'none');    
    });


  //Next step button
  d3.select('#next')
    .on('click', function(){
      if (currStepId < recipe.instructions.length - 1){
        goToNextStep();
      }
    });

  //Previous step button
  d3.select('#back')
    .on('click', function(){
      if (currStepId > 0){
        goToPrevStep();
      }
    });

  //Add steps to "list all" view
  d3.select('.listed-steps')
    .selectAll('li')
    .data(recipe.instructions)
    .enter()
    .append('li')
    .attr('class', 'listed-steps')
    .text(function(d){ return d.text; });

  //Add arrows to timeline
  let lastX = arrowEndMargin;
  tlSvg.selectAll('path')
    .data(recipe.instructions)
    .enter()
    .append('path')
    .style("fill",  function(d){
      if (d.time === null){
        return "url(#gray-stripe)";
      }
      return 'rgb(200,200,200)';      
    })
    .attr('id', function(d){ return "path" + numberToString[d.id]; } )
    .attr('d', function(d){
      xPositions.push(lastX); 
      let width = scaledWidths[d.id];
      let pathStr = arrow(lastX, arrowMargin, width, tlHeight-(arrowMargin*2)); 
      lastX += (width - arrowTipX) + arrowMargin;
      return pathStr;
    })
    //Mouse events for hovering
    .on("mouseover", function(d){
      highlightArrow(d.id, numberToString[d.id]);
    })
    .on("mouseout", function(d){
      unhighlightArrow(d.id, numberToString[d.id]);
    });

  //Respond to key presses
  //Next step: right arrow, space bar, enter. Prev step: left arrow
  d3.select("body")
    .on("keydown", function(){
      if ((d3.event.key ==='ArrowRight' || d3.event.key === ' ' || d3.event.key === 'Enter') && currStepId < recipe.instructions.length-1){
        d3.event.preventDefault();
        goToNextStep();
      } else if (d3.event.key ==='ArrowLeft' && currStepId > 0){
        d3.event.preventDefault();
        goToPrevStep();
      }
    });  
  callback();
}

/************ HELPER FUNCTIONS ******************/

function checkSaved(){
  var get_saved_URL = baseURL + "/api/getSaved";
  $.getJSON( get_saved_URL, function( savedRecipesResponse ) {
    let i=0;
    while(i < savedRecipesResponse.length){
      if(savedRecipesResponse[i].id === recipe.id){
        isSaved = true;
        break;
      }
      i++;
    }
    if (isSaved) d3.select('#big-savebtn').attr("class", 'savebtn saved');
    else d3.select('#big-savebtn').attr("class", 'savebtn unsaved');
  });    
}  


function clickBookmark(){
  console.log("clicked bookmark " + recipe.id);
  var post_data = {recipe_id: recipe.id};
  if (isSaved){
    //saved - want to remove
    d3.select('#big-savebtn').attr("class", 'unsaved');
    var remove_post_URL = baseURL + "/api/removeSaved";
    $.post( remove_post_URL,  post_data, function( data ) {
      isSaved = false;
      console.log("removed "+ recipe.id);
    });    
  } else {
    //not saved - want to add
    d3.select('#big-savebtn').attr("class", 'saved');
    var save_post_URL = baseURL + "/api/addSaved";
    $.post( save_post_URL,  post_data, function( data ) {
      isSaved = true;
      console.log("posted "+ recipe.id);
    });
  }
}

/* Transitions timeline arrows and changes step ID to update to next step */
function goToNextStep(){
  unhighlightArrow(currStepId, numberToString[currStepId]);
  currStepId+=1;
  replaceStep();
  highlightArrow(currStepId, numberToString[currStepId]);  
}

/* Transitions timeline arrows and changes step ID to go back a step */
function goToPrevStep(){
  unhighlightArrow(currStepId, numberToString[currStepId]);
  currStepId-=1;
  replaceStep();
  highlightArrow(currStepId, numberToString[currStepId]);  
}

/* Highlights arrow orange (with hatched pattern if no explicit time was extracted) */
function highlightArrow(id, idStr){
  let pathIdStr = '#path'+idStr;
  d3.select(pathIdStr)
    .style("fill", function(d){
      if (d.time === null){
        return "url(#orange-stripe)";
      }
      return '#64CECA'; //formerly #ffa64d    
    }); 
}

/* Unhighlights arrow by changing to gray (with hatched pattern if no explicit time was extracted) */
function unhighlightArrow(id, idStr){
  let pathIdStr = '#path'+idStr;
  d3.select(pathIdStr)
    .transition()
    .duration(250)
    .style("fill",  function(d){
      if (d.time === null){
        return "url(#gray-stripe)";
      }
      return 'rgb(200,200,200)';      
    });
}

/* Replaces instruction text and handles button opacity to indicate whether user is at first/last step */
function replaceStep(){
  d3.select('#step_instructions').text(recipe.instructions[currStepId].text);
  //Determine button opacity
  if (currStepId == recipe.instructions.length-1){
    d3.select('#next')
      .style('opacity', '.2');
  } else if (currStepId == 0){
    d3.select('#back')
      .style('opacity', '.2');
    d3.select('#next')
      .style('opacity', '1');
  } else if (currStepId == 1){
    d3.select('#back')
      .style('opacity', '1');
  } else if (currStepId == recipe.instructions.length-2){
    d3.select('#next')
      .style('opacity', '1');    
  }
}

/* Returns array of widths of pieces of the timeline scaled to the width of the screen */
function getScaledWidths(recipe, tlWidth, arrowMargin){
  let widths = []
  let parsedTimes = []
  let totalTime = 0.0;
  let usableSpace = tlWidth-(arrowEndMargin*2); 
  let i;
  //Determines total time from extracted times
  for (i = 0; i < recipe.instructions.length; i++){
    parsedTimeInMinutes = parseTime(recipe.instructions[i].time);
    totalTime += parsedTimeInMinutes;
    parsedTimes[i] = parsedTimeInMinutes; 
  }
  for (i = 0; i < recipe.instructions.length; i++){
    widths.push((parsedTimes[i]/totalTime)*usableSpace); 
  }
  return widths;
}

/* Returns the number of minutes from extracted time text passed in */
function parseTime(textToParse){
  if (textToParse === null){
    return DEFAULT_INSTRUCTION_TIME_IN_MINS;
  }
  let substringArray = textToParse.split(" ");
  let numericalTime = getNumericalTime(substringArray);
  //Scale time to be in minutes
  let timeInMinutes = 0;
  let timeFormat = substringArray[substringArray.length-1]
  switch(timeFormat){
    case "minute":
    case "minutes":
      timeInMinutes = numericalTime;
      break;
    case "hour":
    case "hours":
      timeInMinutes = numericalTime*60;
      break;
    case "second":
    case "seconds":
      timeInMinutes = 1; //round up any step given in seconds
      break;
  }
  return timeInMinutes;
  
}

/* Parses the number from the string with time information */
function getNumericalTime(substringArray){
  let time = 0;
  let rangePresent = substringArray.indexOf("to");
  if (rangePresent !== -1){ 
    //Averages a time range if present ("12 to 17 minutes" ==> 14.5)
    let lowerbound = parseInt(substringArray[rangePresent-1]);
    let upperbound = parseInt(substringArray[rangePresent+1]);
    time = upperbound - (upperbound-lowerbound)/2;
  } else {
    //Extraction guarantees time will be 2nd element from the end, even if "about 5 minutes"
    time = parseInt(substringArray[substringArray.length-2]);
  }
  return time;
}

/* Constructs path string for the timeline arrow */
function arrow(x, y, width, height) {
  let arrowTipY = height/2;
  let str = "M " + x + " " + y
       + " H " + (x + width - arrowTipX)
       + " L " + (x + width) + " " + (y + arrowTipY)
       + " L " + (x + width - arrowTipX) + " " + (y + (arrowTipY*2))
       + " H " + (x)
       + " L " + (x + arrowTipX) + " " + (y + arrowTipY)
       + " Z ";
  return str;
}