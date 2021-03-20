// https://codepen.io/FlorinPop17/pen/WNeggor <-- refer to this

// CONSTANTS VARIABLES
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/random.php' // pulls a random meal

// STATE VARIABLES
// let stories;

// CACHED ELEMENT REFERENCES
const $recipeName = $('#recipe-name');
const $recipeImg = $('#recipe-img');
const $recipeInstructions = $('#recipe-instructions');
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
  const recipe = data["meals"][0];
  $recipeName.html(`
  <h2>
  ${data["meals"][0].strMeal}
  </h2>`);
  $recipeImg.html(`
  <img src='${data["meals"][0].strMealThumb}' alt="meal image" height="300">`);
  $recipeInstructions.html(`<p>
  ${data["meals"][0].strInstructions}
  </p>`);
  $recipeVideo.html(`<iframe width="560" height="315" src=${recipe.strYoutube} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
}
