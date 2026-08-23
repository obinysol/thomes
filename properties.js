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
const searchBar = document.querySelector(".search-bar");
const searchBarInitialTop = searchBar.getBoundingClientRect().top;
const properties = document.querySelector("#properties");

console.log(window.location.pathname.includes("/properties.html"));

window.location.pathname.includes("/properties.html") &&
  navbar.classList.add("navbar-scroll");

window.addEventListener("scroll", () => {
  if (menuHamburger.checked) return;
  if (scrollY > contactBar.getBoundingClientRect().bottom) {
    navbar.style.top = 0;
    if (
      contactBar.getBoundingClientRect().bottom <
      contactBar.getBoundingClientRect().height
    )
      searchBar.style.top = `${
        searchBarInitialTop - contactBar.getBoundingClientRect().height
      }px`;
  } else {
    navbar.style.top = `${contactBar.getBoundingClientRect().bottom > 0 ? contactBar.getBoundingClientRect().bottom : contactBar.getBoundingClientRect().height}px`;
    if (
      contactBar.getBoundingClientRect().bottom >=
      contactBar.getBoundingClientRect().height
    )
      searchBar.style.top = `${searchBarInitialTop}px`;
  }
});
