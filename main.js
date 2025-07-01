document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    if (burger && navLinks) {
        burger.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            burger.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Event Slider
    const eventSlides = document.querySelectorAll('.event-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(n) {
        eventSlides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + eventSlides.length) % eventSlides.length;
        eventSlides[currentSlide].classList.add('active');
    }

    if (prevBtn && nextBtn && eventSlides.length > 0) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });

        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });

        setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;

    function showTestimonial(n) {
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        currentTestimonial = (n + testimonials.length) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
        dots[currentTestimonial].classList.add('active');
    }

    if (dots.length > 0 && testimonials.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
            });
        });

        setInterval(() => {
            showTestimonial(currentTestimonial + 1);
        }, 7000);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 90,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation on scroll
    const animateElements = document.querySelectorAll('.flip-in, .zoom-in');

    function checkScroll() {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementPosition < windowHeight - 100) {
                element.style.animationPlayState = 'running';
            }
        });
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll();

    // Tab functionality
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(tabId)?.classList.add('active');
        });
    });

    // Calendar Functionality
    const calendarGrid = document.getElementById('calendar');
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function generateCalendar(month, year) {
        if (!calendarGrid || !currentMonthEl) return;

        calendarGrid.innerHTML = '';

        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        currentMonthEl.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day;

            if ((month === 7 && [15, 28].includes(day)) || (month === 8 && day === 10)) {
                const indicator = document.createElement('div');
                indicator.className = 'event-indicator';
                dayCell.appendChild(indicator);
            }

            calendarGrid.appendChild(dayCell);
        }
    }

    if (calendarGrid && prevMonthBtn && nextMonthBtn) {
        generateCalendar(currentMonth, currentYear);

        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar(currentMonth, currentYear);
        });

        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar(currentMonth, currentYear);
        });
    }

    // Link ke Google Maps (jika ada)
    const locationLinks = document.querySelectorAll('.location-link a');
    locationLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href) window.open(href, '_blank');
        });
    });

    // FAQ Toggle
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                icon?.classList.replace('fa-chevron-up', 'fa-chevron-down');
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon?.classList.replace('fa-chevron-down', 'fa-chevron-up');
            }
        });
    });

    // Form Validation
    const form = document.getElementById('registrationForm');
    const checkbox = document.getElementById('persetujuan');

    if (form && checkbox) {
        form.addEventListener('submit', function (e) {
            if (!checkbox.checked) {
                e.preventDefault();
                alert('Anda harus menyetujui syarat dan ketentuan');
                checkbox.focus();
            }
        });
    }

    // Kembali ke halaman utama
    window.kembaliKeHalamanAwal = function () {
        window.location.href = 'index.html';
    };
});
