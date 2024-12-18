/**
 * Generates the HTML for a Pokémon card.
 *
 * @param {number} p - The Pokémon ID.
 * @param {string} nameUpperCase - The name of the Pokémon in uppercase.
 * @param {string} image - The URL of the Pokémon's image.
 * @param {number} xp - The experience points of the Pokémon.
 * @param {string} classbg - The background class for the card.
 * @returns {string} The HTML string for the Pokémon card.
 */
function generatePokemonCardHtml(p, nameUpperCase, image, xp, classbg) {
  return /*HTML*/ `
  <div id="pokemon${p}" class="cards bg-${classbg}" onclick="openFullscreen(${p})">
      <div class="card-number">
          <div class="pokemon-id">
              <h5>${p}</h5>
          </div>
          <div class="margin-left-auto">
              <h5>XP ${xp}</h5>
          </div>
      </div>
      <h2 id="pokemonName${p}">${nameUpperCase}</h2>
      <div class="imagebox">
          <img src="${image}" alt="">
      </div>
  
      <div id="cardType${p}" class="card-type">
  
      </div>
  
  </div>
    `;
}


/**
 * Generates HTML for displaying Pokémon types.
 *
 * @param {string} type0 - The primary type of the Pokémon.
 * @param {string} [type1] - The secondary type of the Pokémon (optional).
 * @returns {string} The generated HTML string for the Pokémon types.
 */
function generateCardTypeHtml(type0, type1) {
  let html = /*HTML*/ `
      <div class="first-type">
          <h4>${type0}</h4>
      </div>
    `;
  if (type1) {
    html += /*HTML*/ `
          <div class="second-type">
              <h4>${type1}</h4>
          </div>
      `;
  }
  return html;
}


/**
 * Generates the HTML for a fullscreen card displaying Pokémon details.
 *
 * @param {number} p - The Pokémon ID.
 * @param {string} nameUpperCase - The name of the Pokémon in uppercase.
 * @param {string} image - The URL of the Pokémon image.
 * @param {number} xp - The experience points of the Pokémon.
 * @param {string} classbg - The background class for the card.
 * @param {number} height - The height of the Pokémon in meters.
 * @param {number} weight - The weight of the Pokémon in kilograms.
 * @returns {string} The HTML string for the fullscreen card.
 */
function generateFullscreenHtml(p,nameUpperCase,image,xp,classbg,height,weight) {
  return /*HTML*/ `
    <div class="card-fullscreen bg-${classbg}">
  
  <div class="card-number card-number-fs">
      <div class="pokemon-id pokemon-id-fs">
          <h5 class="h5-fs">${p}</h5>
      </div>
      <div class="margin-left-auto">
          <h5 class="h5-fs">XP ${xp}</h5>
      </div>
  </div>
  
  <h2 class="h2-fs">${nameUpperCase}</h2>
  <div id="cardTypeFullscreen${p}" class="card-type card-type-fs"></div>
  <div class="imagebox imagebox-fs">
      <img class="fullscreen-img" src="${image}" alt="">
  </div>
  
  
  <button onclick="previousImg(${p})" class="previous-button"><img src="./img/icons/left.svg" alt=""></button>
  <button onclick="nextImg(${p})" class="next-button"><img src="./img/icons/right.svg" alt=""></button>
  <button onclick="closeFullscreen(event)" class="close-button"><img class="close-icon" src="./img/icons/xmark-white.svg" alt=""></button>

  
  <div id="about">
      <div class="about-hw">
          <div class="hw-container">
              <div class="height-container">
                  <span class="">Height</span><span class="seperator"></span><span class="">${height} m</span>
              </div>
              <div class="height-container">
                  <span class="">Weight</span><span class="seperator"></span><span class="">${weight} kg</span>
              </div>
  
          </div>
      </div>
  </div>
  
  <div id="stats" class="stats-container">
      <canvas id="statsChart" class="stats-chart"></canvas>
  </div>
  
  </div>
    `;
}


/**
 * Generates HTML for displaying Pokémon types in fullscreen mode.
 *
 * @param {string} type0 - The primary type of the Pokémon.
 * @param {string} [type1] - The secondary type of the Pokémon (optional).
 * @returns {string} The generated HTML string.
 */
function generateCardTypeFullscreenHtml(type0, type1) {
  let html = /*HTML*/ `
      <div class="first-type first-type-fs">
          <h4 class="h4-fs">${type0}</h4>
      </div>
    `;

  if (type1) {
    html += /*HTML*/ `
          <div class="second-type second-type-fs">
              <h4 class="h4-fs">${type1}</h4>
          </div>
      `;
  }
  return html;
}
