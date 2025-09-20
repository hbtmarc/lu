// js/modules/timeline.js

import { CountUp } from 'https://cdn.jsdelivr.net/npm/countup.js@2.8.0/dist/countUp.min.js';

// Data de início do relacionamento L&H
const startDate = new Date('2019-05-25T00:00:00'); // Atualizado para 25 de Maio de 2019

/**
 * Calcula a duração do relacionamento em várias unidades.
 */
function calculateDuration() {
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    // Estimativa de batidas do coração (média de 70 bpm por pessoa)
    const minutes = Math.floor(diff / (1000 * 60));
    const heartbeats = minutes * 70 * 2; // 2 pessoas

    return { days, hours, heartbeats };
}

/**
 * Inicializa os contadores animados quando a secção se torna visível.
 */
export function initTimelineCounters() {
    const timelineSection = document.querySelector('.timeline-grid');
    if (!timelineSection) return;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const { days, hours, heartbeats } = calculateDuration();

                const options = {
                    duration: 4, // Duração da animação em segundos
                    separator: '.',
                    enableScrollSpy: true,
                    scrollSpyDelay: 100,
                };

                const daysCounter = new CountUp('days-counter', days, options);
                const hoursCounter = new CountUp('hours-counter', hours, options);
                const heartbeatsCounter = new CountUp('heartbeats-counter', heartbeats, options);

                if (!daysCounter.error) daysCounter.start(); else console.error(daysCounter.error);
                if (!hoursCounter.error) hoursCounter.start(); else console.error(hoursCounter.error);
                if (!heartbeatsCounter.error) heartbeatsCounter.start(); else console.error(heartbeatsCounter.error);

                // Desconecta o observer após a animação começar para não repetir
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); // Começa quando 50% da secção está visível

    observer.observe(timelineSection);
}