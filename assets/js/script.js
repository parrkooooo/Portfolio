console.log(
    "%c %c SYED AHMER SHAH %c SYSTEM_INITIALIZED %c ",
    "background: #00ffff; padding:5px 0;",
    "background: #000; color: #00ffff; padding:5px 10px; font-weight: bold; border: 1px solid #00ffff;",
    "background: #00ffff; color: #000; padding:5px 10px; font-weight: bold;",
    "background: #00ffff; padding:5px 0;"
);

$(document).ready(function () {
    const $bar = $('#loading-bar');
    const $percentText = $('#load-percent');
    const $quote = $('#dynamic-quote');
    const $wrapper = $('#loader-wrapper');
    const $typeElement = $("#typewriter");
    const navBtn = $(".nav-link");
    const upBtn = $("#backToTop");
    const navbarCollapse = $(".navbar-collapse");
    const contactForm = document.getElementById('contact-form');
    const navHeight = 65;

    $('html, body').css({
        'overflow-x': 'hidden',
        'overflow-y': 'hidden',
        'scroll-behavior': 'smooth'
    });

    const phrases = ["SWE Student", "Full-Stack Web Developer", "SQL Developer", "WordPress Developer", "PHP Developer", "Laravel Developer", "SEO"];
    const quotes = [
        "Initializing the inevitable...",
        "Calculated risks. High rewards.",
        "Reality is a simulation. Master the code.",
        "The Titan awakens in the silence."
    ];

    $quote.text(quotes[Math.floor(Math.random() * quotes.length)]);
    
    setTimeout(() => { $bar.css('width', '25%'); $percentText.text('25%'); }, 1000);
    setTimeout(() => { $bar.css('width', '70%'); $percentText.text('70%'); }, 2500);
    setTimeout(() => { 
        $bar.css('width', '100%'); 
        $percentText.text('100%'); 
        setTimeout(() => {
            $wrapper.fadeOut(1000, function () { 
                $(this).remove(); 
                $('html, body').css({
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden'
                });
            });
        }, 800);
    }, 3500);

    let pIdx = 0, cIdx = 0, isDeleting = false;
    function type() {
        if (!$typeElement.length) return;
        const currentPhrase = phrases[pIdx];
        $typeElement.text(currentPhrase.substring(0, isDeleting ? cIdx - 1 : cIdx + 1));
        isDeleting ? cIdx-- : cIdx++;
        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && cIdx === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && cIdx === 0) {
            isDeleting = false;
            pIdx = (pIdx + 1) % phrases.length;
            typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    type();

    let sections = [];
    const updateSectionCache = () => {
        sections = navBtn.map(function () {
            const target = $(this).attr("href");
            if ($(target).length) return {
                el: $(this),
                top: $(target).offset().top - 100,
                bottom: $(target).offset().top + $(target).outerHeight() - 100
            };
        }).get();
    };

    updateSectionCache();
    $(window).on("resize", updateSectionCache);

    navBtn.on("click", function (e) {
        const section = $(this).attr("href");
        if ($(section).length) {
            e.preventDefault();
            $("html, body").stop().animate({ scrollTop: $(section).offset().top - navHeight }, 800, 'swing');
            if (navbarCollapse.hasClass("show")) navbarCollapse.collapse('hide');
        }
    });

    $(window).on("scroll", function () {
        const position = $(this).scrollTop();
        position > 300 ? upBtn.addClass("show") : upBtn.removeClass("show");
        
        for (let i = 0; i < sections.length; i++) {
            if (position >= sections[i].top && position < sections[i].bottom) {
                navBtn.removeClass("active").removeAttr("aria-current");
                sections[i].el.addClass("active").attr("aria-current", "page");
                break;
            }
        }
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => { entry.target.classList.add('reveal-visible'); }, 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('[class*="reveal-"]').forEach(el => revealObserver.observe(el));

    if (contactForm) {
        const submitBtn = document.getElementById('submit-btn');
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.innerHTML = "Transmitting...";
            try {
                const response = await fetch("https://formspree.io/f/xgooljlk", {
                    method: "POST",
                    body: new FormData(this),
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    $('#form-success').fadeIn();
                    this.reset();
                    $(this).fadeOut();
                }
            } catch (error) {
                alert("Transmission failed.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Send Message";
            }
        });
    }
});

const canvas = document.getElementById('cursor-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let mouse = { x: 0, y: 0 };
    let dots = [];
    const totalDots = 12;
    const friction = 0.4;
    let isVisible = false;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        for (let i = 0; i < totalDots; i++) dots.push({ x: 0, y: 0 });
        window.addEventListener('mousemove', (e) => { isVisible = true; mouse.x = e.clientX; mouse.y = e.clientY; });
        window.addEventListener('mouseout', () => { isVisible = false; });
        function animateCursor() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (isVisible) {
                let x = mouse.x;
                let y = mouse.y;
                dots.forEach((dot, index) => {
                    dot.x += (x - dot.x) * friction;
                    dot.y += (y - dot.y) * friction;
                    const color = index % 2 === 0 ? '#0ff0fc' : '#00ff41';
                    ctx.globalAlpha = 1 - (index / totalDots);
                    ctx.beginPath();
                    ctx.fillStyle = color;
                    const size = (totalDots - index) * 1.1;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = color;
                    ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
                    ctx.fill();
                    if (index > 0) {
                        ctx.beginPath();
                        ctx.strokeStyle = color;
                        ctx.lineWidth = 1.5;
                        ctx.moveTo(dots[index - 1].x, dots[index - 1].y);
                        ctx.lineTo(dot.x, dot.y);
                        ctx.stroke();
                    }
                    x = dot.x; y = dot.y;
                });
            }
            requestAnimationFrame(animateCursor);
        }
        window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        animateCursor();
    } else {
        canvas.style.display = 'none';
    }
}