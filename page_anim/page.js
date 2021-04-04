const hero = document.querySelector(".hero");
const slider = document.querySelector(".slider");
const logo = document.querySelector("#logo");
const burger = document.querySelector(".burger");
const headline = document.querySelector(".headline");

const tl = new TimelineMax();
tl.fromTo(hero, 1, { height: "0%" }, { height: "100%", ease: Power2.easeInOut })
  .fromTo(hero, 1, { width: "100%" }, { width: "80%", ease: Power2.easeInOut })
  .fromTo(slider, 1, { x: "-100%" }, { x: "0%", ease: Power2.easeInOut }, "-=1")
  .fromTo(logo, 0.5, { opacity: 0, x: 50 }, { opacity: 1, x: 0 }, "-=0.7")
  .fromTo(burger, 0.5, { opacity: 0, x: 50 }, { opacity: 1, x: 0 }, "-=0.7")
  .fromTo(headline, 0.5, { opacity: 0 }, { opacity: 1 }, "-=0.7");
