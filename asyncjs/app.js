const btn = document.querySelector("button");
const header = document.querySelector("h1");

btn.addEventListener("click", () => {
  fetch("https://api.adviceslip.com/advice")
    .then((result) => result.json())
    .then((data) => {
      header.innerText = data.slip.advice;
    });
});
