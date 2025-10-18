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

const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Subscribed! Glow mail is on its way 💌");
    newsletterForm.reset();
  });
}

const joinForm = document.getElementById("join-form");
const popup = document.getElementById("form-popup");
const popupMessage = document.getElementById("form-popup-message");
const popupCloseBtn = popup?.querySelector(".form-popup__close");
const popupCtaBtn = document.getElementById("form-popup-cta");

const joinElements = joinForm
  ? {
      name: {
        input: document.getElementById("name"),
        error: document.getElementById("name-error"),
        validate: (value) =>
          value.trim().length >= 3 ? "" : "Please enter at least 3 characters.",
      },
      email: {
        input: document.getElementById("email"),
        error: document.getElementById("email-error"),
        validate: (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
            ? ""
            : "Please provide a valid email address.",
      },
      password: {
        input: document.getElementById("password"),
        error: document.getElementById("password-error"),
        validate: (value) =>
          value.length >= 8 && /\d/.test(value)
            ? ""
            : "Use at least 8 characters and include a number.",
      },
      story: {
        input: document.getElementById("story"),
        error: document.getElementById("story-error"),
        validate: (value) =>
          value.trim().length >= 15
            ? ""
            : "Tell us a bit more (minimum 15 characters).",
      },
      favorite: {
        input: document.getElementById("favorite"),
        error: document.getElementById("favorite-error"),
        validate: (value) =>
          value ? "" : "Let us know your current fave Emina item.",
      },
    }
    : {};

function setFieldState(fieldKey, message) {
  const field = joinElements[fieldKey];
  if (!field) return;
  const container = field.input.closest(".field");
  if (message) {
    container?.classList.add("error");
    field.input.setAttribute("aria-invalid", "true");
  } else {
    container?.classList.remove("error");
    field.input.removeAttribute("aria-invalid");
  }
  field.error.textContent = message;
}

function clearGroupState(groupId) {
  const error = document.getElementById(`${groupId}-error`);
  const container = error?.closest(".field");
  if (container) {
    container.classList.remove("error");
  }
  if (error) {
    error.textContent = "";
  }
}

function setGroupError(groupId, message) {
  const error = document.getElementById(`${groupId}-error`);
  const container = error?.closest(".field");
  if (container) {
    container.classList.add("error");
  }
  if (error) {
    error.textContent = message;
  }
}

function showPopup(name) {
  if (!popup || !popupMessage) return;
  popupMessage.textContent = `Hi ${name}! Keep an eye on your inbox — the latest glow news is on the way.`;
  popup.classList.add("show");
  popup.setAttribute("aria-hidden", "false");
}

function hidePopup() {
  if (!popup) return;
  popup.classList.remove("show");
  popup.setAttribute("aria-hidden", "true");
}

if (popupCloseBtn) {
  popupCloseBtn.addEventListener("click", hidePopup);
}

if (popupCtaBtn) {
  popupCtaBtn.addEventListener("click", hidePopup);
}

if (popup) {
  const backdrop = popup.querySelector(".form-popup__backdrop");
  backdrop?.addEventListener("click", hidePopup);
}

function validateJoinForm() {
  let isValid = true;

  Object.entries(joinElements).forEach(([key, config]) => {
    const value = config.input.value;
    const message = config.validate(value);
    setFieldState(key, message);
    if (message) {
      isValid = false;
    }
  });

  const skinOptions = Array.from(document.querySelectorAll('input[name="skin"]'));
  const skinSelected = skinOptions.some((option) => option.checked);
  if (!skinSelected) {
    setGroupError("skin", "Pick the skin type that feels most like you.");
    isValid = false;
  } else {
    clearGroupState("skin");
  }

  const agreeCheckbox = document.getElementById("agree");
  if (!agreeCheckbox?.checked) {
    setGroupError("agree", "Please agree to receive our glow updates.");
    isValid = false;
  } else {
    clearGroupState("agree");
  }

  return isValid;
}

if (joinForm) {
  joinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateJoinForm()) {
      return;
    }
    const nameValue = joinElements.name.input.value.trim() || "Beauty";
    showPopup(nameValue);
    joinForm.reset();
    Object.keys(joinElements).forEach((key) => setFieldState(key, ""));
    clearGroupState("skin");
    clearGroupState("agree");
  });

  Object.entries(joinElements).forEach(([key, config]) => {
    config.input.addEventListener("input", () => {
      if (config.input.closest(".field")?.classList.contains("error")) {
        const message = config.validate(config.input.value);
        setFieldState(key, message);
      }
    });
    if (config.input.tagName === "SELECT") {
      config.input.addEventListener("change", () => {
        const message = config.validate(config.input.value);
        setFieldState(key, message);
      });
    }
  });

  document.querySelectorAll('input[name="skin"]').forEach((radio) => {
    radio.addEventListener("change", () => clearGroupState("skin"));
  });

  document.getElementById("agree")?.addEventListener("change", () => {
    if (document.getElementById("agree").checked) {
      clearGroupState("agree");
    }
  });
}
