
var demo = new Vue({
	el: '#main',
	data: {
    active: localStorage.getItem('cpp_active_page'), // Controls which page is currently being viewed

    // This section is for the search page
    searchString: '', // in the search page, controlls what is searched for
    categories: ["American", "Chinese", "Japanese", "Italian", "Mexican", "Thai", 
                  "Korean", "Spanish", "Greek", "Seafood", "Vegetarian"],
    searchedRecipes: null,

    // This section is for variables related to log in/log out
    username: '',
    password: '',
    password_confirm: '',
    loggedIn: localStorage.getItem('cpp_loggedIn'), // Marks whether a user is logged in or not

    // This section is for the manual recipe input page
    recipe_name: "",
    ingredients: [],
    instructions: [],
    ingredient_input: "",
    instruction_input: "",

    favRecipes: favRecipes // These are the recipes that are displayed in the home view (under Popular)
	},
  computed: {
  },
  methods: {

    // Updates the |active| variable (in the data section above) which controls the 
    // tab that the user is currently viewing (i.e. sign in/search/home/recipe input etc)
    makeActive: function(item){
      this.active = item
      localStorage.setItem('cpp_active_page', item)
    },

    // Updates internal variables to reflect the fact that the user has logged in
    logIn: function(userName, event) {
        event.preventDefault();
        this.username = userName
        this.loggedIn = 'true'
        localStorage.setItem('cpp_loggedIn', 'true')
        this.makeActive('home')
    },

    // Updates internal variables to reflect the fact that the user has logged out
    logOut: function() {
        this.loggedIn = 'false'
        localStorage.setItem('cpp_loggedIn', 'false')
        this.username = ''
        this.password = ''
        this.makeActive('opening_page')
    },

    // Handles the account creation interaction with backend
    createAccount: function(userName, password, password_confirm, event) {
      // TODO: Add user to database
      
      // Log in user
      this.logIn(userName, event);
    },

    // Handles the logic for adding an instruction to the instructions list for 
    // Manual instruction input
    addInstruction: function() {
      var str = this.instruction_input
      str = str.charAt(0).toUpperCase() + str.slice(1);
      this.instructions.push(str)
      this.instruction_input = ""
    },

    // Handles the logic for adding an ingredient to the ingredients list for 
    // Manual ingredient input
    addIngredient: function() {
      var str = this.ingredient_input
      str = str.charAt(0).toUpperCase() + str.slice(1);
      this.ingredients.push(str)
      this.ingredient_input = ""
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

    // Implements the call to the backend when the user hits enter or search on the 
    // Search page
    searchForRecipes(searchString=""){
      if (searchString === ""){
        searchString = this.searchString.trim().toLowerCase();
      }
      var numberOfRecipes = "21";
      var offset = "0";
      var get_url = "http://localhost:4000/api/search?term=" + searchString 
                      + "&limit=" + numberOfRecipes + "&offset=" + offset;

      page = this;
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var recipes = JSON.parse(this.response);
          for (var i=0; i < recipes.length; i ++){
            if (recipes[i].dish_image_url === null){
              recipes[i].dish_image_url = '../images/default-missing-photo.png'
            }
          }
          page.searchedRecipes = recipes
        }
        else if (this.status != 200 && this.status != 0){
          console.log("ERROR when requesting recipes with search term: response code ", this.status);
        }
      };
      xhttp.open("GET", get_url, true);
      xhttp.send();
    }
  }
});

$( document ).ready(function() {
  // If there is no value stored for logged in, we set it to false 
  if (localStorage.getItem('cpp_loggedIn') === null){
    localStorage.setItem('cpp_loggedIn', 'false');
  }

  // If they are not logged in, we load the default landing page
  if (localStorage.getItem('cpp_loggedIn') === 'false') {
    localStorage.setItem('cpp_active_page', 'opening_page');
  }
});
