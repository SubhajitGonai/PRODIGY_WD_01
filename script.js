// Variables for stopwatch
let hr = min = sec = ms = "00";
let startTimer;
let paused = false;

// Elements
const startBtn = document.querySelector(".start");
const pauseBtn = document.querySelector(".pause");
const resetBtn = document.querySelector(".reset");
const lapBtn = document.querySelector(".lap");
const lapContainer = document.querySelector(".lap-container");
const quoteBox = document.querySelector(".quote-box");
const dateBoxes = document.querySelectorAll(".date-box");
const timeOfDayBox = document.querySelector(".time-of-day-box");

// Quotes
const quotes = [
  "Believe you can and you're halfway there.",
  "Act as if what you do makes a difference. It does.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "Do not wait; the time will never be 'just right.' Start where you stand, and work with whatever tools you may have at your command, and better tools will be found as you go along.",
  "The only limit to our realization of tomorrow is our doubts of today.",
  "The only way to do great work is to love what you do."
];

// Track previous date and day values
let prevDay = "";
let prevMonth = "";
let prevYear = "";
let prevDayOfWeek = "";
let prevPeriod = "";

// Load sound
const bipSound = new Audio('sounds/bip.mp3');
const clockSound = new Audio('clock.mp3');

// Ensure sounds are loaded
bipSound.addEventListener('canplaythrough', () => console.log('Bip sound loaded'));
clockSound.addEventListener('canplaythrough', () => console.log('Clock sound loaded'));

// Play sound with error handling
function playSound(sound) {
  if (sound) {
    sound.play().catch(error => console.error('Error playing sound:', error));
  }
}

// Event Listeners
startBtn.addEventListener("click", start);
pauseBtn.addEventListener("click", pause);
resetBtn.addEventListener("click", reset);
lapBtn.addEventListener("click", recordLap);

// Functions
function start() {
  if (!paused) {
    startBtn.classList.add("active");
    pauseBtn.classList.remove("stopActive");
    startTimer = setInterval(updateTime, 10);
  } else {
    paused = false;
    startBtn.classList.add("active");
    pauseBtn.classList.remove("stopActive");
    startTimer = setInterval(updateTime, 10);
  }
}

function pause() {
  startBtn.classList.remove("active");
  pauseBtn.classList.add("stopActive");
  clearInterval(startTimer);
  paused = true;
}

function reset() {
  startBtn.classList.remove("active");
  pauseBtn.classList.remove("stopActive");
  clearInterval(startTimer);
  hr = min = sec = ms = "00";
  putValue();
  lapContainer.innerHTML = "";
  generateQuote(); // Generate a new quote when resetting
  paused = false;
}

// Update clock function
function updateClock() {
  const now = new Date();
  const seconds = now.getSeconds();
  const secondsDegrees = ((seconds / 60) * 360) + 90;
  document.querySelector('.second-hand').style.transform = `rotate(${secondsDegrees}deg)`;

  const mins = now.getMinutes();
  const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6) + 90;
  document.querySelector('.min-hand').style.transform = `rotate(${minsDegrees}deg)`;

  const hour = now.getHours();
  const hourDegrees = ((hour % 12) / 12) * 360 + ((mins / 60) * 30) + 90;
  document.querySelector('.hour-hand').style.transform = `rotate(${hourDegrees}deg)`;

  // Play the sound when the clock hands move
  playSound(clockSound);
}

// Call updateClock regularly
setTimeout(() => {
  updateClock();
  setInterval(updateClock, 1000);
}, 1000);

function updateTime() {
  ms++;
  ms = ms < 10 ? "0" + ms : ms;
  if (ms == 100) {
    sec++;
    sec = sec < 10 ? "0" + sec : sec;
    ms = "00";
  }
  if (sec == 60) {
    min++;
    min = min < 10 ? "0" + min : min;
    sec = "00";
  }
  if (min == 60) {
    hr++;
    hr = hr < 10 ? "0" + hr : hr;
    min = "00";
  }
  putValue();
}

function putValue() {
  document.querySelector(".millisecond").innerText = ms;
  document.querySelector(".second").innerText = sec;
  document.querySelector(".minute").innerText = min;
  document.querySelector(".hour").innerText = hr;
}

function updateDate() {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString().slice(-2); // Get last 2 digits of year
  
  // Array to get short day names
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = days[now.getDay()]; // Get the short name of the day of the week

  // Update date boxes with rotation animation only if values have changed
  if (day !== prevDay) {
    animateDateChange(dateBoxes[0], day);
    prevDay = day;
  }
  if (month !== prevMonth) {
    animateDateChange(dateBoxes[1], month);
    prevMonth = month;
  }
  if (year !== prevYear) {
    animateDateChange(dateBoxes[2], year);
    prevYear = year;
  }
  if (dayOfWeek !== prevDayOfWeek) {
    animateDateChange(document.querySelector(".day-of-week"), dayOfWeek);
    prevDayOfWeek = dayOfWeek;
  }

  updateDayPeriod(now);
}

function animateDateChange(element, newValue) {
  element.classList.add('flip');
  setTimeout(() => {
    element.innerText = newValue;
    element.classList.remove('flip');
  }, 300); // Adjust the timeout to match the duration of the animation
}

function updateDayPeriod(now) {
  const hours = now.getHours();
  let period = "";
  if (hours >= 5 && hours < 12) {
    period = "morning";
  } else if (hours >= 12 && hours < 17) {
    period = "afternoon";
  } else if (hours >= 17 && hours < 21) {
    period = "evening";
  } else {
    period = "night";
  }

  if (prevPeriod && prevPeriod !== period) {
    playSound(bipSound); // Play sound on transition
  }

  timeOfDayBox.className = `time-of-day-box ${period}`;
  timeOfDayBox.innerText = getEmoji(period);

  prevPeriod = period; // Update previous period
}

function getEmoji(period) {
  switch (period) {
    case "morning":
      return "🌅";
    case "afternoon":
      return "🌞";
    case "evening":
      return "🌇";
    case "night":
      return "🌙";
    default:
      return "";
  }
}

function recordLap() {
  if (hr === "00" && min === "00" && sec === "00" && ms === "00") {
    return; // Do nothing if all values are zero
  }
  const lapItem = document.createElement("div");
  lapItem.classList.add("lap-item");
  lapItem.innerText = `Lap ${lapContainer.children.length + 1}: ${hr}:${min}:${sec}:${ms}`;
  lapContainer.appendChild(lapItem);
  generateQuote(); // Generate a new quote after recording a lap
}

function generateQuote() {
  // Clear the previous quote before adding a new one
  quoteBox.innerHTML = "";
  
  // Select a random quote
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const quoteItem = document.createElement("div");
  quoteItem.classList.add("quote");
  quoteItem.innerText = randomQuote;
  
  quoteBox.appendChild(quoteItem);
}

// Initialize quotes and update date and clock
generateQuote();
updateDate();
updateClock();
setInterval(updateDate, 1000);
