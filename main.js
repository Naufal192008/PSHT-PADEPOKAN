document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    burger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        burger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            burger.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
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
    
    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });
    
    // Auto slide change
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
    
    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;
    
    function showTestimonial(n) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        currentTestimonial = (n + testimonials.length) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
        dots[currentTestimonial].classList.add('active');
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });
    
    // Auto testimonial change
    setInterval(() => {
        showTestimonial(currentTestimonial + 1);
    }, 7000);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    checkScroll(); // Run once on page load
});

        // Tab functionality
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Simple calendar functionality
        function generateCalendar(month, year) {
            const calendarGrid = document.getElementById('calendar');
            calendarGrid.innerHTML = '';
            
            const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
            
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // Add empty cells for days before the first day of the month
            for (let i = 0; i < firstDay; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'calendar-day empty';
                calendarGrid.appendChild(emptyCell);
            }
            
            // Add cells for each day of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-day';
                dayCell.textContent = day;
                
                // Add event indicator for certain days (example)
                if ((month === 7 && day === 15) || (month === 7 && day === 28) || (month === 8 && day === 10)) {
                    const eventIndicator = document.createElement('div');
                    eventIndicator.className = 'event-indicator';
                    dayCell.appendChild(eventIndicator);
                }
                
                calendarGrid.appendChild(dayCell);
            }
        }
        
        // Initialize calendar with current month
        const currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        
        generateCalendar(currentMonth, currentYear);
        
        // Month navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar(currentMonth, currentYear);
        });
        
        document.getElementById('next-month').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar(currentMonth, currentYear);
        });
    
        // Fungsi untuk mengarahkan ke Google Maps saat lokasi diklik
document.addEventListener('DOMContentLoaded', function() {
    // Temukan semua link lokasi
    const locationLinks = document.querySelectorAll('.location-link a');
    
    // Tambahkan event listener untuk setiap link
    locationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const location = this.getAttribute('href');
            window.open(location, '_blank');
        });
    });
    
    // Fungsi untuk navigasi kalender (jika diperlukan)
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthEl = document.getElementById('current-month');
    
    // Contoh implementasi sederhana navigasi bulan
    let currentMonth = 6; // Juni
    let currentYear = 2025;
    
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 1) {
            currentMonth = 12;
            currentYear--;
        }
        updateCalendar();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }
        updateCalendar();
    });
    
    function updateCalendar() {
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", 
                           "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        currentMonthEl.textContent = `${monthNames[currentMonth-1]} ${currentYear}`;
        
        // Di sini Anda bisa menambahkan logika untuk mengupdate tampilan kalender
        // sesuai dengan bulan dan tahun yang dipilih
    }
});