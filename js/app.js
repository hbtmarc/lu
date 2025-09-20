document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const heartsContainer = document.querySelector('.hearts-container');
    const backgroundMusic = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const volumeSlider = document.getElementById('volume-slider');

    // --- LÓGICA DE MÚSICA ---
    function setupMusicPlayer() {
        backgroundMusic.volume = 0.03;
        volumeSlider.value = 0.03;
        playPauseBtn.classList.add('paused');

        const playPromise = backgroundMusic.play();
        if (playPromise!== undefined) {
            playPromise.catch(error => {
                console.warn("Autoplay bloqueado. A aguardar interação do utilizador.");
                document.body.addEventListener('click', () => backgroundMusic.play(), { once: true });
            });
        }

        playPauseBtn.addEventListener('click', () => {
            backgroundMusic.paused? backgroundMusic.play() : backgroundMusic.pause();
        });

        volumeSlider.addEventListener('input', (e) => {
            backgroundMusic.volume = e.target.value;
        });

        backgroundMusic.addEventListener('play', () => {
            playPauseBtn.classList.remove('paused');
            playPauseBtn.classList.add('playing');
        });

        backgroundMusic.addEventListener('pause', () => {
            playPauseBtn.classList.remove('playing');
            playPauseBtn.classList.add('paused');
        });
    }

    // --- ANIMAÇÃO DE CORAÇÕES ---
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        const size = Math.random() * 1.5 + 1;
        const duration = Math.random() * 5 + 8;
        const delay = Math.random() * 5;
        const position = Math.random() * 100;
        heart.style.fontSize = `${size}rem`;
        heart.style.left = `${position}vw`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${delay}s`;
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), (duration + delay) * 1000);
    }
    setInterval(createHeart, 400);

    // --- ANIMAÇÕES DE SCROLL ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));
    
    // --- ANIMAÇÃO DE CONTAGEM DE NÚMEROS ---
    const animateNumbers = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 2000;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            el.innerText = Math.floor(progress * target).toLocaleString('pt-BR');
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
                observer.unobserve(entry.target);
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

    // --- INICIALIZAÇÃO GERAL ---
    setupMusicPlayer();
});