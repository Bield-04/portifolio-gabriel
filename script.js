const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");
const navAnchors = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const revealElements = document.querySelectorAll(".reveal");
const typingText = document.querySelector("#typing-text");
const currentYear = document.querySelector("#current-year");

function closeMenu() {
    menuButton.classList.remove("active");
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
}

function openMenu() {
    menuButton.classList.add("active");
    navLinks.classList.add("open");
    document.body.classList.add("menu-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Fechar menu");
}

menuButton.addEventListener("click", () => {
    navLinks.classList.contains("open") ? closeMenu() : openMenu();
});

navAnchors.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
    if (window.innerWidth > 700) {
        closeMenu();
    }
});

const phrases = [
    "estudante de programação",
    "futuro desenvolvedor .NET",
    "aprendendo React",
    "usuário de Linux"
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let phraseIndex = 0;
let characterIndex = 0;
let deleting = false;

function typePhrase() {
    if (!typingText || reduceMotion) {
        return;
    }

    const currentPhrase = phrases[phraseIndex];

    if (!deleting) {
        characterIndex++;
        typingText.textContent = currentPhrase.slice(0, characterIndex);

        if (characterIndex === currentPhrase.length) {
            deleting = true;
            setTimeout(typePhrase, 1300);
            return;
        }
    } else {
        characterIndex--;
        typingText.textContent = currentPhrase.slice(0, characterIndex);

        if (characterIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
    }

    setTimeout(typePhrase, deleting ? 45 : 75);
}

if (reduceMotion && typingText) {
    typingText.textContent = phrases[0];
} else {
    typePhrase();
}

if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.12 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("visible"));
}

function updateActiveNavigation() {
    const scrollPosition = window.scrollY + 150;
    let currentSectionId = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSectionId = section.id;
        }
    });

    navAnchors.forEach((link) => {
        const targetId = link.getAttribute("href").replace("#", "");
        link.classList.toggle("active", targetId === currentSectionId);
    });
}

window.addEventListener("scroll", updateActiveNavigation, { passive: true });
updateActiveNavigation();

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}
