const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustBtns = document.querySelectorAll(".adjust");
const lockBtns = document.querySelectorAll(".lock");
const closeAdjustBtns = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
let initialColors;

let savedPalettes = [];

//add eventList
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor); //--- rgb -> #
    const textHex = activeDiv.querySelector("h2");
    const icons = activeDiv.querySelectorAll(".controls button");
    textHex.innerText = color.hex();

    // check text contrast
    checkTextContrast(color, textHex);
    for (icon of icons) {
      checkTextContrast(color, icon);
    }
  });
});

currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    const el = document.createElement("textarea");
    el.value = hex.innerText;
    document.body.appendChild(el);
    el.select();
    const i = document.execCommand("copy");
    document.body.removeChild(el);
    // pop up animation
    const popupBox = popup.children[0];
    popup.classList.add("active");
    popupBox.classList.add("active");

    //remove panel from UI
    popup.addEventListener("transitionend", () => {
      popup.classList.remove("active");
      popupBox.classList.remove("active");
    });
  });
});

adjustBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    sliderContainers[index].classList.toggle("active");
  });
});

closeAdjustBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    sliderContainers[index].classList.remove("active");
  });
});

generateBtn.addEventListener("click", randomColors);

lockBtns.forEach((btn, index) => {
  btn.addEventListener("click", (e) => {
    const lockSVG = e.target.children[0];
    const activeBg = colorDivs[index];
    activeBg.classList.toggle("locked");

    if (lockSVG.classList.contains("fa-lock-open")) {
      e.target.innerHTML = '<i class="fas fa-lock"></i>';
    } else {
      e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
    }
  });
});

//-----------------------------functions------------------------

// colors generator
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

function randomColors() {
  initialColors = [];

  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();

    // add it to array
    // console.log(chroma(randomColor).hex());
    if (div.classList.contains("locked")) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      initialColors.push(chroma(randomColor).hex());
    }

    // add color to the background
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;

    // check text contrast
    checkTextContrast(randomColor, hexText);

    //initial colorize sliders
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSliders(color, hue, brightness, saturation);
  });
  // reset inputs
  resetInputs();

  // check for btn contrast
  adjustBtns.forEach((btn, index) => {
    checkTextContrast(initialColors[index], btn);
    checkTextContrast(initialColors[index], lockBtns[index]);
  });
}

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  //scale satutation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);

  //scale brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  // input colorizing
  saturation.style.backgroundImage = `linear-gradient(
        to right, ${scaleSat(0)}, ${scaleSat(1)}
      )`;
  brightness.style.backgroundImage = `linear-gradient(
        to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)}
      )`;
  hue.style.backgroundImage = `linear-gradient(
        to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), 
        rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75)
      )`;
}

function hslControls(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat") ||
    e.target.getAttribute("data-hue");
  console.log(index);

  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgColor = initialColors[index]; //-- fix black color
  //console.log(bgColor);
  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  colorDivs[index].style.backgroundColor = color;

  // clorize inputs/sliders
  colorizeSliders(color, hue, brightness, saturation);
}

function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
      //console.log(slider.value);
    }
    if (slider.name === "saturation") {
      const satColor = initialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
      //console.log(slider.value);
    }
    if (slider.name === "brightness") {
      const brightColor = initialColors[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
  });
}

// LS
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");

saveBtn.addEventListener("click", (e) => {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
});

closeSave.addEventListener("click", (e) => {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.add("remove");
});

submitSave.addEventListener("click", (e) => {
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
  const name = saveInput.value;
  const colors = [];
  currentHexes.forEach((hex) => {
    colors.push(hex.innerText);
  });
});

randomColors();
