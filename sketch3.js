let table;
let years = [];
let foods = [];
let prices = [];
let hoveredCell = { i: -1, j: -1 };

function preload() {
  // Load the CSV file
  table = loadTable("R data cleaning/no_null_clean_data.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth - 100, windowHeight - 100);
  redraw();

  // Extract years and foods from the CSV file
  years = table.getColumn('Year');
  foods = table.columns.slice(2);

  // Convert the table to a 2D array for easy access to data
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = [];
    for (let j = 0; j < foods.length; j++) {
      row.push(float(table.getString(i, j + 2))); // Skip the first two columns (Index and Year)
    }
    prices.push(row);
  }
}

function draw() {
  background(255);
  drawGrid();
  drawMatrix();
}

function drawMatrix() {
  let cellWidth = width / (years.length + 1);
  let cellHeight = height / (foods.length + 1);

  // Draw circles based on the price data
  for (let i = 0; i < years.length; i++) {
    for (let j = 0; j < foods.length; j++) {
      let x = (i + 1) * cellWidth + 50;
      let y = (j + 1) * cellHeight;
      let circleSize = sqrt(prices[i][j]) * 50;

      noStroke();

      // Check if the mouse is over the circle
      if (mouseX > x - circleSize / 2 && mouseX < x + circleSize / 2 &&
          mouseY > y - circleSize / 2 && mouseY < y + circleSize / 2) {
        // Hover effect: Change color and show price
        fill(255, 0, 0); // Change the color to red (adjust as needed)
        textAlign(CENTER, CENTER);
        textSize(12);
        text(`$${prices[i][j].toFixed(2)}`, x, y - circleSize / 2 - 10);
      } else {
        // Draw normal circle
        fill(200);
      }

      ellipse(x, y, circleSize, circleSize);
    }
  }

  // Draw axes labels
  textAlign(CENTER, BOTTOM);
  for (let i = 0; i < years.length; i++) {
    let x = (i + 1) * cellWidth + 50;
    text(years[i], x, height - 40);
  }

  textAlign(RIGHT, CENTER);
  for (let j = 0; j < foods.length; j++) {
    let y = (j + 1) * cellHeight;
    text(foods[j], 100, y);
  }
}

function drawGrid() {
  // Draw horizontal grid lines
  stroke(200);
  for (let j = 1; j <= foods.length; j++) {
    let y = j * height / (foods.length + 1);
    line(100, y, width - 20, y);
  }

  // Draw vertical grid lines
  for (let i = 1; i <= years.length; i++) {
    let x = i * width / (years.length + 1) + 50;
    line(x, 50, x, height - 50);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
