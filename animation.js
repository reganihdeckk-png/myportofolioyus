const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (
    !prefersReducedMotion.matches &&
    "IntersectionObserver" in window &&
    "requestAnimationFrame" in window
) {
    const revealElements = document.querySelectorAll(
        "#about, #skill, #project, #contact, footer, section li"
    );
    const sections = document.querySelectorAll("#hero, #about, #skill, #project, #contact");
    const navigationLinks = document.querySelectorAll('nav a[href^="#"]');
    const header = document.querySelector("header");

    document.documentElement.classList.add("js-animations");

    revealElements.forEach((element) => {
        element.classList.add("js-reveal");
    });

    document.querySelectorAll("section li").forEach((item, index) => {
        item.style.setProperty("--reveal-delay", `${(index % 4) * 90}ms`);
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px",
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    header.append(progressBar);

    const backToTop = document.createElement("button");
    backToTop.className = "back-to-top";
    backToTop.type = "button";
    backToTop.setAttribute("aria-label", "Kembali ke atas");
    backToTop.innerHTML = '<span aria-hidden="true">&uarr;</span>';
    document.body.append(backToTop);

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    let scrollUpdateScheduled = false;

    const updateScrollEffects = () => {
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress =
            scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

        progressBar.style.transform = `scaleX(${scrollProgress})`;
        backToTop.classList.toggle("is-visible", window.scrollY > 400);
        scrollUpdateScheduled = false;
    };

    window.addEventListener(
        "scroll",
        () => {
            if (!scrollUpdateScheduled) {
                scrollUpdateScheduled = true;
                window.requestAnimationFrame(updateScrollEffects);
            }
        },
        { passive: true }
    );
    updateScrollEffects();

    const navigationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    navigationLinks.forEach((link) => {
                        const isCurrent = link.hash === `#${entry.target.id}`;

                        link.classList.toggle("is-active", isCurrent);
                        if (isCurrent) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                }
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0,
        }
    );

    sections.forEach((section) => {
        navigationObserver.observe(section);
    });

    const hero = document.querySelector("#hero");
    const projectCards = document.querySelectorAll("#project li");
    const supportsPointerEffects = window.matchMedia("(pointer: fine)").matches;

    if (hero) {
        hero.classList.add("has-spotlight");
    }

    if (supportsPointerEffects && hero) {
        let pointerUpdateScheduled = false;
        let pointerX = 0;
        let pointerY = 0;

        hero.addEventListener("pointermove", (event) => {
            pointerX = event.clientX;
            pointerY = event.clientY;

            if (!pointerUpdateScheduled) {
                pointerUpdateScheduled = true;
                window.requestAnimationFrame(() => {
                    const bounds = hero.getBoundingClientRect();
                    hero.style.setProperty("--pointer-x", `${pointerX - bounds.left}px`);
                    hero.style.setProperty("--pointer-y", `${pointerY - bounds.top}px`);
                    pointerUpdateScheduled = false;
                });
            }
        });

        hero.addEventListener("pointerleave", () => {
            hero.style.removeProperty("--pointer-x");
            hero.style.removeProperty("--pointer-y");
        });
    }

    if (supportsPointerEffects) {
        projectCards.forEach((card) => {
            card.classList.add("has-tilt");

            card.addEventListener("pointermove", (event) => {
                const bounds = card.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width;
                const y = (event.clientY - bounds.top) / bounds.height;

                card.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
                card.style.setProperty("--tilt-y", `${(x - 0.5) * 5}deg`);
            });

            card.addEventListener("pointerleave", () => {
                card.style.removeProperty("--tilt-x");
                card.style.removeProperty("--tilt-y");
            });
        });
    }
}