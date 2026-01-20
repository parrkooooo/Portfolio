console.log("%cBUILD MODE ▸ ACTIVE", "color:#00ffd5; font-weight: bold;");

$(document).ready(function () {
    const navBtn = $(".nav-link");
    const upBtn = $("#backToTop");
    const navbarCollapse = $(".navbar-collapse");
    const navHeight = 65;

    let sections = [];
    const updateSectionCache = () => {
        sections = navBtn.map(function() {
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
            $("html, body").stop().animate({ 
                scrollTop: $(section).offset().top - navHeight 
            }, 600);
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
});

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const successModalEl = document.getElementById('successModal');
    const successModal = successModalEl ? new bootstrap.Modal(successModalEl) : null;
    const successDiv = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    contactForm.addEventListener('submit', async function (e) {
        if (!this.checkValidity()) return;

        e.preventDefault();
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> Transmitting...`;

        try {
            const response = await fetch("https://formspree.io/f/xgooljlk", {
                method: "POST",
                body: new FormData(this),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                if (successModal) successModal.show();
                if (successDiv) {
                    successDiv.style.display = 'block';
                    successDiv.setAttribute('aria-hidden', 'false');
                    successDiv.focus();
                }
                this.reset();
                this.style.display = 'none';
            } else {
                const data = await response.json();
                throw new Error(data.errors ? data.errors.map(err => err.message).join(", ") : "Submission failed.");
            }
        } catch (error) {
            alert(error.message || "Error: Could not connect to the server.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    if (successModalEl) {
        successModalEl.addEventListener('hidden.bs.modal', () => {
            if (successDiv) successDiv.focus();
        });
    }
}