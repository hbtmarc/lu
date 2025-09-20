document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const beginButton = document.getElementById('begin-button');
    const mainContent = document.getElementById('main-content');
    const heartsContainer = document.querySelector('.hearts-container');

    // --- LÓGICA DA TELA INICIAL ---
    beginButton.addEventListener('click', () => {
        // Inicia a reprodução do Spotify (a função está em spotify.js)
        if (typeof playSpotifyTrack === 'function') {
            playSpotifyTrack();
        }

        // Esmaece a tela inicial
        splashScreen.style.opacity = '0';
        splashScreen.style.pointerEvents = 'none';

        // Mostra o conteúdo principal após a transição
        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.style.display = 'block';
        }, 800); // Deve corresponder à duração da transição no CSS
    });

    // --- ANIMAÇÃO DE CORAÇÕES ---
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';

        // Variações para criar profundidade
        const size = Math.random() * 2 + 1; // 1rem a 3rem
        const duration = Math.random() * 5 + 5; // 5s a 10s
        const delay = Math.random() * 5; // 0s a 5s
        const position = Math.random() * 100; // 0% a 100%
        const zIndex = Math.random() > 0.5? 1 : -2; // Alguns na frente, outros atrás

        heart.style.fontSize = `${size}rem`;
        heart.style.left = `${position}vw`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${delay}s`;
        heart.style.zIndex = zIndex;
        
        // Opacidade menor para corações de fundo
        if (zIndex === -2) {
            heart.style.opacity = '0.5';
        }

        heartsContainer.appendChild(heart);

        // Remove o coração do DOM após a animação para não sobrecarregar
        setTimeout(() => {
            heart.remove();
        }, (duration + delay) * 1000);
    }

    // Cria um novo coração a cada 300ms
    setInterval(createHeart, 300);

    // --- ANIMAÇÕES DE SCROLL (INTERSECTION OBSERVER) ---
    const sections = document.querySelectorAll('.content-section');
    const observerOptions = {
        root: null, // Observa em relação ao viewport
        rootMargin: '0px',
        threshold: 0.15 // Ativa quando 15% da seção estiver visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
    
    // --- ANIMAÇÃO DE CONTAGEM DE NÚMEROS (OTIMIZADA) ---
    const animateNumbers = () => {
        const numberElements = document.querySelectorAll('.animate-number');
        numberElements.forEach(el => {
            const target = +el.getAttribute('data-target');
            const duration = 2000; // 2 segundos
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
        });
    };
    
    // Observador para iniciar a contagem dos números apenas quando visível
    const timelineSection = document.getElementById('timeline');
    let numbersAnimated = false;
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting &&!numbersAnimated) {
                animateNumbers();
                numbersAnimated = true;
                numberObserver.unobserve(timelineSection);
            }
        });
    }, { threshold: 0.5 });
    
    if (timelineSection) {
        numberObserver.observe(timelineSection);
    }

    // --- LÓGICA DA GALERIA DE FOTOS ---
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');
    let currentIndex = 0;
    let autoPlayInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
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
        autoPlayInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    if (slides.length > 0) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        showSlide(currentIndex);
        startAutoPlay();
    }
});