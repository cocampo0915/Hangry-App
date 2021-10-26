// CONSTANTS VARIABLES
const RANDOM_URL = 'https://www.themealdb.com/api/json/v1/1/random.php' // pulls a random meal
const CHOICE_URL = 'https://www.themealdb.com/api/json/v1/1/filter.php' // filters by query
const ID_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' // pulls by meal ID
const FILTER_CUISINE = '?a=';
const FILTER_CATEGORY = '?c=';
const CUISINE_LIST = 'https://www.themealdb.com/api/json/v1/1/list.php?a=list';
const CATEGORY_LIST = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';

// STATE VARIABLES
let userCuisine; // <-- when added to CHOICE_URL, will get data from the correct API endpoint. Handles cuisine choice.
let userCategory; // <-- when added to CHOICE_URL, will get data from the correct API endpoint. Handles category choice.
let result; // <-- after fetch(data), this stores a randomly chosen meal ID from a category chosen by the user.
let finalUrl; // <-- to make the final API call that pulls one recipe and all the data associated with it.
let url;

// CACHED ELEMENT REFERENCES
const $recipeName = $('#recipe-name');
const $recipeImg = $('#recipe-img');
const $recipeInstructions = $('#recipe-instructions');
const $ingredients = $('#recipe-ingredients')
const $recipeVideo = $('#recipe-video');

// EVENT LISTENERS
$('#random-meal').on('click', randomMeal);
$('#submit-cuisine').on('click', pullCuisine);
$('#submit-category').on('click', pullCategory);


// FUNCTIONS

// hits endpoint that gets a random recipe
function randomMeal() {
  finalUrl = RANDOM_URL;
  getData();
}

// for capturing user selection from cuisine or category
$(document).ready(function () {
  $.ajax(CATEGORY_LIST)
    .then(
      // SUCCESS
      (data) => {
        const result = data['meals'];
        const categories = [];
        for (var i = 0; i < result.length; i++) {
          categories.push(result[i].strCategory);
        }
        renderOptions(categories, $('#category'));
      },
      // FAILURE
      (error) => {
        console.log(error);
      }
    )
  $.ajax(CUISINE_LIST)
    .then(
      // SUCCESS
      (data) => {
        const result = data['meals'];
        const cuisines = [];
        for (var i = 0; i < result.length; i++) {
          cuisines.push(result[i].strArea);
        }
        renderOptions(cuisines, $('#cuisine'));
      },
      // FAILURE
      (error) => {
        console.log(error);
      }
    )
  $('#cuisine').change(function () {
    userCuisine = FILTER_CUISINE + $(this).val();
  });
  $('#category').change(function () {
    userCategory = FILTER_CATEGORY + $(this).val();
  });
});

function pullCuisine() {
  event.preventDefault();
  url = CHOICE_URL + userCuisine;
  pullData();
}

function pullCategory() {
  event.preventDefault();
  url = CHOICE_URL + userCategory;
  pullData();
}

function pullData() {
  event.preventDefault();
  $.ajax(url)
    .then(
      // SUCCESS
      (data) => {
        result = fetch(data);
        // call function to handle fetch new api and render
        finalUrl = ID_URL + result;
        getData();
      },
      // FAILURE
      (error) => {
        console.log(error);
      });
}


//This function will fetch a collection of recipes based on user choice of category or cuisine, and then return a random item from the collection.
function fetch(data) {
  const recipe = data['meals'];
  // place meal IDs from each item in the collection into an array
  const meals = [];
  for (let i = 0; i < recipe.length; i++) {
    meals.push(recipe[i].idMeal);
  }
  // select a random value in the ID array
  let randomIdx = getRandomNumber(meals.length);
  return meals[randomIdx];
}

// Function to handle generating a random number within a range, for use in other functions 
function getRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// This function will make the final API call that pulls one recipe and all the data associated with it.
function getData() {
  $.ajax(finalUrl)
    .then(
      // SUCCESS 
      (data) => {
        render(data);
      },
      // FAILURE
      (error) => {
        console.log(error);
      });
}

// This function will handle placing the data pulled from the API call into the DOM.
function renderOptions(data, type) {
  type.html(`
    ${data.map(e => `<option value=${e}>${e}</option>`).join('')}
  `);
}


function render(data) {
  // assign object call to a shorter variable for simpler call later
  const recipe = data["meals"][0];

  // for recipe name title
  $recipeName.html(`<h2>${recipe.strMeal}</h2>`);

  // for recipe image
  $recipeImg.html(`
  <img src='${recipe.strMealThumb}' alt="meal image" height="400">`);

  // for recipe ingredients
  const ingredients = []; // Get all ingredients from object and assign to array
  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      ingredients.push(`${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`);
    } else {
      // Stop if no more ingredients
      break;
    }
  }
  $ingredients.html(`
  <h3>Ingredients</h3>
  <ul>
  ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
  </ul>
  `);

  // for recipe instructions
  let recipeInstructions = recipe.strInstructions;
  recipeInstructions = recipeInstructions.split(/(?:\r\n\r\n|\r\n|\r|\n)/g); // string has regex expressions, replace with <br> html tag so it formats properly
  recipeInstructions = recipeInstructions.filter(instruction => !instruction.toLowerCase().includes('step'));
  recipeInstructions = recipeInstructions.filter(instruction => instruction.length > 1);
  $recipeInstructions.html(`
  <h3>Instructions</h3>
  <ol>
    ${recipeInstructions.map(i => `<li class="instructions">${i}</li>`).join('')}
  </ol>
  `);

  // for embed youtube video
  $recipeVideo.html(`<iframe width="840" height="473" src="https://www.youtube.com/embed/${recipe.strYoutube.slice(-11)}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
}