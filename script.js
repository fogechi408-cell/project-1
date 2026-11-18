const WHATSAPP_NUMBER = "2348160402279";
const DEFAULT_BOOKING_MESSAGE = "Hi Teny Artistry, I would like to book a lash appointment.";

(function () {
  // Enable progressive scroll reveal styling only when JS runs
  document.documentElement.classList.add("js-enabled");

  function buildWhatsAppUrl(message) {
    const cleanNumber = String(WHATSAPP_NUMBER).replace(/\D/g, "");
    return "https://wa.me/" + cleanNumber + "?text=" + encodeURIComponent(message);
  }

  function formatWhatsAppDisplay(number) {
    const digits = String(number).replace(/\D/g, "");
    if (digits.length === 13 && digits.startsWith("234")) {
      return "+" + digits.slice(0, 3) + " " + digits.slice(3, 6) + " " + digits.slice(6, 9) + " " + digits.slice(9);
    }
    return "+" + digits;
  }

  function initBookNowLinks() {
    const bookingUrl = buildWhatsAppUrl(DEFAULT_BOOKING_MESSAGE);
    const bookLinks = document.querySelectorAll("[data-book-now]");
    bookLinks.forEach(function (link) {
      link.setAttribute("href", bookingUrl);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    const whatsappDirectLinks = document.querySelectorAll("[data-whatsapp-direct]");
    whatsappDirectLinks.forEach(function (link) {
      link.setAttribute("href", bookingUrl);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    const formattedNumber = formatWhatsAppDisplay(WHATSAPP_NUMBER);
    const whatsappDisplays = document.querySelectorAll("[data-whatsapp-display]");
    whatsappDisplays.forEach(function (el) {
      el.textContent = formattedNumber;
    });
  }

  function initMobileMenu() {
    const toggleBtn = document.getElementById("menu-toggle");
    const drawer = document.getElementById("mobile-drawer");
    if (!toggleBtn || !drawer) return;

    function closeMenu() {
      toggleBtn.setAttribute("aria-expanded", "false");
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
    }

    function openMenu() {
      toggleBtn.setAttribute("aria-expanded", "true");
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
    }

    toggleBtn.addEventListener("click", function () {
      const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close drawer when clicking a link inside it
    drawer.querySelectorAll("a").forEach(function (item) {
      item.addEventListener("click", closeMenu);
    });

    // Close drawer on Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && drawer.classList.contains("is-open")) {
        closeMenu();
        toggleBtn.focus();
      }
    });
  }

  function initScrollReveal() {
    const revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length) return;

    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initGalleryLightbox() {
    const lightbox = document.getElementById("gallery-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeBtn = document.getElementById("lightbox-close");
    const galleryItems = document.querySelectorAll("[data-gallery-src]");

    if (!lightbox || !lightboxImg || !lightboxCaption || !closeBtn || !galleryItems.length) {
      return;
    }

    let lastFocused = null;

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () {
        lastFocused = item;
        const src = item.getAttribute("data-gallery-src");
        const caption = item.getAttribute("data-gallery-caption") || "Teny Artistry lash set";
        lightboxImg.setAttribute("src", src);
        lightboxImg.setAttribute("alt", caption);
        lightboxCaption.textContent = caption;
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        closeBtn.focus();
      });
    });

    closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  function initEnquiryForm() {
    const form = document.getElementById("enquiry-form");
    if (!form) return;

    const fullNameInput = document.getElementById("full-name");
    const phoneInput = document.getElementById("phone-number");
    const styleSelect = document.getElementById("lash-style");
    const dateInput = document.getElementById("preferred-date");
    const messageInput = document.getElementById("enquiry-message");
    const statusBox = document.getElementById("form-status");
    const fallbackLink = document.getElementById("form-whatsapp-link");

    // Set minimum date to today so visitors pick an upcoming appointment date
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.setAttribute("min", today);
    }

    function setFieldError(input, errorId, message) {
      const errorEl = document.getElementById(errorId);
      if (message) {
        input.setAttribute("aria-invalid", "true");
        if (errorEl) errorEl.textContent = message;
      } else {
        input.removeAttribute("aria-invalid");
        if (errorEl) errorEl.textContent = "";
      }
    }

    function validateForm() {
      let valid = true;

      const nameVal = fullNameInput.value.trim();
      if (nameVal.length < 2) {
        setFieldError(fullNameInput, "error-full-name", "Please enter your full name.");
        valid = false;
      } else {
        setFieldError(fullNameInput, "error-full-name", "");
      }

      const phoneVal = phoneInput.value.trim();
      const digitsOnly = phoneVal.replace(/\D/g, "");
      if (digitsOnly.length < 7) {
        setFieldError(phoneInput, "error-phone-number", "Please enter a valid phone number.");
        valid = false;
      } else {
        setFieldError(phoneInput, "error-phone-number", "");
      }

      const styleVal = styleSelect.value;
      if (!styleVal) {
        setFieldError(styleSelect, "error-lash-style", "Please choose a lash style.");
        valid = false;
      } else {
        setFieldError(styleSelect, "error-lash-style", "");
      }

      const dateVal = dateInput.value;
      if (!dateVal) {
        setFieldError(dateInput, "error-preferred-date", "Please select your preferred date.");
        valid = false;
      } else {
        setFieldError(dateInput, "error-preferred-date", "");
      }

      const msgVal = messageInput.value.trim();
      if (msgVal.length < 4) {
        setFieldError(messageInput, "error-enquiry-message", "Please share a short note about what you would like.");
        valid = false;
      } else {
        setFieldError(messageInput, "error-enquiry-message", "");
      }

      return valid;
    }

    // Clear errors as user types
    [
      [fullNameInput, "error-full-name"],
      [phoneInput, "error-phone-number"],
      [styleSelect, "error-lash-style"],
      [dateInput, "error-preferred-date"],
      [messageInput, "error-enquiry-message"],
    ].forEach(function (pair) {
      const field = pair[0];
      const errId = pair[1];
      if (!field) return;
      field.addEventListener("input", function () {
        setFieldError(field, errId, "");
      });
      field.addEventListener("change", function () {
        setFieldError(field, errId, "");
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!validateForm()) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const fullName = fullNameInput.value.trim();
      const phone = phoneInput.value.trim();
      const lashStyle = styleSelect.value;
      const preferredDate = dateInput.value;
      const notes = messageInput.value.trim();

      const whatsappMessage = [
        "Hi Teny Artistry, I would like to make an enquiry:",
        "Full Name: " + fullName,
        "Phone Number: " + phone,
        "Lash Style: " + lashStyle,
        "Preferred Date: " + preferredDate,
        "Message: " + notes,
      ].join("\n");

      const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

      if (fallbackLink) {
        fallbackLink.setAttribute("href", whatsappUrl);
      }
      if (statusBox) {
        statusBox.classList.add("is-visible");
      }

      // Open WhatsApp via a direct anchor element to stay popup-friendly
      const tempLink = document.createElement("a");
      tempLink.href = whatsappUrl;
      tempLink.target = "_blank";
      tempLink.rel = "noopener noreferrer";
      tempLink.style.display = "none";
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initBookNowLinks();
    initMobileMenu();
    initScrollReveal();
    initGalleryLightbox();
    initEnquiryForm();
  });
})();
