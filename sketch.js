let foodPriceData; // Variable to store the loaded CSV data
let years;
let selectedFoodItem = "Bananas";
let lineProgress = 0;
let lineAnimationSpeed = 0.05;
let paths = [];
let painting = false; //default is not drawing yet
let next = 0;
let current;
let previous;
let chartTopPosition;

function preload() {
  // Load data from the CSV file
  foodPriceData = loadTable(
    "R data cleaning/no_null_clean_data.csv",
    "csv",
    "header"
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  chartTopPosition = height / 2 - 100;

  // interaction vectors
  current = createVector(0, 0);
  previous = createVector(0, 0);

  // Extract years from the CSV data
  years = foodPriceData.getColumn("Year");

  // Create dropdown menu for food items
  let foodDropdown = createSelect();
  foodDropdown.position(20, height + 50);

  // Extract food items from the CSV data headers
  let foodItems = foodPriceData.columns.slice(1);
  foodItems.forEach((food) => foodDropdown.option(food));
  foodDropdown.changed(updateSelectedFoodItem);

  // Create instructions
  let instructions = createP(
    "Select a food item from the dropdown to see price changes over time:"
  );
  instructions.position(20, height + 10);

  redraw();
}

function draw() {
  background("black");

  // // If it's time for a new point
  // if (millis() > next && painting) {
  //   // Grab mouse position
  //   current.x = mouseX;
  //   current.y = mouseY;

  //   // New particle's force is based on mouse movement
  //   let force = p5.Vector.sub(current, previous);
  //   force.mult(0.05);

  //   // Add new particle
  //   paths[paths.length - 1].add(current, force);

  //   // Schedule next circle
  //   next = millis() + random(100);

  //   // Store mouse values
  //   previous.x = current.x;
  //   previous.y = current.y;
  // }

  // // Draw all paths
  // for (let i = 0; i < paths.length; i++) {
  //   paths[i].update();
  //   paths[i].display();
  // }
  drawChart();
}

function drawChart() {
  const maxValue = max(foodPriceData.getColumn(selectedFoodItem));

  // Title
  stroke("white");
  fill("white");
  textSize(26);
  text(`Food Price Changes for ${selectedFoodItem}`, 40, 50);

  let previousValue = null;

  for (let i = 0; i < years.length; i++) {
    let x = map(i, 0, years.length - 1, 50, width - 50);
    let value = foodPriceData.getString(i, selectedFoodItem);
    let y;

    if (value !== null) {
      y = map(parseFloat(value), 0, maxValue, height - 50, chartTopPosition);
      previousValue = parseFloat(value);
    } else {
      // Handle null values by using the previous non-null value
      if (previousValue !== null) {
        y = map(previousValue, 0, maxValue, height - 50, chartTopPosition);
      } else {
        // Handle the case where the first value is null
        y = height / 2;
      }
    }

    // Draw a line connecting the points
    if (i > 0) {
      let prevX = map(i - 1, 0, years.length - 1, 50, width - 50);
      let prevValue = foodPriceData.getString(i - 1, selectedFoodItem);
      let prevY;

      if (prevValue !== null) {
        prevY = map(
          parseFloat(prevValue),
          0,
          maxValue,
          height - 50,
          chartTopPosition
        );
      } else {
        // Handle null values by using the previous non-null value
        if (previousValue !== null) {
          prevY = map(
            previousValue,
            0,
            maxValue,
            height - 50,
            chartTopPosition
          );
        } else {
          // Handle the case where the first value is null
          prevY = height / 2;
        }
      }

      // Interpolate between previous and current positions for line animation
      let interX = lerp(prevX, x, lineProgress);
      let interY = lerp(prevY, y, lineProgress);

      line(prevX, prevY, interX, interY);

      // Increment line progress for animation
      lineProgress += lineAnimationSpeed;
      lineProgress = constrain(lineProgress, 0, 1);
    }

    // Draw data points
    fill(255);
    ellipse(x, y, 8, 8);
    fill(255);
    text(value, x, y - 10);

    // Draw x-axis labels
    if (i % 2 === 0) {
      push();
      translate(x, height - 45);
      text(years[i], 0, 0);
      pop();
    }
  }
}

function updateSelectedFoodItem() {
  selectedFoodItem = this.value();
  lineProgress = 0; // Reset line animation progress
  redraw();
}

// Start it up
function mousePressed() {
  next = 0;
  painting = true;
  previous.x = mouseX;
  previous.y = mouseY;
  paths.push(new Path());
}

// Stop
function mouseReleased() {
  painting = false;
}

// A Path is a list of particles
class Path {
  constructor() {
    this.particles = [];
    this.hue = random(400);
  }

  add(position, force) {
    // Add a new particle with a position, force, and hue
    this.particles.push(new Particle(position, force, this.hue));
  }

  // Display plath
  update() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
  }

  // Display plath
  display() {
    // Loop through backwards
    for (let i = this.particles.length - 1; i >= 0; i--) {
      // If we should remove it
      if (this.particles[i].lifespan <= 0) {
        this.particles.splice(i, 1);
        // Otherwise, display it
      } else {
        this.particles[i].display(this.particles[i + 1]);
      }
    }
  }
}

// Particles along the path
class Particle {
  constructor(position, force, hue) {
    this.position = createVector(position.x, position.y);
    this.velocity = createVector(force.x, force.y);
    this.drag = 0.9;
    // this.lifespan = 600;
  }

  update() {
    // Move it
    this.position.add(this.velocity);
    // Slow it down
    this.velocity.mult(this.drag);
    // Fade it out
    // this.lifespan--;
  }

  // Draw particle and connect it with a line
  // Draw a line to another
  display(other) {
    stroke(255, this.lifespan);
    fill(255, this.lifespan / 2);
    ellipse(this.position.x, this.position.y, 8, 8);
    // If we need to draw a line
    if (other) {
      line(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
    }
  }
}

function resetAnimation() {
  lineProgress = 0;
  redraw();
}