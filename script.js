let data = [];
let currentPokemon = 41;

function init() {
  checkLocalStorage();
  getPokemons();
}


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


function closeLoadingScreen() {
  document.getElementById("loadingScreen").classList.add("d-none");
}


function showLoadingScreen() {
  document.getElementById("loadingScreen").classList.remove("d-none");
}


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


function addCardType(p, pokemonData) {
  let typeContent = document.getElementById(`cardType${p}`);
  let type0 = pokemonData.types[0].type.name;
  let type1 = pokemonData.types[1]?.type.name;

  typeContent.innerHTML = generateCardTypeHtml(type0, type1);
}


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


async function loadMore() {
  showLoadingScreen();
  await fetchMorePokemons();
  closeLoadingScreen();
}


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


function showFullscreen(fullScreenContent) {
  fullScreenContent.classList.remove("d-none");
  document.body.classList.add("overflow-hidden");
}


function previousImg(p) {
  if (p > 1) {
    openFullscreen(p - 1);
  } else {
    openFullscreen(data.length);
  }
}


function nextImg(p) {
  if (p < data.length) {
    openFullscreen(p + 1);
  } else {
    openFullscreen(1);
  }
}


function closeFullscreen(event) {
  let fullScreenContent = document.getElementById("fullscreen");

  if (event.target === fullScreenContent || event.target.closest('.close-button')) {
    fullScreenContent.classList.add("d-none");
    document.body.classList.remove("overflow-hidden");
  }
}


function addCardTypeFullscreen(p, pokemon) {
  let typeContent = document.getElementById(`cardTypeFullscreen${p}`);
  let type0 = pokemon.types[0].type.name;
  let type1 = pokemon.types[1]?.type.name;

  typeContent.innerHTML = generateCardTypeFullscreenHtml(type0, type1);
}


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


function updateCloseIconTheme() {
  let body = document.querySelector("body");
  let closeIcons = document.querySelectorAll(".close-icon");

  if (body.classList.contains("dark-mode")) {
    closeIcons.forEach(icon => icon.src = "./img/icons/xmark.svg");
  } else {
    closeIcons.forEach(icon => icon.src = "./img/icons/xmark-white.svg");
  }
}
