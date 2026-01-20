class EfectosEspeciales {
    constructor() {
        this.efectosActivados = false;
        this.init();
    }
    
    init() {
        // Esperar a que todo esté cargado
        setTimeout(() => {
            this.setupEfectos();
            this.efectosActivados = true;
        }, 2000);
    }
    
    setupEfectos() {
        // Efecto de entrada para elementos
        this.animateEntrance();
        
        // Efectos en hover de botones
        this.setupButtonEffects();
        
        // Añadir estilo para badges especiales
        this.addSpecialBadgeStyle();
    }
    
    animateEntrance() {
        const elements = document.querySelectorAll('.heart-section, .interaction-section');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 300 + (index * 200));
        });
    }
    
    setupButtonEffects() {
        const buttons = document.querySelectorAll('.heart-control-btn, .save-memory-btn, .secret-btn');
        
        buttons.forEach(button => {
            // Efecto de ripple
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Agregar estilo para ripple
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                .heart-control-btn,
                .save-memory-btn,
                .secret-btn {
                    position: relative;
                    overflow: hidden;
                }
                
                .special-badge {
                    background: linear-gradient(45deg, #ffd700, #ffed4e);
                    color: #333;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 0.7rem;
                    font-weight: bold;
                    margin-left: 5px;
                    animation: badgeGlow 2s infinite;
                }
                
                @keyframes badgeGlow {
                    0%, 100% {
                        box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
                    }
                    50% {
                        box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
                    }
                }
                
                .special-memory {
                    border-left: 4px solid #ffd700;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    addSpecialBadgeStyle() {
        // El estilo ya se agregó en setupButtonEffects
    }
    
    crearConfetti() {
        const colors = ['#ff3366', '#ff6699', '#ff99cc', '#ffffff'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: -20px;
                    left: ${Math.random() * 100}vw;
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                    opacity: 0.8;
                    z-index: 1000;
                    pointer-events: none;
                `;
                
                document.body.appendChild(confetti);
                
                // Animación
                const animation = confetti.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                    { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                ], {
                    duration: Math.random() * 2000 + 1000,
                    easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
                });
                
                animation.onfinish = () => confetti.remove();
            }, i * 30);
        }
    }
}

// Inicializar efectos especiales
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        try {
            window.efectosEspeciales = new EfectosEspeciales();
        } catch (error) {
            console.error("Error inicializando efectos:", error);
        }
    }, 1000);
});