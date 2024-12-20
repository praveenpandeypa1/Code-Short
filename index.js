// script.js
const arrayContainer = document.getElementById("array-container");
const generateArrayButton = document.getElementById("generate-array");
const sortButton = document.getElementById("sort");
const algorithmSelector = document.getElementById("algorithm");

// Create an audio object for the music
const sortingMusic = new Audio("sorting.mp3"); // Use your music file
sortingMusic.loop = true; // Loop the music
sortingMusic.volume = 0.5; // Set volume to 50%

let array = [];
let animationSpeed = 300; // Adjust this for speed

// Generate a new random array
function generateArray(size = 150) {
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
  renderArray();
}

// Render the array as bars
function renderArray() {
  arrayContainer.innerHTML = "";
  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${value * 3}px`;
    bar.style.width = `${100 / array.length}%`;
    arrayContainer.appendChild(bar);
  });
}

// Utility function to pause for animations
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Utility function to swap bars
async function swapBars(bar1, bar2) {
  const tempHeight = bar1.style.height;
  bar1.style.height = bar2.style.height;
  bar2.style.height = tempHeight;
  await sleep(animationSpeed);
}

// Function to start playing music
function startMusic() {
  sortingMusic.play();
}

// Function to stop music
function stopMusic() {
  sortingMusic.pause();
  sortingMusic.currentTime = 0; // Reset to the beginning
}

// Bubble Sort
async function bubbleSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      bars[j].style.background = "red";
      bars[j + 1].style.background = "red";
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        await swapBars(bars[j], bars[j + 1]);
      }
      bars[j].style.background = "#61dafb";
      bars[j + 1].style.background = "#61dafb";
    }
    bars[array.length - i - 1].style.background = "green";
  }
}

// Insertion Sort
async function insertionSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    bars[i].style.background = "red";
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      bars[j + 1].style.height = bars[j].style.height;
      j--;
      await sleep(animationSpeed);
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${key * 3}px`;
    bars[i].style.background = "green";
  }
}

// Selection Sort
async function selectionSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    bars[i].style.background = "red";
    for (let j = i + 1; j < array.length; j++) {
      bars[j].style.background = "yellow";
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
      await sleep(animationSpeed);
      bars[j].style.background = "#61dafb";
    }
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      await swapBars(bars[i], bars[minIndex]);
    }
    bars[i].style.background = "green";
  }
}

// Quick Sort
async function quickSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  const pivotIndex = await partition(start, end);
  await quickSort(start, pivotIndex - 1);
  await quickSort(pivotIndex + 1, end);
}

async function partition(start, end) {
  const bars = document.querySelectorAll(".bar");
  let pivot = array[end];
  bars[end].style.background = "red";
  let i = start - 1;
  for (let j = start; j < end; j++) {
    bars[j].style.background = "yellow";
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      await swapBars(bars[i], bars[j]);
    }
    bars[j].style.background = "#61dafb";
  }
  [array[i + 1], array[end]] = [array[end], array[i + 1]];
  await swapBars(bars[i + 1], bars[end]);
  bars[end].style.background = "#61dafb";
  return i + 1;
}

// Merge Sort
async function mergeSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  const bars = document.querySelectorAll(".bar");
  const temp = [];
  let i = start, j = mid + 1;
  while (i <= mid && j <= end) {
    bars[i].style.background = "red";
    bars[j].style.background = "red";
    await sleep(animationSpeed);
    if (array[i] < array[j]) {
      temp.push(array[i++]);
    } else {
      temp.push(array[j++]);
    }
  }
  while (i <= mid) temp.push(array[i++]);
  while (j <= end) temp.push(array[j++]);
  for (let k = 0; k < temp.length; k++) {
    array[start + k] = temp[k];
    bars[start + k].style.height = `${temp[k] * 3}px`;
    bars[start + k].style.background = "green";
    await sleep(animationSpeed);
  }
}

// Heap Sort
async function heapSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
    await heapify(array.length, i);
  }
  for (let i = array.length - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    await swapBars(bars[0], bars[i]);
    await heapify(i, 0);
  }
}

async function heapify(n, i) {
  const bars = document.querySelectorAll(".bar");
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < n && array[left] > array[largest]) largest = left;
  if (right < n && array[right] > array[largest]) largest = right;

  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    await swapBars(bars[i], bars[largest]);
    await heapify(n, largest);
  }
}

// Handle Sorting
sortButton.addEventListener("click", async () => {
  startMusic(); // Start the music when sorting begins
  const algorithm = algorithmSelector.value;
  switch (algorithm) {
    case "bubble":
      await bubbleSort();
      break;
    case "insertion":
      await insertionSort();
      break;
    case "selection":
      await selectionSort();
      break;
    case "quick":
      await quickSort();
      break;
    case "merge":
      await mergeSort();
      break;
    case "heap":
      await heapSort();
      break;
    default:
      alert("Please select a valid sorting algorithm!");
  }
  stopMusic(); // Stop the music when sorting is complete
});

// Event Listeners
generateArrayButton.addEventListener("click", () => generateArray());
generateArray();
