let table;
let years = [];
let products = [];
let data = [];
let selectedProduct = -1;
let productButtonColors = [];
let yScale = 0.5;

// Variables for tooltip
let tooltipVisible = false;
let tooltipX, tooltipY;

function preload() {
  // Load the CSV file
  table = loadTable("R data cleaning/no_null_clean_data.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth - 100, windowHeight - 100);
  textAlign(RIGHT, CENTER);

  // Extract years and products from the CSV file
  years = table.getColumn("Year");
  products = table.columns.slice(2);

  // Initialize button colors
  productButtonColors = Array(products.length).fill(color('#DCEDB9'));

  // Convert the table to a 2D array for easy access to data
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = [];
    for (let j = 0; j < products.length; j++) {
      row.push(float(table.getString(i, j + 2))); // Skip the first two columns (Index and Year)
    }
    data.push(row);
  }
  redraw();
}

function draw() {
  background('#1F2421');

  // Add instruction
  fill('#DCEDB9');
  textSize(24);
  text(
    'Choose the product to see how its price changes since 2008',
    windowWidth / 2,
    60
  );

  // Draw the product buttons
  drawProductButtons();

  // Draw the line chart based on the selected product
  if (selectedProduct !== -1) {
    drawLineChart();
    drawTooltip();
  }
}

function drawProductButtons() {
  for (let i = 0; i < products.length; i++) {
    let x = 130;
    let y = 130 + i * 50;

    fill(productButtonColors[i]);

    // Draw the button as rectangle
    rect(x, y, 30, 30);
    fill('#DCEDB9');

    // Label the product
    textSize(12);
    text(products[i], x - 20, y + 15);
  }
}

function drawLineChart() {
  let spacing = (width - 300) / (years.length - 1);

  // Draw x-axis labels
  for (let i = 0; i < years.length; i++) {
    let x = 230 + i * spacing;
    let y = height - 30;

    textSize(12);
    fill('#DCEDB9');
    text(years[i], x, y);
  }

  // Draw y-axis
  stroke('#B2BD7E');
  line(230, 100, 230, height - 50);

  // Draw y-axis scale lines
  for (let i = 0; i <= 2 / yScale; i++) {
    let y = map(i * yScale, 0, 2, height - 50, 100);
    line(230, y, width - 70, y);
    textAlign(RIGHT, CENTER);
    textSize(12);
    fill('#DCEDB9');
    text("$" + (i * yScale).toFixed(2), 225, y);
  }

  // Draw the line chart
  beginShape();
  noFill();
  stroke('#DCEDB9');
  for (let i = 0; i < years.length; i++) {
    let x = 230 + i * spacing;
    let y = map(
      data[i][selectedProduct],
      0,
      max(data.map((row) => max(row))),
      height - 50,
      100
    );
    vertex(x, y);

    // Check if the mouse is near the point, show the tooltip
    if (dist(mouseX, mouseY, x, y) < 10) {
      tooltipVisible = true;
      tooltipX = x;
      tooltipY = y;
    }
  }
  endShape();
}

function drawTooltip() {
  // Draw tooltip if visible
  if (tooltipVisible) {
    // Find the index of the year corresponding to the tooltipX position
    let yearIndex = floor(map(tooltipX, 230, width - 70, 0, years.length));

    // Display the price
    let price = data[yearIndex][selectedProduct];
    text("$" + price.toFixed(2), tooltipX, tooltipY - 15);
  }
}


function mousePressed() {
  // Check if the mouse is over any product button
  for (let i = 0; i < products.length; i++) {
    let x = 130; // Should be same as draw button
    let y = 130 + i * 50;

    if (mouseX > x && mouseX < x + 30 && mouseY > y && mouseY < y + 30) {
      // Change the color of the clicked product button
      productButtonColors = Array(products.length).fill(color('#DCEDB9')); // Reset all product button colors
      productButtonColors[i] = color('#F2F3D9'); // Set the clicked product button to blue
      selectedProduct = i;
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth - 100, windowHeight - 100);
}
