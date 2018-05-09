
var demo = new Vue({
	el: '#main',
	data: {
		active: 'home',
    searchString: '',
    username: '',
    password: '',
    password_confirm: '',
    loggedIn: false,
    msg: '',
    recipe_name: "",
    ingredients: [],
    instructions: [],
    ingredient_input: "",
    instruction_input: "",
    favRecipes: favRecipes,
    searchedRecipes: [],
	},
  computed: {
      filteredRecipes: function () {
          var recipes_array = this.recipes;
          return recipes_array;;
      }

  },
  methods: {
    makeActive: function(item){
      this.active = item
    },
    logIn: function(userName, event) {
        event.preventDefault();
        this.loggedIn = true;
        this.username = userName
        this.msg = 'Welcome, ' + userName + '!';
        this.makeActive('search')
    },
    logOut: function() {
        this.loggedIn = false;
        this.username = ''
        this.password = ''
        this.msg = 'So long!';
    },
    createAccount: function(userName, password, password_confirm, event) {
      // TODO: Add user to database
      
      // Log in user
      this.logIn(userName, event);
    },

    addIngredient: function() {
      var str = this.ingredient_input
      str = str.charAt(0).toUpperCase() + str.slice(1);
      this.ingredients.push(str)
      this.ingredient_input = ""
    },
    addInstruction: function() {
      var str = this.instruction_input
      str = str.charAt(0).toUpperCase() + str.slice(1);
      this.instructions.push(str)
      this.instruction_input = ""
    },
    removeInstruction: function(instruction) {
      var index = this.instructions.indexOf(instruction)
      if (index > -1) {
        this.instructions.splice(index, 1);
      }
    },
    removeIngredient: function(ingredient) {
      var index = this.ingredients.indexOf(ingredient)
      if (index > -1) {
        this.ingredients.splice(index, 1);
      }
      console.log(this.ingredients)
    },
    searchForRecipes(){
      searchString = this.searchString.trim().toLowerCase();
      var numberOfRecipes = "21";
      var offset = "0";
      var get_url = "http://chefpp.herokuapp.com/api/search?term=" + searchString 
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
        else if (this.status != 200){
          console.log("ERROR when requesting recipes with search term: response code ", this.status);
        }
      };
      xhttp.open("GET", get_url, true);
      xhttp.send();


    }

  }
});