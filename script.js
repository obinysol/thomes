// const fs = require("fs");
// const html = fs.readFileSync("./index.html", "utf8");

// require("jsdom-global")(html);
// require("intersection-observer");
// require("jsdom-global")();
const navbar = document.querySelector("#navbar");
const menuItems = document.querySelectorAll(".menu-item");
const menu = document.querySelector(".menu");
const sections = document.querySelectorAll("section, #hero");
const menuHamburger = document.querySelector("#menu-hamburger");
const menuHamburgerLabel = document.querySelector(".menu-hamburger-label");
const contactBar = document.querySelector(".contact-bar");
const tappableElements = [
  ".btn",
  ".menu-item",
  ".listing",
  ".news-entry",
  ".footer-social-icons",
];

// Slides MUST be more than two to work
// Visibility MUST NOT be one of the transitioned properties transition-property CANNOT BE "all";
const SLIDERTIMING = 8000;
const slides = document.querySelectorAll(".slider-img");

let slidesArray = [];
let transition;

function createSlidesObjectArray(slidesNodeList) {
  slidesNodeList.forEach((slide, i, arr) =>
    // This is the brain of the operation: creates the logic that ensures the slide in the viewport is the second to last slide in the reel when the DOM is first loaded. Does this by giving a position property to all slides 0 is always the slide in the viewport. At position 1 is the slide next to it to the right. On the left, starting from the nearest to it is position -1, -2, -3, etc. In that order
    slidesArray.push({
      slide: slide,
      position: i <= 1 ? i : i - arr.length,
      transitions: {},
    }),
  );

  // This one is an improvement from last implementation
  function getTransitionProperties(el) {
    let transitionStylesObj = {};
    Object.keys(window.getComputedStyle(el))
      .filter((key) => key.startsWith("transition"))
      .forEach((transitionStyle) => {
        transitionStylesObj[transitionStyle] =
          window.getComputedStyle(el)[transitionStyle];
      });
    return transitionStylesObj;
  }

  slidesArray.forEach((slide, i, slides) => {
    // Storing the transition property of each slide... maybe overkill but thorough
    slide.transitions = getTransitionProperties(slide.slide);
    // Removing the transition property to hide the transform at initialization
    slide.slide.style.transition = "none";

    // Simply arranges the slides based on their position property
    slide.slide.style.transform = `translateX(${slide.position * 100}%)`;
  });
}

function arrangeSlides() {
  slidesArray.forEach((slide, i, slides) => {
    // Returning the transition property
    // slide.slide.style.transition = transition;
    Object.keys(slide.transitions).forEach((transitionStyle) => {
      slide.slide.style[transitionStyle] = slide.transitions[transitionStyle];
    });
  });

  slidesArray.forEach((slide, i, slides) => {
    // Creating the logic that ensures the slide about to move has opacity 0 so that the movement is not visible
    if (
      (slide.lastPosChange > 0 &&
        slide.position - slide.lastPosChange === 1 - slides.length) ||
      (slide.lastPosChange < 0 && slide.position - slide.lastPosChange === 2)
    ) {
      // slide.slide.style.opacity = "0";
      slide.slide.style.visibility = "hidden";
    } else {
      // slide.slide.style.opacity = "1";
      slide.slide.style.visibility = "visible";
    }
    slide.slide.style.transform = `translateX(${slide.position * 100}%)`;
  });
}

function moveSlides(count) {
  slidesArray.forEach((slide, i, slides) => {
    // Storing the change count so that it can be used in the next step of arranging slides
    slide.lastPosChange = count;
    // This is the heart of the operation: creates the logic that ensures the slide in the viewport remains the second to last frame in the reel when the slides are shifted
    if (slide.position + count > 1) slide.position = 2 - slides.length;
    else if (slide.position + count < 2 - slides.length) slide.position = 1;
    else {
      slide.position += count;
    }
  });
}

if (window.location.pathname.includes("/index.html")) {
  createSlidesObjectArray(slides);
  moveSlides(1);
  arrangeSlides();

  setInterval(() => {
    moveSlides(1);
    arrangeSlides();
  }, SLIDERTIMING);
}

window.addEventListener("scroll", () => {
  console.log(contactBar.getBoundingClientRect().height);
  if (menuHamburger.checked) return;
  if (scrollY > 0) {
    navbar.classList.add("navbar-scroll");
    navbar.style.top = 0;
  } else {
    if (
      !(
        window.location.pathname.includes("/properties.html") ||
        window.location.pathname.includes("/blog.html")
      )
    ) {
      navbar.classList.remove("navbar-scroll");
    }
    navbar.style.top = `${contactBar.getBoundingClientRect().bottom > 0 ? contactBar.getBoundingClientRect().bottom : contactBar.getBoundingClientRect().height}px`;
    // navbar.style.top = "100rem";
  }
});

document.querySelectorAll(tappableElements).forEach((item) => {
  item.addEventListener("touchstart", () => item.classList.add("tap"), {
    passive: true,
  });
  item.addEventListener(
    "touchend",
    () => {
      setTimeout(() => item.classList.remove("tap"), 120);
    },
    { passive: true },
  );
});

menuHamburgerLabel.addEventListener("click", () => {
  if (!menuHamburger.checked) navbar.classList.add("navbar-scroll");
  if (scrollY == 0 && menuHamburger.checked)
    navbar.classList.remove("navbar-scroll");
});

menu.addEventListener("click", (e) => {
  menu.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("focused");
  });
  const clicked = e.target.closest(".menu-item");
  clicked.classList.add("focused");
  menuHamburger.checked = false;
});

const observerOptions = {
  root: null,
  rootMargin: "-20% 0px -70% 0px", // tweak these values
  threshold: 0,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Remove active from all links
      menuItems.forEach((link) => link.classList.remove("focused"));

      // Find corresponding nav link and activate it
      let activeLink = document.querySelector(
        `.menu-item[href="#${entry.target.id}"]`,
      );

      // console.log(entry.target.id === "hero");
      if (entry.target.id === "hero") {
        activeLink = document.querySelector('.menu-item[href="#"]');
      }
      if (activeLink) activeLink.classList.add("focused");
    }
  });
}, observerOptions);

// 2. Observe all sections
sections.forEach((section) => observer.observe(section));
