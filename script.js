let data = [];
let currentPokemon = 41;

/**
 * Initializes the application by checking the local storage and fetching the list of Pokémon.
 * This function is called when the application starts.
 */
function init() {
  checkLocalStorage();
  getPokemons();
}


/**
 * Fetches Pokémon data from the PokéAPI and renders Pokémon cards.
 * Iterates through Pokémon IDs from 1 to the current Pokémon ID, fetches data for each Pokémon,
 * stores the data in the `data` array, and renders a Pokémon card for each.
 * Finally, closes the loading screen.
 *
 * @async
 * @function getPokemons
 * @returns {Promise<void>} A promise that resolves when all Pokémon data has been fetched and rendered.
 */
async function getPokemons() {
  for (let p = 1; p < currentPokemon; p++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${p}`;
    let response = await fetch(url);
    let pokemonData = await response.json();

    data.push(pokemonData);

    renderPokemonCard(p, pokemonData);
  }
  closeLoadingScreen();
}


/**
 * Hides the loading screen by adding the "d-none" class to the element with the ID "loadingScreen".
 */
function closeLoadingScreen() {
  document.getElementById("loadingScreen").classList.add("d-none");
}


/**
 * Displays the loading screen by removing the "d-none" class from the element with the ID "loadingScreen".
 */
function showLoadingScreen() {
  document.getElementById("loadingScreen").classList.remove("d-none");
}


/**
 * Renders a Pokémon card and appends it to the content element.
 *
 * @param {number} p - The index or identifier for the Pokémon.
 * @param {Object} pokemonData - The data object containing Pokémon information.
 * @param {string} pokemonData.name - The name of the Pokémon.
 * @param {Object} pokemonData.sprites - The sprites object containing image URLs.
 * @param {Object} pokemonData.sprites.other.home - The home object containing alternative sprites.
 * @param {string} pokemonData.sprites.other.home.front_default - The URL of the Pokémon's front default image.
 * @param {number} pokemonData.base_experience - The base experience points of the Pokémon.
 * @param {Array} pokemonData.types - The array of type objects for the Pokémon.
 * @param {Object} pokemonData.types[].type - The type object containing type information.
 * @param {string} pokemonData.types[].type.name - The name of the Pokémon's type.
 */
function renderPokemonCard(p, pokemonData) {
  let name = pokemonData.name;
  let nameUpperCase = name.charAt(0).toUpperCase() + name.slice(1);
  let image = pokemonData.sprites.other.home["front_default"];
  let xp = pokemonData.base_experience;
  let content = document.getElementById("content");
  let classbg = pokemonData.types[0].type.name;

  content.innerHTML += generatePokemonCardHtml(p,nameUpperCase,image,xp,classbg);

  addCardType(p, pokemonData);
}


/**
 * Adds the Pokémon types to the card element.
 *
 * @param {number} p - The index of the Pokémon card.
 * @param {Object} pokemonData - The data object containing Pokémon information.
 * @param {Array} pokemonData.types - An array of type objects for the Pokémon.
 * @param {Object} pokemonData.types[].type - The type object.
 * @param {string} pokemonData.types[].type.name - The name of the Pokémon type.
 */
function addCardType(p, pokemonData) {
  let typeContent = document.getElementById(`cardType${p}`);
  let type0 = pokemonData.types[0].type.name;
  let type1 = pokemonData.types[1]?.type.name;

  typeContent.innerHTML = generateCardTypeHtml(type0, type1);
}


/**
 * Filters and displays Pokémon cards based on the search input.
 * If the search input has 3 or more characters, it shows the search results.
 * Otherwise, it displays all Pokémon cards.
 */
function searchPokemon() {
  let searchField = document.getElementById("searchField").value.toLowerCase();
  let pokemonCards = document.querySelectorAll(".cards");

  if (searchField.length >= 3) {
    showSearchResults(searchField, pokemonCards);
  } else {
    for (let i = 0; i < pokemonCards.length; i++) {
      pokemonCards[i].style.display = "flex";
    }
  }
}


/**
 * Filters and displays Pokémon cards based on the search field input.
 *
 * @param {string} searchField - The search term used to filter Pokémon cards.
 * @param {HTMLElement[]} pokemonCards - An array of HTML elements representing Pokémon cards.
 */
function showSearchResults(searchField, pokemonCards) {
  for (let i = 0; i < pokemonCards.length; i++) {
    const pokemonCard = pokemonCards[i];

    let name = document.getElementById(`pokemonName${i + 1}`).innerText.toLowerCase();

    if (name.includes(searchField)) {
      pokemonCard.style.display = "flex";
    } else {
      pokemonCard.style.display = "none";
    }
  }
}


/**
 * Loads more Pokémon data by showing a loading screen, fetching additional Pokémon, and then closing the loading screen.
 * 
 * @async
 * @function loadMore
 * @returns {Promise<void>} A promise that resolves when the loading process is complete.
 */
async function loadMore() {
  showLoadingScreen();
  await fetchMorePokemons();
  closeLoadingScreen();
}


/**
 * Fetches more Pokémon data from the PokéAPI and renders their cards.
 * 
 * This function fetches data for the next 40 Pokémon starting from the current Pokémon index.
 * It updates the global `data` array with the fetched Pokémon data and calls `renderPokemonCard`
 * to display each Pokémon.
 * 
 * @async
 * @function fetchMorePokemons
 * @returns {Promise<void>} A promise that resolves when all Pokémon data has been fetched and rendered.
 */
async function fetchMorePokemons() {
  const nextPokemon = currentPokemon + 40;

  for (let p = currentPokemon; p < nextPokemon; p++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${p}`;
    let response = await fetch(url);
    let pokemonData = await response.json();
    data.push(pokemonData);
    renderPokemonCard(p, pokemonData);
  }
  currentPokemon = nextPokemon;
}


