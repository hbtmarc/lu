document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const beginButton = document.getElementById('begin-button');
    const mainContent = document.getElementById('main-content');
    const heartsContainer = document.querySelector('.hearts-container');

    // --- LÓGICA DA TELA INICIAL ---
    beginButton.addEventListener('click', () => {
        if (typeof playSpotifyTrack === 'function') {
            playSpotifyTrack();
        }
        splashScreen.style.opacity = '0';
        splashScreen.style.pointerEvents = 'none';
        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.style.display = 'block';
        }, 800);
    });

    // --- ANIMAÇÃO DE CORAÇÕES ---
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        const size = Math.random() * 2 + 1;
        const duration = Math.random() * 5 + 7;
        const delay = Math.random() * 5;
        const position = Math.random() * 100;
        heart.style.fontSize = `${size}rem`;
        heart.style.left = `${position}vw`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${delay}s`;
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), (duration + delay) * 1000);
    }
    setInterval(createHeart, 300);

    // --- ANIMAÇÕES DE SCROLL (INTERSECTION OBSERVER) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Adiciona um atraso escalonado para um efeito mais dinâmico
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));
    
    // --- ANIMAÇÃO DE CONTAGEM DE NÚMEROS (CORRIGIDA E OTIMIZADA) ---
    const animateNumbers = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 2500; // 2.5 segundos para uma animação mais suave
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentNumber = Math.floor(progress * target);
            el.innerText = currentNumber.toLocaleString('pt-BR');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    const numberElements = document.querySelectorAll('.animate-number');
    const numberObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers(entry.target);
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, { threshold: 0.5 });
    numberElements.forEach(el => numberObserver.observe(el));

    // --- LÓGICA DA GALERIA DE FOTOS ---
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');
    let currentIndex = 0;
    let autoPlayInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    }
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    if (slides.length > 0) {
        prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
        nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
        showSlide(currentIndex);
        startAutoPlay();
    }
});