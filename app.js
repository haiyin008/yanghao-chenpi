const wholesalePrices = [150, 250, 350, 450, 600, 850, 1250, 1550, 1750, 1950];
const yearRange = document.querySelector("#year-range");
const yearLabel = document.querySelector("#selected-year");
const priceLabel = document.querySelector("#selected-price");
const priceRows = document.querySelector("#price-rows");
const modeButtons = [...document.querySelectorAll("[data-mode]")];
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".site-header nav");
const slides = [...document.querySelectorAll(".hero-slide")];
const carousel = document.querySelector(".hero-carousel");
const slideCounter = document.querySelector(".slide-count");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let mode = "retail";
let activeSlide = 0;
let autoplay = !reduceMotion.matches;
let rotation;

function retailPrice(wholesale) {
  return Math.round(wholesale * 1.2);
}

function renderPriceTable() {
  const year = Number(yearRange.value);
  const wholesale = wholesalePrices[year - 1];
  const selected = mode === "retail" ? retailPrice(wholesale) : wholesale;
  yearLabel.textContent = `${year} 年`;
  priceLabel.innerHTML = `¥${selected.toLocaleString("zh-CN")}<small>/斤</small>`;
  priceRows.innerHTML = wholesalePrices.map((amount, index) => {
    const current = index + 1 === year ? " class=\"current\" aria-current=\"true\"" : "";
    return `<tr${current}><th scope=\"row\">${index + 1} 年</th><td>¥${amount.toLocaleString("zh-CN")}</td><td>¥${retailPrice(amount).toLocaleString("zh-CN")}</td></tr>`;
  }).join("");
}

yearRange.addEventListener("input", renderPriceTable);
priceRows.addEventListener("click", event => {
  const row = event.target.closest("tr");
  if (!row) return;
  const year = Number(row.querySelector("th").textContent.match(/\d+/)[0]);
  yearRange.value = String(year);
  renderPriceTable();
});
modeButtons.forEach(button => {
  button.addEventListener("click", () => {
    mode = button.dataset.mode;
    modeButtons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    renderPriceTable();
  });
});
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
  mainNav.classList.toggle("is-open", open);
});
mainNav.addEventListener("click", event => {
  if (!event.target.closest("a")) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "打开导航菜单");
  mainNav.classList.remove("is-open");
});
renderPriceTable();

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle("is-active", i === activeSlide);
    slide.setAttribute("aria-hidden", String(i !== activeSlide));
  });
  slideCounter.textContent = `0${activeSlide + 1} / 0${slides.length}`;
}

function startRotation() {
  window.clearInterval(rotation);
  if (autoplay && !reduceMotion.matches) rotation = window.setInterval(() => showSlide(activeSlide + 1), 5500);
  carousel.classList.toggle("is-paused", !autoplay || reduceMotion.matches);
  const toggle = carousel.querySelector('[data-slide="toggle"]');
  const paused = !autoplay || reduceMotion.matches;
  toggle.setAttribute("aria-label", paused ? "开启自动播放" : "暂停自动播放");
  toggle.title = paused ? "开启自动播放" : "暂停自动播放";
}

carousel.addEventListener("click", event => {
  const action = event.target.closest("[data-slide]")?.dataset.slide;
  if (action === "previous") showSlide(activeSlide - 1);
  if (action === "next") showSlide(activeSlide + 1);
  if (action === "toggle") autoplay = !autoplay;
  startRotation();
});
carousel.addEventListener("mouseenter", () => window.clearInterval(rotation));
carousel.addEventListener("mouseleave", startRotation);
carousel.addEventListener("focusin", () => window.clearInterval(rotation));
carousel.addEventListener("focusout", event => {
  if (!carousel.contains(event.relatedTarget)) startRotation();
});
reduceMotion.addEventListener("change", startRotation);
showSlide(0);
startRotation();
