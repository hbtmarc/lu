// js/modules/animations.js

/**
 * Inicializa as animações de partículas de coração.
 * Cria duas instâncias: uma para o fundo e outra para o primeiro plano.
 */
export function initHeartAnimations() {
    // Configuração base para as partículas
    const baseConfig = {
        fullScreen: {
            enable: false, // As partículas estarão contidas nos seus elementos canvas
        },
        particles: {
            number: {
                value: 40, // Número de partículas
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            shape: {
                type: "emoji",
                options: {
                    emoji: {
                        value: ["❤️", "💖", "💕"]
                    }
                }
            },
            opacity: {
                value: { min: 0.3, max: 0.8 },
                animation: {
                    enable: true,
                    speed: 1,
                    minimumValue: 0.1,
                    sync: false
                }
            },
            size: {
                value: { min: 8, max: 20 },
                animation: {
                    enable: true,
                    speed: 4,
                    minimumValue: 5,
                    sync: false
                }
            },
            move: {
                enable: true,
                speed: 2,
                direction: "bottom",
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse"
                },
                resize: true
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4
                }
            }
        },
        detectRetina: true
    };

    // Carrega a instância de fundo
    tsParticles.load("particles-background", {
       ...baseConfig,
        particles: {
           ...baseConfig.particles,
            number: { value: 60 }, // Mais partículas no fundo
            move: {...baseConfig.particles.move, speed: 1.5 } // Mais lentas
        }
    });

    // Carrega a instância de primeiro plano
    tsParticles.load("particles-foreground", {
       ...baseConfig,
        particles: {
           ...baseConfig.particles,
            number: { value: 20 }, // Menos partículas à frente
            size: { value: { min: 12, max: 25 } }, // Ligeiramente maiores
            move: {...baseConfig.particles.move, speed: 2.5 } // Mais rápidas
        }
    });
}