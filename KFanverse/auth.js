/* =========================================================
   HERO CAROUSEL
========================================================= */
const heroTrack = document.querySelector('.hero .image-track');
const heroImages = heroTrack ? Array.from(heroTrack.children) : [];
const heroNextBtn = document.querySelector('.hero-btn-next');
const heroPrevBtn = document.querySelector('.hero-btn-prev');
const heroDots = Array.from(document.querySelectorAll('.hero-text .dot'));

let heroIndex = 0;
let heroInterval = null;

function moveHeroToSlide(index) {
    if (!heroTrack || heroImages.length === 0) return;

    if (index < 0) index = heroImages.length - 1;
    else if (index >= heroImages.length) index = 0;

    heroTrack.style.transform = `translateX(-${index * 100}%)`;

    heroDots.forEach(d => d.classList.remove('active'));
    if (heroDots[index]) heroDots[index].classList.add('active');

    heroIndex = index;
}

function startHeroAutoPlay() {
    if (!heroTrack || heroImages.length === 0) return;
    heroInterval = setInterval(() => moveHeroToSlide(heroIndex + 1), 4000);
}

function resetHeroAutoPlay() {
    clearInterval(heroInterval);
    startHeroAutoPlay();
}

heroNextBtn?.addEventListener('click', () => {
    moveHeroToSlide(heroIndex + 1);
    resetHeroAutoPlay();
});

heroPrevBtn?.addEventListener('click', () => {
    moveHeroToSlide(heroIndex - 1);
    resetHeroAutoPlay();
});

heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        moveHeroToSlide(index);
        resetHeroAutoPlay();
    });
});

startHeroAutoPlay();

/* =========================================================
   AUTH SYSTEM (CONSOLIDATED)
========================================================= */
function updateAuthState() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const authButtons = document.querySelector(".auth-buttons");
    const userIconWrapper = document.getElementById("userIcon");
    const userIconImg = document.querySelector("#userIcon img");

    const savedPic = localStorage.getItem("userAvatar") || "pics/MomoUser.jfif";

    if (isLoggedIn) {
        if (authButtons) authButtons.style.display = "none";
        if (userIconWrapper) userIconWrapper.style.display = "block";
        if (userIconImg) {
            userIconImg.src = savedPic + "?v=" + Date.now();
        }
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (userIconWrapper) userIconWrapper.style.display = "none";
    }
}

function login() {
    const emailInput = document.querySelector("#loginForm input[type='text']");
    const passwordInput = document.querySelector("#loginForm input[type='password']");
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    // Admin login checks
    if (email === "admin123@gmail.com" && password === "admin123") {
        localStorage.setItem("role", "admin");
        window.location.href = "admin.html";
        return;
    }
    if (email === "sadmin123@gmail.com" && password === "sadmin123") {
        localStorage.setItem("role", "superadmin");
        window.location.href = "sadmin.html";
        return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", email || "ONCE_USER");
    updateAuthState();
    closeLogin();
}

function signup() {
    const usernameInput = document.querySelector("#signupForm input[type='text']");
    const username = usernameInput ? usernameInput.value.trim() : "ONCE_USER";

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", username);
    updateAuthState();
    closeLogin();
}

function logoutUser() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userAvatar");
    updateAuthState();
    window.location.href = "index.html";
}

/* =========================================================
   LOGIN MODAL (CONSOLIDATED)
========================================================= */
function openLogin() {
    document.getElementById("loginOverlay").style.display = "flex";
    showLogin();
}

function openSignup() {
    document.getElementById("loginOverlay").style.display = "flex";
    showSignup();
}

function closeLogin() {
    document.getElementById("loginOverlay").style.display = "none";
}

function showLogin(el = document.querySelector(".auth-tab")) {
    document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
    el?.classList.add("active");
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signupForm").style.display = "none";
}

function showSignup(el = document.querySelectorAll(".auth-tab")[1]) {
    document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
    el?.classList.add("active");
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
}

