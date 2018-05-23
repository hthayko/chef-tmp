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

//Constants/shared variables
let arrowEndMargin = 10;
let tlWidth = window.screen.width - (arrowEndMargin*2);
let tlHeight = 50;
let tlSvgHeight = tlHeight + 20;
let arrowMargin = 5;
let widthThreshold = 30;
let arrowTipX = 6.8;
let currStepId = 0;

let scaledWidths = getScaledWidths(recipe, tlWidth, arrowMargin);
let xPositions = [];

main(function(){
  highlightArrow(0, 'zero');
});

function main(callback){
  //Initial setup
  let title = recipe.caption;
  d3.select('#recipename')
      .text(title);
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



  replaceStep();

  //Selected individual
  d3.select('#switch_left')
    .on('click', function(){
      d3.select('#list')
        .style('display', 'none');
      d3.select('#individual')
        .style('display', 'block');
    });

  //Selected list
  d3.select('#switch_right')
    .on('click', function(){
      d3.select('#list')
        .style('display', 'block');
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

  // //Add arrows to timeline
  // let lastX = arrowEndMargin;
  // tlSvg.selectAll('path')
  //   .data(recipe.instructions)
  //   .enter()
  //   .append('path')
  //   .style('fill', function(d){
  //     if(d.active){
  //       return 'rgb(200,200,200)';
  //     } else {
  //       return 'url(#gray-stripe)';
  //     }
  //   })
  //   .attr('id', function(d){ return "path" + numberToString[d.id]; } )
  //   .attr('d', function(d){
  //     xPositions.push(lastX); 
  //     let width = scaledWidths[d.id];
  //     let pathStr = arrow(lastX, arrowMargin, width, tlHeight-(arrowMargin*2)); 
  //     lastX += (width - arrowTipX) + arrowMargin;
  //     return pathStr;
  //   })
  //   //Mouse events for hovering
  //   .on("mouseover", function(d){
  //     highlightArrow(d.id, numberToString[d.id]);
  //   })
  //   .on("mouseout", function(d){
  //     unhighlightArrow(d.id, numberToString[d.id]);
  //   });

  // //Add labels to arrows
  // tlSvg.selectAll('text')
  //   .data(recipe.instructions)
  //   .enter()
  //   .append('text')
  //   .attr('id', function(d){ return 'text' + numberToString[d.id]; })
  //   .text(function(d){ return d.action_word; })
  //   .style('visibility', function(d){
  //     if (scaledWidths[d.id] < widthThreshold){
  //       return 'hidden';
  //     }
  //     return 'visible';
  //   })
  //   .attr('y', tlHeight+12)
  //   .attr('font-family', 'Oswald')
  //   .attr("font-size", "14px")
  //   .attr("fill", "black");

  // //Center text
  // tlSvg.selectAll('text')
  //   .attr('x', function(d){ return (xPositions[d.id] + (scaledWidths[d.id] - this.getComputedTextLength())/2); });

  d3.select("body")
    .on("keydown", function(){
      if (d3.event.key !== 'Enter') d3.event.preventDefault();
      if (d3.event.key ==='ArrowRight' && currStepId < recipe.instructions.length-1){
        goToNextStep();
      } else if (d3.event.key ==='ArrowLeft' && currStepId > 0){
        goToPrevStep();
      }
    });  
  callback();
}

/************ HELPER FUNCTIONS ******************/
function goToNextStep(){
  //unhighlightArrow(currStepId, numberToString[currStepId]);
  currStepId+=1;
  replaceStep();
  //highlightArrow(currStepId, numberToString[currStepId]);  
}

function goToPrevStep(){
  //unhighlightArrow(currStepId, numberToString[currStepId]);
  currStepId-=1;
  replaceStep();
  //highlightArrow(currStepId, numberToString[currStepId]);  
}

function highlightArrow(id, idStr){
  let pathIdStr = '#path'+idStr;
  d3.select(pathIdStr)
    .style("fill", function(d){
      if (d.active){
        return "#ffa64d";
      }
      return 'url(#orange-stripe)'
    });
  let textId = numberToString[id];
  d3.select('#text'+textId)
    .style('visibility', 'visible');  
}

function unhighlightArrow(id, idStr){
  let pathIdStr = '#path'+idStr;
  let textId = numberToString[id];
  if (scaledWidths[id] < widthThreshold){
    d3.select('#text'+textId)
      .transition()
      .duration(250)
      .style('visibility', 'hidden');
  }
  d3.select(pathIdStr)
    .transition()
    .duration(250)
    .style("fill",  function(d){
      if (d.active){
        return "rgb(200,200,200)";
      }
      return 'url(#gray-stripe)'
    });
}

function replaceStep(){
  d3.select('#step_instructions').text(recipe.instructions[currStepId].text);
  let i;
  // let ingredientIDs = recipe.instructions[currStepId].ingred_used;
  // d3.selectAll('.ingredient-list')
  //   .style('color', 'black');
  // for (i=0; i<ingredientIDs.length; i++){
  //   d3.select('#ingredient'+numberToString[ingredientIDs[i]]).style('color', '#ff8000');
  // }

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

// function formatIngredients(stepId){
//     let ingrStr = '';
//     let i;
//     let ingredientIDs = recipe.instructions[stepId].ingred_used;
//     for (i=0; i<ingredientIDs.length; i++){
//       if (i == ingredientIDs.length && i != 0) ingrStr+='and ';
//       let ingredient = recipe.ingredients[ingredientIDs[i]];
//       ingrStr += ingredient.amount + ' ' + ingredient.name;
//       if (i < ingredientIDs.length-1) ingrStr+=', ';
//     }
//     return ingrStr;
// }

function getScaledWidths(recipe, tlWidth, arrowMargin){
  let widths = []
  let totalTime = 60.0; //TODO: total time
  let usableSpace = tlWidth;// - (arrowEndMargin); 
  let i;
  for (i = 0; i < recipe.instructions.length; i++){
      widths.push((totalTime/recipe.instructions.length)*usableSpace); //TODO: fix arrow
  }
  return widths;
}

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