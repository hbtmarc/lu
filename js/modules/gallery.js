// js/modules/gallery.js

/**
 * Inicializa a galeria de fotos interativa usando SwiperJS.
 */
export function initGallery() {
    const swiper = new Swiper('.swiper', {
        // Ativa o loop infinito
        loop: true,
        
        // Efeito de transição suave
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },

        // Reprodução automática
        autoplay: {
            delay: 4000, // 4 segundos por foto
            disableOnInteraction: false, // Continua após interação do utilizador
        },

        // Paginação (os pontos na parte inferior)
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        // Botões de navegação (as setas)
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}