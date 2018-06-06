var baseURL = "http://chefpp.herokuapp.com"

var demo = new Vue({
  el: '#main',
  data: {
    active: localStorage.getItem('cpp_active_page'), // Controls which page is currently being viewed

    // This section is for the search page
    searchString: '', // in the search page, controlls what is searched for
    categories: ["American", "French", "Mexican", "Asian", "Italian", "Greek",
                  "Breakfast", "Dessert", "Chicken", "Vegetarian", "Seafood"],
    searchedRecipes: null,
    savedRecipes: [],
    savedRecipeIds: [],
    popup: false,
    popup_recipe_time: "",
    popup_ingredients: [],

    // This section is for variables related to log in/log out
    username: '',
    password: '',
    password_confirm: '',

    // This section is for the manual recipe input page
    recipe_name: "",
    recipe_keywords_input: "",
    recipe_total_time: "",
    quantity_input: "",
    ingredient_input: "",
    ingredients: [],
    instruction_input: "",
    instructions: [],


    popularRecipes: popularRecipes, // These are the recipes that are displayed in the home view (under Popular)
    // account_response: accountResponse, // This is the response to control error/success messages on login.
    login_error_message: "",
    user: window.user

  },
  computed: {
  },

  // Called before each refresh/reload
  beforeMount(){

      // If they are not logged in, and there is no defined page, we load the default landing page
    if (this.active === null) {
      this.makeActive('opening_page');
    }

    else if(this.active === 'savedRecipes' || this.active === 'home' || this.active === 'search'){
      this.getSaved();
    }
  },

  methods: {


    // Updates the |active| variable (in the data section above) which controls the
    // tab that the user is currently viewing (i.e. sign in/search/home/recipe input etc)
    makeActive: function(item){
      if (item === 'savedRecipes' || 'search' || 'home'){
          this.getSaved();
      }
      this.active = item;
      localStorage.setItem('cpp_active_page', item)
    },

    // Updates internal variables to reflect the fact that the user has logged in
    logIn: function(event) {
        var password = this.password;
        var username = this.username;
        var vue_obj = this;

        if($.trim(username) === "" || $.trim(password) === ""){
          this.login_error_message = "Required field left empty.";
          return;
        }

        var post_URL = "http://chefpp.herokuapp.com/login";
        var post_data = {username: username, password: password};
        $.post( post_URL,  post_data, function( data ) {
          console.log(data)
          if(data.mes[0] == "success"){
            vue_obj.makeActive("home")
            vue_obj.user = data.user
          } else {
            vue_obj.login_error_message = data.mes[0];
          }
        });
    },

    // Updates internal variables to reflect the fact that the user has logged out
    logOut: function() {
        var get_URL = "http://chefpp.herokuapp.com/signout";
        var vue_obj = this
       $.get(get_URL, function( data ) {
          vue_obj.username = '';
          vue_obj.password = '';
          vue_obj.makeActive('opening_page');
          vue_obj.user = null;
        });
    },

    // Handles the account creation interaction with backend
    createAccount: function(event) {

      var username = this.username
      var password = this.password
      var password_confirm = this.password_confirm
      if($.trim(password) === "" || $.trim(password) === "" || $.trim(password_confirm) === "" ){
          this.login_error_message = "Required field left empty.";
          return;
      }
      if(password !== password_confirm){
        this.login_error_message = "Pasword and Password Confirmation must match.";
        return;
      }

      var post_URL = "http://chefpp.herokuapp.com/signup";
      var post_data = {username: username, password: password};
      var vue_obj = this;
      $.post( post_URL, post_data, function( data ) {
        console.log(data)
        if(data.mes[0] == "success"){
          vue_obj.makeActive("home")
          vue_obj.user = data.user
        } else {
          vue_obj.login_error_message = data.mes[0];
        }
      });

    },

    // Handles the logic for adding an instruction to the instructions list for
    // Manual instruction input
    addInstruction: function() {
      var str = this.instruction_input
      if (str === '') return;
      str = str.charAt(0).toUpperCase() + str.slice(1);
      this.instructions.push(str)
      this.instruction_input = ""
    },

    // Handles the logic for adding an ingredient to the ingredients list for
    // Manual ingredient input
    addIngredient: function() {
      var str = this.ingredient_input
      if (str === '') return;
      str = str.charAt(0).toUpperCase() + str.slice(1);
      var ingredient = {
                        quantity: this.quantity_input,
                        unit: this.unit_input,
                        text: str
                      };
      this.ingredients.push(ingredient);
      this.ingredient_input = "";
      this.unit_input = "";
      this.quantity_input = "";
    },

    // Deletes an instruction from the list of input instructions on the
    // recipe input page when the 'X' next to the instruction is clicked
    removeInstruction: function(instruction) {
      var index = this.instructions.indexOf(instruction)
      if (index > -1) {
        this.instructions.splice(index, 1);
      }
    },

    // Deletes an ingredient from the list of input ingredients on the
    // recipe input page when the 'X' next to the ingredient is clicked
    removeIngredient: function(ingredient) {
      var index = this.ingredients.indexOf(ingredient)
      if (index > -1) {
        this.ingredients.splice(index, 1);
      }
    },

    submitRecipe: function(){
      // TODO: Delete this comment after implemeting method
      // RELEVANT variables:
      // ===========
      // recipe_name
      // recipe_keywords_input
      // recipe_keywords
      // recipe_total_time
      // ingredients
      // instructions
      console.log("submitted recipe")
      // TODO: Fill in with backend
    },

    //SAVED RECIPES
    getSaved: function(){
      console.log("get saved")
      var get_URL = baseURL + "/api/getSaved";
      page = this;
      var savedRecipeIds = [];
      $.getJSON( get_URL, function( savedRecipesResponse ) {
        for (var i=0; i < savedRecipesResponse.length; i ++){
          if (savedRecipesResponse[i].dish_image_url === null){
            savedRecipesResponse[i].dish_image_url = '../images/default-missing-photo.png'
          }
          // d3.select('#home1').style("class", 'savebtn saved');  this doesn't work
          savedRecipeIds.push(savedRecipesResponse[i].id);
        }
        page.savedRecipes = savedRecipesResponse;
        page.savedRecipeIds = savedRecipeIds;
      });
    },

    clickBookmark: function(origin, recipe){
      console.log("clicked bookmark " + recipe.id);
      page = this;
      var get_URL = baseURL + "/api/getSaved";
      var savedRecipeIds = [];

      var post_data = {recipe_id: recipe.id};
      if (page.savedRecipeIds.indexOf(recipe.id) === -1){
        //not saved - want to add
        d3.select('#'+origin+recipe.id).attr("class", 'savebtn saved');
        var save_post_URL = baseURL + "/api/addSaved";
        $.post( save_post_URL,  post_data, function( data ) {
          page.savedRecipeIds.push(recipe.id);
          console.log("posted "+ recipe.id);
        });
      } else {
        //not saved - want to remove
        d3.select('#'+origin+recipe.id).attr("class", 'savebtn unsaved');
        var remove_post_URL = baseURL + "/api/removeSaved";
        $.post( remove_post_URL,  post_data, function( data ) {
          var indexToRemove = page.savedRecipeIds.indexOf(recipe.id);
          page.savedRecipeIds.splice(indexToRemove, 1);
          console.log("removed "+ recipe.id);
        });
      }

    },

    // Implements the call to the backend when the user hits enter or search on the
    // Search page
    searchForRecipes: function(searchString=""){
      if (searchString === ""){
        searchString = this.searchString.trim().toLowerCase();
      }
      var numberOfRecipes = "21";
      var offset = "0";
      var get_URL = baseURL + "/api/search?term=" + searchString
                      + "&limit=" + numberOfRecipes + "&offset=" + offset;
      page = this;


      $.getJSON( get_URL, function( recipes ) {
        for (var i=0; i < recipes.length; i ++){
          if (recipes[i].dish_image_url === null){
            recipes[i].dish_image_url = '../images/default-missing-photo.png'
          }
        }
        page.searchedRecipes = recipes
      });

    },

    activate_popup: function(recipe){
      currentRecipe = recipe;
      this.popup_recipe_time = recipe.time;
      //make sure page is scrolled all the way to the top so user can see the popup
      window.scroll(0,0);
      for(var i = 0; i < recipe.ingredients.length; i ++){
        var str = (recipe.ingredients[i].quant + " " + recipe.ingredients[i].text);
        this.popup_ingredients.push(str);
      }
      this.popup=true
    },

    deactivate_popup: function(popup){
      //resetting ingredients array, and setting bool to false so popoup will disappear
      this.popup_ingredients = [];
      this.popup=false;
    }

  }
});
