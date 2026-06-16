const translations = {
  ua: {
    nav_about: "про нас",
    nav_news: "новини",
    nav_cases: "кейси",
    nav_career: "вакансії",
    nav_contacts: "контакти",
    hero_title:
      "Синтезуємо <span>AI-рішення</span> для маркетингу нового покоління",
    hero_lead:
      "Sintez AI — digital agency з власною AI-моделлю для оцінки ефективності рекламних кампаній, аналізу релевантності креативів та прогнозування результативності digital-стратегій.",
    btn_project: "обговорити проект",
    btn_more: "дізнатись більше",
    btn_cases: "дивитися кейси",
  },
  en: {
    nav_about: "about us",
    nav_news: "news",
    nav_cases: "cases",
    nav_career: "careers",
    nav_contacts: "contacts",
    hero_title:
      "We synthesize <span>AI solutions</span> for next-generation marketing",
    hero_lead:
      "Sintez AI is a digital agency with its own AI model for campaign quality scoring, creative relevance analysis and performance forecasting.",
    btn_project: "discuss a project",
    btn_more: "learn more",
    btn_cases: "view cases",
  },
};
function setLang(lang) {
  localStorage.setItem("sintezLang", lang);
  document.documentElement.lang = lang === "en" ? "en" : "uk";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.dataset.i18n;
    if (translations[lang] && translations[lang][k])
      el.innerHTML = translations[lang][k];
  });
  document
    .querySelectorAll(".lang button")
    .forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));
}
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger"),
    menu = document.querySelector(".menu");
  if (burger && menu)
    burger.addEventListener("click", () => menu.classList.toggle("open"));
  document
    .querySelectorAll(".lang button")
    .forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
  setLang(localStorage.getItem("sintezLang") || "ua");
  document.querySelectorAll("[data-service-link]").forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.dataset.serviceLink;
      document
        .querySelectorAll("[data-service-link]")
        .forEach((x) => x.classList.remove("active"));
      document
        .querySelectorAll("[data-service-panel]")
        .forEach((x) => x.classList.remove("active"));
      link.classList.add("active");
      document
        .querySelector(`[data-service-panel="${id}"]`)
        ?.classList.add("active");
    }),
  );
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      }),
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
});

/* =====================================================
   COOKIE POPUP
===================================================== */

const COOKIE_NAME = "sintez_cookie_accepted";

const COOKIE_TIME = 20 * 60 * 1000;

const cookiePopup = document.getElementById("cookiePopup");

const acceptButton = document.getElementById("acceptCookies");

function setCookie(name, value, time) {
  const expires = new Date(Date.now() + time).toUTCString();

  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
  return document.cookie.split("; ").find((row) => row.startsWith(name + "="));
}

if (cookiePopup && acceptButton) {
  if (!getCookie(COOKIE_NAME)) {
    setTimeout(() => {
      cookiePopup.classList.add("show");
    }, 1200);
  }

  acceptButton.addEventListener("click", () => {
    setCookie(COOKIE_NAME, "true", COOKIE_TIME);

    cookiePopup.classList.remove("show");
  });
}
const loginForm = document.getElementById("loginForm");

const loginError = document.getElementById("loginError");

if (loginForm && loginError) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    loginError.classList.add("show");
  });
}
