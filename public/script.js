/*
- Portfolio interactions: theme toggle, mobile menu, scroll reveal, active link,
- tracklist durations, profile photo fallback and chatbot.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  /* ---------- Theme toggle (remembers choice) ---------- */
  var themeBtn = document.getElementById("theme");
  var themeColor = document.getElementById("themeColor");

  function applyTheme(theme) {
    var dark = theme === "dark";
    root.setAttribute("data-theme", dark ? "dark" : "light");

    if (themeBtn) {
      themeBtn.setAttribute(
        "aria-label",
        dark ? "Switch to light mode" : "Switch to dark mode"
      );
    }

    if (themeColor) {
      themeColor.setAttribute("content", dark ? "#0a1020" : "#f6f7fb");
    }
  }

  applyTheme(root.getAttribute("data-theme") || "light");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";

      applyTheme(next);

      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");

  function setMenu(open) {
    if (!menu || !burger) return;

    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (burger && menu) {
    burger.addEventListener("click", function () {
      setMenu(!menu.classList.contains("open"));
    });

    menu.addEventListener("click", function (event) {
      if (event.target.tagName === "A") setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var REVEAL =
    "main section:not(.hero), h2, .intro, .notes > li, .about-grid > *, " +
    ".cases > *, .album, .projects > *, .skills > *, .two-col > div > h3, " +
    ".two-col > div > p, .certs > li, .contact > div > p, " +
    ".contact > div > .btns, .contact-links > li";

  var items = document.querySelectorAll(REVEAL);

  items.forEach(function (element) {
    element.classList.add("rv");

    var index = Array.prototype.indexOf.call(
      element.parentNode.children,
      element
    );

    element.style.setProperty("--i", Math.min(index, 6));
  });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px" }
    );

    items.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    items.forEach(function (element) {
      element.classList.add("in");
    });
  }

  /* ---------- Scroll progress ---------- */
  var bar = document.createElement("div");
  bar.className = "progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  var navEl = document.getElementById("nav");
  var ticking = false;
  var hero = document.querySelector(".hero");
  var stage = document.querySelector(".stage");
  var calm =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    ticking = false;

    var max = root.scrollHeight - window.innerHeight;

    root.style.setProperty(
      "--p",
      max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : "0"
    );

    if (navEl) {
      navEl.classList.toggle("scrolled", window.scrollY > 8);
    }

    if (hero && !calm) {
      hero.style.setProperty(
        "--sy",
        Math.min(window.scrollY, 600).toFixed(0)
      );
    }
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Hero: pointer movement ---------- */
  if (
    hero &&
    stage &&
    !calm &&
    window.matchMedia &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    hero.addEventListener("pointermove", function (event) {
      stage.style.setProperty(
        "--mx",
        (event.clientX / window.innerWidth - 0.5).toFixed(3)
      );

      stage.style.setProperty(
        "--my",
        (event.clientY / window.innerHeight - 0.5).toFixed(3)
      );
    });

    hero.addEventListener("pointerleave", function () {
      stage.style.setProperty("--mx", 0);
      stage.style.setProperty("--my", 0);
    });
  }

  /* ---------- Cards: light follows the pointer ---------- */
  document
    .querySelectorAll(".case, .project, .skills > div")
    .forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();

        card.style.setProperty("--mx", event.clientX - rect.left + "px");
        card.style.setProperty("--my", event.clientY - rect.top + "px");
      });
    });

  /* ---------- Highlight current section in navbar ---------- */
  var links = document.querySelectorAll(".menu a");

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          links.forEach(function (link) {
            var isActive =
              link.getAttribute("href") === "#" + entry.target.id;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    document.querySelectorAll("main section[id]").forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---------- Tracklist: durations in months (inclusive) ---------- */
  var now = new Date();
  var total = 0;

  document.querySelectorAll(".dur").forEach(function (duration) {
    var from = duration.dataset.from.split("-").map(Number);

    var to =
      duration.dataset.to === "now"
        ? [now.getFullYear(), now.getMonth() + 1]
        : duration.dataset.to.split("-").map(Number);

    var months = (to[0] - from[0]) * 12 + (to[1] - from[1]) + 1;

    total += months;
    duration.textContent = months + " mo";
  });

  var runtime = document.getElementById("runtime");

  if (runtime && total) {
    runtime.textContent = total + " months";
  }

  /* ---------- Profile photo fallback ---------- */
  var photo = document.querySelector(".photo img");

  if (photo) {
    photo.addEventListener("error", function () {
      photo.remove();
    });

    if (photo.complete && photo.naturalWidth === 0 && photo.currentSrc) {
      photo.remove();
    }
  }

  /* ---------- Chatbot ---------- */
  // Same-origin API on Vercel: the backend lives at /api (see app.py).
  var CHAT_API_URL = "/api";

  var chat = document.getElementById("chat");
  var fab = document.getElementById("chatFab");
  var log = document.getElementById("log");
  var form = document.getElementById("chatForm");
  var input = document.getElementById("q");
  var chips = document.getElementById("chips");
  var history = [];
  var busy = false;

  var PHRASES = [
    "Dropping the needle.",
    "Flipping through the liner notes.",
    "Finding the right track.",
    "Mixing your answer..."
  ];

  function addMessage(text, who) {
    var message = document.createElement("div");
    message.className = "msg " + who;

    message.textContent = String(text)
      .trim()
      .replace(/\n{3,}/g, "\n\n");

    log.appendChild(message);
    log.scrollTop = log.scrollHeight;

    return message;
  }

  // Suggested questions stay available: after every reply they move to the end of the conversation.
  function keepChips(reply) {
    if (chips) {
      chips.hidden = false;
      log.appendChild(chips);
    }

    // Show the start of the new answer instead of jumping past it
    if (reply) {
      log.scrollTop +=
        reply.getBoundingClientRect().top - log.getBoundingClientRect().top - 8;
    }
  }

  function openChat(open) {
    if (!chat || !fab) return;

    chat.hidden = !open;
    fab.setAttribute("aria-expanded", String(open));

    if (open && input) {
      input.focus();
    } else {
      fab.focus();
    }
  }

  function showLoading() {
    var message = document.createElement("div");
    message.className = "msg bot loading";

    message.innerHTML =
      '<span class="disc" aria-hidden="true"></span><span class="txt"></span>';

    var text = message.querySelector(".txt");
    var index = 0;
    var started = Date.now();

    text.textContent = PHRASES[0];

    var timer = setInterval(function () {
      text.textContent =
        Date.now() - started > 8000
          ? "Still working on it..."
          : PHRASES[++index % PHRASES.length];
    }, 1800);

    log.appendChild(message);
    log.scrollTop = log.scrollHeight;

    return function () {
      clearInterval(timer);
      message.remove();
    };
  }

  async function ask(question) {
    var q = question.trim();

    if (busy || q.length < 2 || !input || !log) return;

    busy = true;
    input.disabled = true;

    addMessage(q, "user");

    var stopLoading = showLoading();

    try {
      var controller = new AbortController();

      var timeout = setTimeout(function () {
        controller.abort();
      }, 30000);

      var response;

      try {
        response = await fetch(CHAT_API_URL + "/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question: q,
            history: history.slice(-6)
          }),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeout);
      }

      if (response.status === 429) {
        throw new Error("rate");
      }

      if (!response.ok) {
        throw new Error("server");
      }

      var data = await response.json();

      stopLoading();
      keepChips(addMessage(data.answer, "bot"));

      history.push(
        { role: "user", content: q },
        {
          role: "assistant",
          content: String(data.answer).slice(0, 800)
        }
      );

      if (history.length > 12) {
        history = history.slice(-12);
      }
    } catch (error) {
      stopLoading();

      keepChips(addMessage(
        error.message === "rate"
          ? "That's a lot of questions at once. Please try again in a few minutes."
          : "The record skipped. Please try again, or email pesvarramkumar@gmail.com.",
        "bot"
      ));
    } finally {
      busy = false;
      input.disabled = false;
      input.focus();
    }
  }

  if (chat && log && form && input && fab) {
    addMessage(
      "Hi! Ask me anything about Esvar's work, projects, skills or education.",
      "bot"
    );

    if (chips) {
      log.appendChild(chips);
    }

    // Suggested questions sit in the conversation, so answers get the full height.
    fab.addEventListener("click", function () {
      openChat(true);
    });

    var closeButton = document.getElementById("chatClose");

    if (closeButton) {
      closeButton.addEventListener("click", function () {
        openChat(false);
      });
    }

    chat.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        openChat(false);
        return;
      }

      if (event.key !== "Tab") return;

      // Keep keyboard focus inside the open chat panel.
      var focusable = Array.prototype.filter.call(
        chat.querySelectorAll("button, input"),
        function (element) {
          return !element.disabled && element.offsetParent !== null;
        }
      );

      if (!focusable.length) return;

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var question = input.value;
      input.value = "";
      ask(question);
    });

    if (chips) {
      chips.addEventListener("click", function (event) {
        if (event.target.tagName === "BUTTON") {
          ask(event.target.textContent);
        }
      });
    }
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