/**
 * Opens the fullscreen view for a selected Pokémon.
 *
 * @param {number} p - The index of the Pokémon in the data array (1-based index).
 */
function openFullscreen(p) {
  let pokemon = data[p - 1];
  let object = getFullscreenObject(pokemon);
  let fullScreenContent = document.getElementById("fullscreen");

  showFullscreen(fullScreenContent);

  fullScreenContent.innerHTML = generateFullscreenHtml(p,object.nameUpperCase,object.image,object.xp,object.classbg,object.height,object.weight);
  addCardTypeFullscreen(p, pokemon);
  renderStatsChart(pokemon);

  updateCloseIconTheme();
}


/**
 * Transforms a Pokémon object into a fullscreen display object.
 *
 * @param {Object} pokemon - The Pokémon object.
 * @param {string} pokemon.name - The name of the Pokémon.
 * @param {Object} pokemon.sprites - The sprites object containing image URLs.
 * @param {Object} pokemon.sprites.other - The other sprites object.
 * @param {Object} pokemon.sprites.other.home - The home sprites object.
 * @param {string} pokemon.sprites.other.home.front_default - The URL of the Pokémon's front default image.
 * @param {number} pokemon.base_experience - The base experience of the Pokémon.
 * @param {Array} pokemon.types - The array of types the Pokémon has.
 * @param {Object} pokemon.types[0] - The first type object.
 * @param {Object} pokemon.types[0].type - The type details object.
 * @param {string} pokemon.types[0].type.name - The name of the first type.
 * @param {number} pokemon.height - The height of the Pokémon in decimetres.
 * @param {number} pokemon.weight - The weight of the Pokémon in hectograms.
 * @returns {Object} The transformed Pokémon object for fullscreen display.
 * @returns {string} return.name - The name of the Pokémon.
 * @returns {string} return.nameUpperCase - The name of the Pokémon with the first letter capitalized.
 * @returns {string} return.image - The URL of the Pokémon's front default image.
 * @returns {number} return.xp - The base experience of the Pokémon.
 * @returns {string} return.classbg - The name of the first type of the Pokémon.
 * @returns {number} return.height - The height of the Pokémon in meters.
 * @returns {number} return.weight - The weight of the Pokémon in kilograms.
 */
function getFullscreenObject(pokemon) {
  return {
    name: pokemon.name,
    nameUpperCase: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
    image: pokemon.sprites.other.home["front_default"],
    xp: pokemon.base_experience,
    classbg: pokemon.types[0].type.name,
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
  };
}


/**
 * Displays the given content in fullscreen mode by removing the "d-none" class
 * and adding the "overflow-hidden" class to the document body.
 *
 * @param {HTMLElement} fullScreenContent - The HTML element to be displayed in fullscreen mode.
 */
