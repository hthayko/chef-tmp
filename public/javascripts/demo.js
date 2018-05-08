
var demo = new Vue({
	el: '#main',
	data: {
		active: 'search',
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
    recipes: favRecipes
	},
  computed: {
      filteredRecipes: function () {
          var recipes_array = this.recipes,
              searchString = this.searchString;

          if(!searchString){
              return recipes_array;
          }

          searchString = searchString.trim().toLowerCase();

          recipes_array = recipes_array.filter(function(item){
              if(item.title.toLowerCase().indexOf(searchString) !== -1){
                  return item;
              }
          })
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
    }

  }
});