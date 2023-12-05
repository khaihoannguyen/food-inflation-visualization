let table;
let years = [];
let products = [];
let data = [];
let selectedYear = -1;
let selectedProduct = -1;
let buttonColors = [];
let productButtonColors = [];

function preload() {
  // Load the CSV file
  table = loadTable("R data cleaning/no_null_clean_data.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth - 100, windowHeight - 100);
  textAlign(CENTER, CENTER);
  

  // Extract years and products from the CSV file
  years = table.getColumn("Year");
  products = table.columns.slice(2);

  // Initialize button colors
  buttonColors = Array(years.length).fill(color(200));
  productButtonColors = Array(products.length).fill(color(200));

  // Convert the table to a 2D array for easy access to data
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = [];
    for (let j = 0; j < products.length; j++) {
      row.push(float(table.getString(i, j + 2))); // Skip the first two columns (Index and Year)
    }
    data.push(row);
  }
}

function draw() {
  background(255);

  // Add instruction

  fill(0);
  textSize(24);
  text(
    'Choose the produce and click on the year to see how price changes in each year',
    width / 2,
    60
  );
  // Draw the timeline
  drawTimeline();

  // Draw the circle based on the selected year and product
  if (selectedYear !== -1 && selectedProduct !== -1) {
    let circleRadius = sqrt(data[selectedYear][selectedProduct]) * 130;
    fill(buttonColors[selectedYear]);
    ellipse(width / 2, height / 2, circleRadius * 2);

    // Add the text for price and name of product
    fill(0);
    textSize(20);
    text(
      `$${data[selectedYear][selectedProduct].toFixed(2)}`,
      width / 2,
      height / 2 + 370);

    fill(0);
    textSize(20);
    text(products[selectedProduct], width / 2, height / 2 + 390);
  }
}

function drawTimeline() {
  let spacing = width / (years.length + 1);

  // Draw the nodes
  for (let i = 0; i < years.length; i++) {
    let x = spacing * (i + 1);
    let y = height - 50;

    fill(buttonColors[i]);
    ellipse(x, y, 20, 20);

    fill(0);
    textSize(12);
    text(years[i], x, y + 25);
  }

  // Draw the product buttons
  for (let i = 0; i < products.length; i++) {
    let x = 30;
    let y = 130 + i * 50;

    fill(productButtonColors[i]);
    rect(x, y, 30, 30);

    fill(0);
    textSize(12);
    text(products[i], x + 85, y + 15);
  }
}

function mousePressed() {
  // Check if the mouse is over any node in the timeline
  let spacing = width / (years.length + 1);
  for (let i = 0; i < years.length; i++) {
    let x = spacing * (i + 1);
    let y = height - 50;

    if (dist(mouseX, mouseY, x, y) < 10) {
      // Change the color of the clicked year button
      buttonColors = Array(years.length).fill(color(200)); // Reset all year button colors
      buttonColors[i] = color(255, 0, 0); // Set the clicked year button to red
      selectedYear = i;
      break;
    }
  }

  // Check if the mouse is over any product button
  for (let i = 0; i < products.length; i++) {
    let x = 30;
    let y = 130 + i * 50;

    if (mouseX > x && mouseX < x + 30 && mouseY > y && mouseY < y + 30) {
      // Change the color of the clicked product button
      productButtonColors = Array(products.length).fill(color(200)); // Reset all product button colors
      productButtonColors[i] = color(0, 0, 255); // Set the clicked product button to blue
      selectedProduct = i;
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