function showFullscreen(fullScreenContent) {
  fullScreenContent.classList.remove("d-none");
  document.body.classList.add("overflow-hidden");
}


/**
 * Navigates to the previous image in the sequence.
 *
 * @param {number} p - The current image index.
 * If the current index is greater than 1, it opens the previous image.
 * If the current index is 1 or less, it wraps around to the last image in the sequence.
 */
function previousImg(p) {
  if (p > 1) {
    openFullscreen(p - 1);
  } else {
    openFullscreen(data.length);
  }
}


/**
 * Advances to the next image in the dataset.
 * If the current position is less than the length of the data, it opens the next image.
 * If the current position is at the end of the dataset, it loops back to the first image.
 *
 * @param {number} p - The current position in the dataset.
 */
function nextImg(p) {
  if (p < data.length) {
    openFullscreen(p + 1);
  } else {
    openFullscreen(1);
  }
}


/**
 * Closes the fullscreen view if the event target is the fullscreen content or a close button.
 *
 * @param {Event} event - The event object triggered by the user interaction.
 */
function closeFullscreen(event) {
  let fullScreenContent = document.getElementById("fullscreen");

  if (event.target === fullScreenContent || event.target.closest('.close-button')) {
    fullScreenContent.classList.add("d-none");
    document.body.classList.remove("overflow-hidden");
  }
}


/**
 * Adds the Pokémon types to the fullscreen card element.
 *
 * @param {number} p - The index or identifier for the Pokémon card.
 * @param {Object} pokemon - The Pokémon object containing its details.
 * @param {Array} pokemon.types - An array of type objects for the Pokémon.
 * @param {Object} pokemon.types[].type - The type object.
 * @param {string} pokemon.types[].type.name - The name of the type.
 */
function addCardTypeFullscreen(p, pokemon) {
  let typeContent = document.getElementById(`cardTypeFullscreen${p}`);
  let type0 = pokemon.types[0].type.name;
  let type1 = pokemon.types[1]?.type.name;

  typeContent.innerHTML = generateCardTypeFullscreenHtml(type0, type1);
}


/**
 * Toggles the theme of the webpage between light mode and dark mode.
 * 
 * This function toggles the "dark-mode" class on the body element and updates
 * the theme icon accordingly. It also stores the current theme preference in
 * localStorage.
 * 
 * - If the "dark-mode" class is present on the body element, the theme is set
 *   to dark mode, the theme icon is changed to a moon icon, and the theme
 *   preference is saved in localStorage.
 * - If the "dark-mode" class is not present on the body element, the theme is
 *   set to light mode, the theme icon is changed to a sun icon, and the theme
 *   preference is removed from localStorage.
 */
function toggleTheme() {
  let body = document.querySelector("body");
  let themeIcon = document.getElementById("themeIcon");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark-mode");
    themeIcon.src = "./img/theme_icons/mond.png";
  } else {
    localStorage.removeItem("theme");
    themeIcon.src = "./img/theme_icons/sonne (2).png";
  }
}


/**
 * Checks the local storage for the theme setting and applies the corresponding theme to the body element.
 * If the theme is set to "dark-mode", it adds the "dark-mode" class to the body and changes the theme icon to a moon image.
 * If the theme is not set to "dark-mode", it sets the theme icon to a sun image.
 */
function checkLocalStorage() {
  let body = document.querySelector("body");
  let themeIcon = document.getElementById("themeIcon");
  let theme = localStorage.getItem("theme");

  if (theme === "dark-mode") {
    body.classList.add("dark-mode");
    themeIcon.src = "./img/theme_icons/mond.png";
  } else {
    themeIcon.src = "./img/theme_icons/sonne (2).png";
  }
}


/**
 * Updates the source of close icons based on the current theme.
 * If the body has the class "dark-mode", the close icons will use the dark mode icon.
 * Otherwise, the close icons will use the light mode icon.
 */
function updateCloseIconTheme() {
  let body = document.querySelector("body");
  let closeIcons = document.querySelectorAll(".close-icon");

  if (body.classList.contains("dark-mode")) {
    closeIcons.forEach(icon => icon.src = "./img/icons/xmark.svg");
  } else {
    closeIcons.forEach(icon => icon.src = "./img/icons/xmark-white.svg");
  }
}
