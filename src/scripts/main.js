import {
  navLinks,
  heroSlides,
  intro,
  introGallery,
  cards,
  timelineItems,
  visit,
} from "../data/content.js";
import {
  renderNav,
  renderHero,
  renderIntro,
  renderCards,
  renderTimeline,
  renderVisit,
} from "./modules/render.js";
import { initMenu } from "./modules/menu.js";
import { initSlider } from "./modules/slider.js";
import { initBackToTop } from "./modules/backtop.js";
import { initRevealAnimation } from "./modules/reveal.js";

const mainNav = document.getElementById("mainNav");
const hero = document.getElementById("hero");
const introTitle = document.getElementById("introTitle");
const introDescription = document.getElementById("introDescription");
const introGalleryTarget = document.getElementById("introGallery");
const cardsGrid = document.getElementById("cardsGrid");
const timeline = document.getElementById("timeline");
const visitSection = document.getElementById("visit");
const visitTitle = document.getElementById("visitTitle");
const visitAddress = document.getElementById("visitAddress");
const menuToggle = document.querySelector(".menu-toggle");
const backTop = document.getElementById("backTop");

renderNav(mainNav, navLinks);
renderHero(hero, heroSlides);
renderIntro(introTitle, introDescription, introGalleryTarget, intro, introGallery);
renderCards(cardsGrid, cards);
renderTimeline(timeline, timelineItems);
renderVisit(visitTitle, visitAddress, visitSection, visit);

initMenu(menuToggle, mainNav);
initSlider(hero);
initBackToTop(backTop);
initRevealAnimation(".timeline-item");
