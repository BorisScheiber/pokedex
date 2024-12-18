/**
 * Renders a statistics chart for a given Pokémon.
 *
 * This function retrieves the statistics of the specified Pokémon,
 * configures the chart's default font settings, and creates and
 * renders the chart in the specified canvas element. It also handles
 * window resizing and updates the chart's font size accordingly.
 *
 * @param {Object} pokemon - The Pokémon object containing the data to be displayed in the chart.
 */
function renderStatsChart(pokemon) {
  let stats = getPokemonStats(pokemon);
  let ctx = document.getElementById("statsChart");

  Chart.defaults.font.weight = 400;
  Chart.defaults.font.size = 18;
  Chart.defaults.color = "#2c2c2c";
  Chart.defaults.font.family = "Roboto Slab";

  let chart = createChart(ctx, stats);
  windowResize(chart);
  updateChartFontSize(chart);
}


/**
 * Extracts and returns the base stats of a given Pokémon.
 *
 * @param {Object} pokemon - The Pokémon object containing stats.
 * @param {Array} pokemon.stats - An array of stat objects.
 * @param {Object} pokemon.stats[].base_stat - The base stat value.
 * @returns {Object} An object containing the base stats of the Pokémon.
 * @returns {number} return.hp - The base HP stat.
 * @returns {number} return.attack - The base Attack stat.
 * @returns {number} return.defense - The base Defense stat.
 * @returns {number} return.spAttack - The base Special Attack stat.
 * @returns {number} return.spDefense - The base Special Defense stat.
 * @returns {number} return.speed - The base Speed stat.
 */
function getPokemonStats(pokemon) {
  return {
    hp: pokemon.stats[0].base_stat,
    attack: pokemon.stats[1].base_stat,
    defense: pokemon.stats[2].base_stat,
    spAttack: pokemon.stats[3].base_stat,
    spDefense: pokemon.stats[4].base_stat,
    speed: pokemon.stats[5].base_stat,
  };
}


/**
 * Creates a bar chart using Chart.js library.
 *
 * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas element where the chart will be drawn.
 * @param {Object} stats - An object containing the statistics to be displayed in the chart.
 * @param {number} stats.hp - The HP stat value.
 * @param {number} stats.attack - The Attack stat value.
 * @param {number} stats.defense - The Defense stat value.
 * @param {number} stats.spAttack - The Special Attack stat value.
 * @param {number} stats.spDefense - The Special Defense stat value.
 * @param {number} stats.speed - The Speed stat value.
 * @returns {Chart} The created Chart.js instance.
 */
function createChart(ctx, stats) {
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        `HP ${stats.hp}`,
        `Attack ${stats.attack}`,
        `Defense ${stats.defense}`,
        `Sp. Atk ${stats.spAttack}`,
        `Sp. Def ${stats.spDefense}`,
        `Speed ${stats.speed}`,
      ],
      datasets: [
        {
          data: [
            stats.hp,
            stats.attack,
            stats.defense,
            stats.spAttack,
            stats.spDefense,
            stats.speed,
          ],
          backgroundColor: [
            "#2C2C2C",
            "#FF4500",
            "#0A42E3",
            "#FFD700",
            "#32CD32",
            "#00CED1",
          ],
          borderWidth: 1.5,
          borderColor: [
            "#000000",
            "#2C2C2C",
            "#2C2C2C",
            "#2C2C2C",
            "#2C2C2C",
            "#2C2C2C",
          ],
          hoverBackgroundColor: [
            "#2C2C2C",
            "#FF4500",
            "#0A42E3",
            "#FFD700",
            "#32CD32",
            "#00CED1",
          ],
          hoverBorderColor: [
            "#000000",
            "#2C2C2C",
            "#2C2C2C",
            "#2C2C2C",
            "#2C2C2C",
            "#2C2C2C",
          ],
          borderRadius: {
            topRight: 8,
            bottomRight: 8,
          },
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}


/**
 * Updates the font size of the chart based on the window's inner width.
 * 
 * @param {Object} chart - The chart instance to update.
 */
function updateChartFontSize(chart) {
  let width = window.innerWidth;
  let fontSize;
  if (width < 380) {
    fontSize = 14;
  } else if (width < 600) {
    fontSize = 16;
  } else {
    fontSize = 18;
  }
  Chart.defaults.font.size = fontSize;
  chart.update();
}


/**
 * Attaches a resize event listener to the window that updates the chart's font size when the window is resized.
 *
 * @param {Object} chart - The chart object that needs its font size updated on window resize.
 */
function windowResize(chart) {
  window.onresize = function () {
    updateChartFontSize(chart);
  };
}
