// // CONSTANTS VARIABLES
// const BASE_URL

// // STATE VARIABLES
// let stories;

// // CACHED ELEMENT REFERENCES
// const $news = $('#news');

// // EVENT LISTENERS

// // FUNCTIONS

// function init() {
//     getData();
// }

// function getData() {
//     $.ajax(BASE_URL + "?limit=10")
//         .then(function(data) {
//             console.log(data);
//             stories = data;
//             render();
//         }, function(error) {
//             console.log(error);
//         });
// }

// function render() {
//     const html = stories.map(function(launch) {
//         return `
//             <p>News here</p>
//         `;
//     })
//     $news.append(html);
// }