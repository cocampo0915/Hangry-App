// CONSTANTS VARIABLES
const RANDOM_URL = 'https://www.themealdb.com/api/json/v1/1/random.php' // pulls a random meal
const CHOICE_URL = 'https://www.themealdb.com/api/json/v1/1/filter.php' // filters by query
const ID_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' // pulls by meal ID
const FILTER_CUISINE = '?a=';
const FILTER_CATEGORY = '?c=';

// STATE VARIABLES
let userCuisine;
let userCategory;
let result;
let finalUrl;

// CACHED ELEMENT REFERENCES
const $recipeName = $('#recipe-name');
const $recipeImg = $('#recipe-img');
const $recipeInstructions = $('#recipe-instructions');
const $ingredients = $('#recipe-ingredients')
const $recipeVideo = $('#recipe-video');
const $cuisine = $('select[id="cuisine"]');
const $test = $('#test');

// EVENT LISTENERS
$('#random-meal').on('click', randomMeal);
$('#submit-cuisine').on('click', pullCuisine);
$('#submit-category').on('click', pullCategory);


// FUNCTIONS

function randomMeal() {
  finalUrl = RANDOM_URL;
  getData();
}

// for capturing user selection from cuisine or category
$(document).ready(function () {
  $('#cuisine').change(function () {
    userCuisine = FILTER_CUISINE + $(this).val();
    localStorage.setItem('cuisine', $(this).val());
  });
  $('#category').change(function () {
    userCategory = FILTER_CATEGORY + $(this).val();
    localStorage.setItem('category', $(this).val());
  });
});

function pullCuisine() {
  event.preventDefault();
  $.ajax(CHOICE_URL + userCuisine)
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

function pullCategory() {
  event.preventDefault();
  $.ajax(CHOICE_URL + userCategory)
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

function fetch(data) {
  const recipe = data['meals'];
// place meal IDs into array
  const meals = [];
  for (let i = 0; i < recipe.length; i++) {
    meals.push(recipe[i].idMeal);
  }
// select random value from ID array
  let randomIdx = getRandomNumber(meals.length);
  return meals[randomIdx];
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

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

function render(data) {
  const recipe = data["meals"][0]; // assign object call to a shorter variable for simpler call later
  // for recipe name title
  $recipeName.html(`
  <h2>
  ${recipe.strMeal}
  </h2>`);
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
  <h4>Ingredients</h4>
  <ul>
  ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
  </ul>
  `);

  // for recipe instructions
  let recipeInstructions = recipe.strInstructions;
  recipeInstructions = recipeInstructions.replace(/(?:\r\n|\r|\n)/g, '<br>'); // string has regex expressions, replace with <br> html tag so it formats properly
  $recipeInstructions.html(`
  <h4>Instructions</h4>
  <p>${recipeInstructions}</p>
  `);

  // for embed youtube video
  $recipeVideo.html(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${recipe.strYoutube.slice(-11)}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
}
