const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".slide-prev");
const nextBtn = document.querySelector(".slide-next");
const navLinks = document.querySelectorAll('nav a[href^="#"]');

const productTrack = document.querySelector(".product-track");
const productPrev = document.querySelector(".products-prev");
const productNext = document.querySelector(".products-next");
const loginButton = document.getElementById("login-action");
const joinSection = document.getElementById("join");
const joinFormCard = document.querySelector("#join .form-card");
const joinNameInput = document.getElementById("name");

let currentSlide = 0;
let slideInterval;

function showSlide(index) {
  slides.forEach((slide, idx) => {
    slide.classList.toggle("active", idx === index);
  });
  currentSlide = index;
}

function nextSlide() {
  const nextIndex = (currentSlide + 1) % slides.length;
  showSlide(nextIndex);
}

function prevSlide() {
  const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(prevIndex);
}

function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
  clearInterval(slideInterval);
  startAutoSlide();
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  startAutoSlide();
}

navLinks.forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const observedSections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (observedSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) =>
            link.classList.toggle(
              "active-link",
              link.getAttribute("href") === `#${entry.target.id}`
            )
          );
        }
      });
    },
    { threshold: 0.55 }
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}

function updateProductControls() {
  if (!productTrack || !productPrev || !productNext) return;
  const maxScroll = productTrack.scrollWidth - productTrack.clientWidth - 5;
  productPrev.disabled = productTrack.scrollLeft <= 5;
  productNext.disabled = productTrack.scrollLeft >= maxScroll;
}

function getProductScrollAmount() {
  if (!productTrack) return 0;
  const card = productTrack.querySelector(".product-card");
  if (!card) return productTrack.clientWidth * 0.8;
  const cardWidth = card.getBoundingClientRect().width;
  const style = getComputedStyle(productTrack);
  const gapValue = parseFloat(style.gap || style.columnGap || "24");
  const gap = Number.isNaN(gapValue) ? 24 : gapValue;
  return cardWidth + gap;
}

if (productTrack && productPrev && productNext) {
  updateProductControls();
  productPrev.addEventListener("click", () => {
    productTrack.scrollBy({ left: -getProductScrollAmount(), behavior: "smooth" });
  });

  productNext.addEventListener("click", () => {
    productTrack.scrollBy({ left: getProductScrollAmount(), behavior: "smooth" });
  });

  productTrack.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateProductControls);
  });

  window.addEventListener("resize", updateProductControls);
}

if (loginButton && joinSection) {
  loginButton.addEventListener("click", () => {
    joinSection.scrollIntoView({ behavior: "smooth", block: "start" });
    if (joinFormCard) {
      joinFormCard.classList.add("highlight");
      setTimeout(() => joinFormCard.classList.remove("highlight"), 3200);
    }
    if (joinNameInput) {
      setTimeout(() => joinNameInput.focus(), 600);
    }
  });
}

const joinForm = document.getElementById("join-form");
if (joinForm) {
  joinForm.addEventListener("submit", (event) => {
    if (!joinForm.checkValidity()) {
      return;
    }
    event.preventDefault();
    alert("Thank you for joining, beauty! 💖");
    joinForm.reset();
  });
}

const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Subscribed! Glow mail is on its way 💌");
    newsletterForm.reset();
  });
}
