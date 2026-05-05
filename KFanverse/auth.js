
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

    heroInterval = setInterval(() => {
        moveHeroToSlide(heroIndex + 1);
    }, 4000);
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
   AUTH SYSTEM (CLEAN FIXED VERSION)
========================================================= */

function updateAuthState() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const authButtons = document.querySelector(".auth-buttons");
    const userIcon = document.getElementById("userIcon");

    if (!authButtons || !userIcon) return;

    authButtons.style.display = isLoggedIn ? "none" : "flex";
    userIcon.style.display = isLoggedIn ? "block" : "none";
}

function login() {
    const usernameInput = document.querySelector("#loginForm input[type='text']");
    const username = usernameInput ? usernameInput.value : "ONCE_USER";

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", username);

    updateAuthState();
    closeLogin();
}

function signup() {
    const usernameInput = document.querySelector("#signupForm input[type='text']");
    const username = usernameInput ? usernameInput.value : "ONCE_USER";

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", username);

    updateAuthState();
    closeLogin();
}


/* =========================================================
   LOGIN MODAL
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

function showLogin() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signupForm").style.display = "none";
}

function showSignup() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
}


/* =========================================================
   FORM EVENTS (IMPORTANT FIX)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    updateAuthState();

    const lForm = document.getElementById("loginForm");
    const sForm = document.getElementById("signupForm");

    if (lForm) {
        lForm.addEventListener("submit", (e) => {
            e.preventDefault();
            login();
        });
    }

    if (sForm) {
        sForm.addEventListener("submit", (e) => {
            e.preventDefault();
            signup();
        });
    }
});


/* =========================================================
   LOGOUT
========================================================= */

function logoutUser() {
    localStorage.removeItem("isLoggedIn");
    updateAuthState();
    window.location.href = "index.html";
}


/* =========================================================
   SEARCH
========================================================= */

function handleSearch() {
    let query = prompt("Search KFanverse navigation:");
    if (!query) return;

    query = query.toLowerCase();

    if (query.includes("home")) window.location.href = "index.html";
    else if (query.includes("update")) window.location.href = "updates.html";
    else if (query.includes("quiz")) window.location.href = "quiz.html";
    else if (query.includes("discussion")) window.location.href = "discussions.html";
    else if (query.includes("merch")) window.location.href = "merch.html";
    else if (query.includes("about")) window.location.href = "about us.html";
    else alert("No results found 😢");
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

    audio?.play().catch(() => {});

    startBtn.innerText = "Entering...";
    startBtn.disabled = true;

    setTimeout(() => {
        if (loader) loader.style.opacity = "0";

        setTimeout(() => {
            if (loader) loader.style.display = "none";
            if (content) content.style.display = "block";
        }, 350);
    }, 1500);
});


/* =========================================================
   DISCUSSIONS (SAFE VERSION)
========================================================= */

let discussions = JSON.parse(localStorage.getItem("discussions")) || [];

function formatTime(timestamp) {
    const diff = Date.now() - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

function renderHomeDiscussions() {
    const container = document.getElementById("homeDiscussionList");
    if (!container) return;

    container.innerHTML = "";

    const topPosts = discussions.slice(0, 3);
    const fallback = "pics/DahyunUser.jfif";

    topPosts.forEach(post => {
        const div = document.createElement("div");
        div.className = "discussion-item";

        div.innerHTML = `
            <div class="disc-icon">
                <img src="${post.image || fallback}" onerror="this.src='${fallback}'">
            </div>
            <div class="disc-info">
                <h4>${post.title}</h4>
                <p>By ${post.author} • ${post.replies?.length || 0} replies • ${formatTime(post.time)}</p>
            </div>
        `;

        div.onclick = () => {
            localStorage.setItem("selectedPostId", post.id);
            window.location.href = "discussions.html";
        };

        container.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", renderHomeDiscussions);


/* =========================================================
   MERCH AUTO SCROLL (SIMPLE FIXED)
========================================================= */

const merchSlider = document.getElementById("merchSlider");

if (merchSlider) {
    let paused = false;

    merchSlider.addEventListener("mouseenter", () => paused = true);
    merchSlider.addEventListener("mouseleave", () => paused = false);

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


function updateAuthState() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const authButtons = document.querySelector(".auth-buttons");
    const userIconWrapper = document.getElementById("userIcon");
    const userIconImg = document.querySelector("#userIcon img");

    const savedPic = localStorage.getItem("userAvatar") || "pics/MomoUser.jfif";

    if (isLoggedIn === "true") {
        if (authButtons) authButtons.style.display = "none";
        if (userIconWrapper) userIconWrapper.style.display = "block";

        // 🔥 FORCE IMAGE ALWAYS (fix refresh bug)
        if (userIconImg) {
            userIconImg.src = savedPic + "?v=" + Date.now(); 
            // cache-buster so browser doesn't reuse old broken image
        }

    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (userIconWrapper) userIconWrapper.style.display = "none";
    }
}

function showLogin(el = document.querySelector(".auth-tab")) {
    // switch tab highlight
    document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
    el.classList.add("active");

    // show login / hide signup
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signupForm").style.display = "none";
}

function showSignup(el = document.querySelectorAll(".auth-tab")[1]) {
    // switch tab highlight
    document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
    el.classList.add("active");

    // show signup / hide login
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.querySelector("#loginForm input[type='text']").value.trim();
    const password = document.querySelector("#loginForm input[type='password']").value.trim();

    // ADMIN
    if (email === "admin123@gmail.com" && password === "admin123") {
        localStorage.setItem("role", "admin");
        window.location.href = "admin.html";
        return;
    }

    // SUPER ADMIN
    if (email === "sadmin123@gmail.com" && password === "sadmin123") {
        localStorage.setItem("role", "superadmin");
        window.location.href = "sadmin.html";
        return;
    }

    // NORMAL USER
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", email);

    updateAuthState();
    closeLogin();
});