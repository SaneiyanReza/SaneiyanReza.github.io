(function () {
  "use strict";

  const preloader = document.querySelector(".preloader");
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelector(".nav__links");
  const backTop = document.querySelector(".back-top");
  const revealElements = document.querySelectorAll(".reveal");
  const navLinkItems = document.querySelectorAll(".nav__link[data-section]");

  window.addEventListener("load", function () {
    setTimeout(function () {
      if (preloader) preloader.classList.add("hidden");
    }, 1200);
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  function onScroll() {
    const scrollY = window.scrollY;

    if (nav) {
      nav.classList.toggle("scrolled", scrollY > 50);
    }

    if (backTop) {
      backTop.classList.toggle("visible", scrollY > 500);
    }

    let currentSection = "";
    document.querySelectorAll("section[id]").forEach(function (section) {
      const top = section.offsetTop - 120;
      if (scrollY >= top) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinkItems.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("data-section") === currentSection);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  document.querySelectorAll(".stat-item__value[data-count]").forEach(function (el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    let started = false;

    const counterObserver = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting && !started) {
          started = true;
          animateCount(el, target, suffix);
          counterObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    counterObserver.observe(el);
  });

  function animateCount(el, target, suffix) {
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }
})();
