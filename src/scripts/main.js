import { getSiteData } from "./modules/data-store.js";
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

const siteData = getSiteData();

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

renderNav(mainNav, siteData.navLinks);
renderHero(hero, siteData.heroSlides);
renderIntro(introTitle, introDescription, introGalleryTarget, siteData.intro, siteData.introGallery);
renderCards(cardsGrid, siteData.cards);
renderTimeline(timeline, siteData.timelineItems);
renderVisit(visitTitle, visitAddress, visitSection, siteData.visit);

initMenu(menuToggle, mainNav);
initSlider(hero);
initBackToTop(backTop);