/* =========================================================
   MAIN INIT (CONSOLIDATED)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    updateAuthState();

    // Form submissions
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            login();
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            signup();
        });
    }

    // Home discussions
    renderHomeDiscussions();
});

/* =========================================================
   SEARCH
========================================================= */
function handleSearch() {
    let query = prompt("Search KFanverse navigation:");
    if (!query) return;

    query = query.toLowerCase();

    const routes = {
        "home": "index.html",
        "update": "updates.html",
        "quiz": "quiz.html",
        "discussion": "discussions.html",
        "merch": "merch.html",
        "about": "about us.html"
    };

    for (const [key, url] of Object.entries(routes)) {
        if (query.includes(key)) {
            window.location.href = url;
            return;
        }
    }
    alert("No results found 😢");
}

/* =========================================================
   LOADER
========================================================= */
const startBtn = document.getElementById("start-btn");
const loader = document.getElementById("loader");
const content = document.getElementById("main-content");
const audio = document.getElementById("opening-audio");

window.addEventListener("load", () => {
    const hasEntered = sessionStorage.getItem("hasEntered");
    if (loader) loader.style.display = hasEntered === "true" ? "none" : "flex";
    if (content) content.style.display = hasEntered === "true" ? "block" : "none";
});

startBtn?.addEventListener("click", () => {
    sessionStorage.setItem("hasEntered", "true");

    // ⭐ LOW VOLUME ADDED HERE
    if (audio) {
        audio.volume = 0.2; // 20% volume (adjust if you want softer)
        audio.play().catch(() => {});
    }

    startBtn.innerText = "Entering...";
    startBtn.disabled = true;

    setTimeout(() => {
        if (loader) loader.style.opacity = "0";

        setTimeout(() => {
            if (loader) loader.style.display = "none";
            if (content) content.style.display = "block";
        }, 350);

    }, 3500);
});

/* =========================================================
   MERCH SLIDER (CONSOLIDATED)
========================================================= */
const merchSlider = document.getElementById("merchSlider");
const dotContainer = document.getElementById("dotContainer");

if (merchSlider && dotContainer) {
    let paused = false;
    const itemWidth = merchSlider.children[0]?.offsetWidth + 15 || 0;
    const items = merchSlider.children.length;

    // Create dots
    dotContainer.innerHTML = "";
    for (let i = 0; i < items; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        dot.addEventListener("click", () => {
            merchSlider.scrollTo({ left: itemWidth * i, behavior: "smooth" });
            setActiveDot(i);
        });
        dotContainer.appendChild(dot);
    }

    // Pause on hover
    merchSlider.addEventListener("mouseenter", () => paused = true);
    merchSlider.addEventListener("mouseleave", () => paused = false);

    // Scroll events
    merchSlider.addEventListener("scroll", () => {
        const index = Math.round(merchSlider.scrollLeft / itemWidth);
        setActiveDot(index);
    });

    // Auto scroll
    function autoScroll() {
        if (!paused) {
            merchSlider.scrollLeft += 1;
            if (merchSlider.scrollLeft >= merchSlider.scrollWidth - merchSlider.clientWidth) {
                merchSlider.scrollTo({ left: 0, behavior: "auto" });
            }
        }
        requestAnimationFrame(autoScroll);
    }
    autoScroll();
}

function setActiveDot(index) {
    const dots = document.querySelectorAll("#dotContainer .dot");
    dots.forEach(d => d.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
}

/* =========================================================
   MEMBER SELECTION
========================================================= */
function selectGroup(el, groupName) {
    const member = el.closest('.member');
    document.querySelectorAll('.member').forEach(m => m.classList.remove('selected'));
    member?.classList.add('selected');
}

function selectGroup(el, groupName) {
    const member = el.closest('.member');

    // remove old selection
    document.querySelectorAll('.member').forEach(m => {
        m.classList.remove('selected');
    });

    // add selection
    member?.classList.add('selected');

    console.log("Selected group:", groupName);
}

function openYT(event, url) {
    event.stopPropagation(); // prevents triggering selectGroup
    window.open(url, "_blank");
}

function openInfo(event, url) {
    event.stopPropagation(); // prevents triggering selectGroup
    window.open(url, "_blank");
}

function fadeOutMusic() {
    if (!audio) return;

    let vol = audio.volume;

    clearInterval(fadeInterval);

    fadeInterval = setInterval(() => {
        if (vol > 0.02) {
            vol -= 0.02;
            audio.volume = vol;
        } else {
            audio.pause();
            audio.volume = 0.2; // reset for next visit
            clearInterval(fadeInterval);
        }
    }, 50);
}

// when user leaves page
window.addEventListener("beforeunload", fadeOutMusic);