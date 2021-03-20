// CONSTANTS VARIABLES
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/random.php' // pulls a random meal

// STATE VARIABLES
// let stories;

// CACHED ELEMENT REFERENCES
const $recipeName = $('#recipe-name');
const $recipeImg = $('#recipe-img');
const $recipeInstructions = $('#recipe-instructions');
const $ingredients = $('#recipe-ingredients')
const $recipeVideo = $('#recipe-video');

// EVENT LISTENERS
$('#random-meal').on('click', getData);

// FUNCTIONS

// init();

function init() {
  console.log("Hello");
}

function getData() {
  event.preventDefault();
  $.ajax(BASE_URL)
    .then(
      // SUCCESS 
      (data) => {
        console.log('data', data);
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
  <h4>Ingredients:</h4>
  <ul>
  ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
  </ul>
  `);

  // for recipe instructions
  let recipeInstructions = recipe.strInstructions;

  recipeInstructions = recipeInstructions.replace(/(?:\r\n|\r|\n)/g, '<br>');
  $recipeInstructions.html(`
  <h4>Instructions:</h4>
  <p>
  ${recipeInstructions}
  </p>`);

  // for embed youtube video
  $recipeVideo.html(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${recipe.strYoutube.slice(-11)}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
}

