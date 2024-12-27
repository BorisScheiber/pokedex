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
 * Fetches Pokémon data from the PokéAPI and renders Pokémon cards sequentially.
 *
 * This function fetches data for Pokémon IDs starting from 1 up to the current Pokémon index.
 * The data is fetched in parallel using `Promise.all` and then rendered sequentially for a smooth user experience.
 * Finally, it closes the loading screen.
 *
 * @async
 * @function getPokemons
 * @returns {Promise<void>} A promise that resolves when all Pokémon data has been fetched and rendered.
 */
async function getPokemons() {
  const fetchPromises = [];
  for (let p = 1; p < currentPokemon; p++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${p}`;
    fetchPromises.push(fetch(url).then(response => response.json()));
  }
  const pokemonDataArray = await Promise.all(fetchPromises);

  await renderPokemonCardsSequentially(pokemonDataArray, 1);
  closeLoadingScreen();
}


/**
 * Renders Pokémon cards sequentially with a slight delay between each rendering.
 *
 * This function takes an array of Pokémon data objects and renders each Pokémon card one by one,
 * adding the data to the global `data` array and applying a delay for visual effect.
 *
 * @async
 * @function renderPokemonCardsSequentially
 * @param {Object[]} pokemonDataArray - An array of Pokémon data objects to be rendered.
 * @param {number} startIndex - The starting index for rendering (used to calculate Pokémon IDs).
 * @returns {Promise<void>} A promise that resolves when all Pokémon cards have been rendered.
 */
async function renderPokemonCardsSequentially(pokemonDataArray, startIndex) {
  for (let p = 0; p < pokemonDataArray.length; p++) {
    const pokemonData = pokemonDataArray[p];
    data.push(pokemonData);
    renderPokemonCard(startIndex + p, pokemonData);
    await new Promise(resolve => setTimeout(resolve, 50));
  }
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
 * If the search input has 3 or more characters, it calls `showSearchResults` to display matching Pokémon cards.
 * Otherwise, it resets the search and shows all Pokémon cards.
 */
function searchPokemon() {
  let searchField = document.getElementById("searchField").value.toLowerCase();
  let pokemonCards = document.querySelectorAll(".cards");
  let noResultsMessage = document.getElementById("noResultsMessage");

  if (searchField.length >= 3) {
    showSearchResults(searchField, pokemonCards, noResultsMessage);
  } else {
    for (let i = 0; i < pokemonCards.length; i++) {
      pokemonCards[i].style.display = "flex";
    }
    noResultsMessage.classList.add("d-none");
  }
}


/**
 * Filters and displays Pokémon cards based on the search field input.
 * It hides Pokémon cards that do not match the search term and shows those that do.
 * Updates the visibility of the "No Pokémon found" message based on the results.
 *
 * @param {string} searchField - The search term entered by the user.
 * @param {NodeListOf<HTMLElement>} pokemonCards - A list of Pokémon card elements.
 * @param {HTMLElement} noResultsMessage - The HTML element for the "No Pokémon found" message.
 */
function showSearchResults(searchField, pokemonCards, noResultsMessage) {
  let found = false;

  for (let i = 0; i < pokemonCards.length; i++) {
    const pokemonCard = pokemonCards[i];
    let name = document.getElementById(`pokemonName${i + 1}`).innerText.toLowerCase();

    if (name.includes(searchField)) {
      pokemonCard.style.display = "flex";
      found = true;
    } else {
      pokemonCard.style.display = "none";
    }
  }
  toggleResultsMessage(noResultsMessage, found);
}


/**
 * Toggles the visibility of the "No Pokémon found" message based on search results.
 *
 * @param {HTMLElement} noResultsMessage - The HTML element for the "No Pokémon found" message.
 * @param {boolean} found - Indicates whether any Pokémon matches the search criteria.
 */
function toggleResultsMessage(noResultsMessage, found) {
  if (!found) {
    noResultsMessage.classList.remove("d-none");
  } else {
    noResultsMessage.classList.add("d-none");
  }
}


/**
 * Clears the search field and resets the Pokémon card display.
 * This function clears the search input, restores all Pokémon cards to a visible state,
 * and hides the "No Pokémon found" message.
 */
function clearSearchField() {
  let searchField = document.getElementById("searchField");
  searchField.value = "";
  searchPokemon();
}


/**
 * Loads more Pokémon data by showing a loading screen, fetching additional Pokémon, and then closing the loading screen.
 * 
 * @async
 * @function loadMore
 * @returns {Promise<void>} A promise that resolves when the loading process is complete.
 */
async function loadMore() {
  clearSearchField();
  showLoadingScreen();
  await fetchMorePokemons();
  closeLoadingScreen();
}


/**
 * Fetches the next batch of Pokémon data from the PokéAPI and renders their cards sequentially.
 * 
 * This function fetches data for the next 40 Pokémon starting from the current Pokémon index.
 * The data is fetched in parallel using `Promise.all` and then rendered sequentially
 * with a slight delay for a smooth user experience.
 *
 * @async
 * @function fetchMorePokemons
 * @returns {Promise<void>} A promise that resolves when all Pokémon data has been fetched, rendered, and the current index is updated.
 */
async function fetchMorePokemons() {
  const nextPokemon = currentPokemon + 40;
  const fetchPromises = [];

  for (let p = currentPokemon; p < nextPokemon; p++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${p}`;
    fetchPromises.push(fetch(url).then(response => response.json()));
  }
  const pokemonDataArray = await Promise.all(fetchPromises);
  await renderPokemonCardsSequentially(pokemonDataArray, currentPokemon);
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
 * Transforms a Pokémon object into a structured object for fullscreen display.
 *
 * @param {Object} pokemon - The Pokémon object containing its data.
 * @returns {Object} An object with transformed Pokémon data, including name, image, type, and dimensions.
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
 * Toggles the webpage theme between light and dark mode.
 * Updates the "dark-mode" class on the body, changes the theme icon, 
 * and saves the preference in localStorage.
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
