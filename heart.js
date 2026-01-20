// CORAZÓN DIGITAL - Versión Completa
class CorazonDigital {
    constructor() {
        this.config = {
            herName: "Annie",
            yourName: "Andres",
            secretMessage: "Este corazón fue programado para latir solo cuando piensa en ti, cada línea de código late al ritmo de lo que siento por ti",
            binaryMessage: "01000011 01100001 01100100 01100001 00100000 01101100 01100001 01110100 01101001 01100100 01101111 00100000 01100101 01110011 00100000 01110000 01101111 01110010 00100000 01110100 01101001"
        };
        
        this.state = {
            love: 0,
            heartbeat: 72,
            memories: [],
            isBeating: false,
            beatCount: 0,
            lastTouch: null,
            heartScale: 1,
            canvasSize: { width: 0, height: 0 }
        };
        
        this.init();
    }
    
    init() {
        // Personalizar nombres en la UI
        document.querySelector('.her-name').textContent = this.config.herName;
        document.getElementById('signatureName').textContent = this.config.yourName;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.loadMemories();
        this.updateUI();
        this.startHeartbeat();
        
        // Mostrar mensaje de bienvenida
        this.showMessage(`Bienvenida, ${this.config.herName}. Este corazón late solo por ti.`, 'heart');
        
        // Redimensionar canvas al cargar
        setTimeout(() => this.resizeCanvas(), 100);
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('heartCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Ajustar tamaño del canvas responsivamente
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.resizeCanvas();
        
        // Redimensionar al cambiar tamaño de ventana
        window.addEventListener('resize', () => {
            setTimeout(() => this.resizeCanvas(), 100);
        });
        
        // Dibujar el corazón inicial
        this.drawHeart();
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const size = Math.min(container.clientWidth, container.clientHeight);
        
        // Asegurar tamaño mínimo y máximo
        const minSize = 200;
        const maxSize = 500;
        const finalSize = Math.max(minSize, Math.min(size, maxSize));
        
        this.canvas.width = finalSize;
        this.canvas.height = finalSize;
        this.state.canvasSize = { width: finalSize, height: finalSize };
        
        // Ajustar escala según tamaño
        this.state.heartScale = finalSize / 500;
        
        // Redibujar el corazón
        this.drawHeart();
    }
    
    drawHeart(beatScale = 1, color = '#ff3366') {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calcular tamaño proporcional
        const baseSize = Math.min(width, height) * 0.4;
        const heartSize = baseSize * this.state.heartScale * beatScale;
        
        // Limpiar canvas con fondo transparente
        ctx.clearRect(0, 0, width, height);
        
        // Crear gradiente radial para el corazón
        const gradient = ctx.createRadialGradient(
            centerX, centerY, heartSize * 0.3,
            centerX, centerY, heartSize * 1.2
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.7, this.lightenColor(color, 20));
        gradient.addColorStop(1, this.lightenColor(color, 40));
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // Dibujar corazón con forma perfecta
        this.drawHeartShape(ctx, heartSize, gradient);
        
        // Restaurar contexto
        ctx.restore();
        
        // Si está latiendo, añadir efecto de pulso
        if (this.state.isBeating) {
            this.drawPulseEffect();
        }
    }
    
    drawHeartShape(ctx, size, gradient) {
        // Usar una fórmula matemática para un corazón perfecto
        const tStep = 0.02;
        const scale = size / 15;
        
        ctx.beginPath();
        
        for (let t = 0; t <= 2 * Math.PI; t += tStep) {
            // Fórmula paramétrica del corazón
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
            
            const scaledX = -x * scale; // Negativo para voltear horizontalmente
            const scaledY = -y * scale; // Negativo para voltear verticalmente
            
            if (t === 0) {
                ctx.moveTo(scaledX, scaledY);
            } else {
                ctx.lineTo(scaledX, scaledY);
            }
        }
        
        ctx.closePath();
        
        // Relleno con gradiente
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Borde brillante
        ctx.lineWidth = Math.max(2, 4 * this.state.heartScale);
        ctx.strokeStyle = this.lightenColor('#ff3366', 60);
        ctx.stroke();
        
        // Efecto de brillo interno
        const innerGradient = ctx.createRadialGradient(
            0, -size * 0.1, 0,
            0, -size * 0.1, size * 0.3
        );
        innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        innerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(-size * 0.15, -size * 0.25, size * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = innerGradient;
        ctx.fill();
        
        // Sombra
        ctx.shadowColor = '#ff3366';
        ctx.shadowBlur = 30 * this.state.heartScale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
    
    drawPulseEffect() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Anillo de pulso
        const pulseSize = (this.state.beatCount % 100) * this.state.heartScale + 50;
        const opacity = 0.5 - (this.state.beatCount % 100) / 200;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 51, 102, ${opacity})`;
        ctx.lineWidth = 3 * this.state.heartScale;
        ctx.stroke();
    }
    
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        
        return `#${(
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1)}`;
    }
    
    setupEventListeners() {
        // Click en el corazón
        this.canvas.addEventListener('click', (e) => {
            this.beatHeart('click');
            this.createClickParticles(e.clientX, e.clientY);
        });
        
        // Touch en móviles
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.beatHeart('touch');
            this.createClickParticles(touch.clientX, touch.clientY);
        }, { passive: false });
        
        // Botones de toque
        document.getElementById('touchGentle').addEventListener('click', () => {
            this.gentleTouch();
        });
        
        document.getElementById('touchStrong').addEventListener('click', () => {
            this.strongTouch();
        });
        
        document.getElementById('touchRhythm').addEventListener('click', () => {
            this.rhythmTouch();
        });
        
        // Guardar memoria
        document.getElementById('saveMemory').addEventListener('click', () => {
            this.saveMemory();
        });
        
        // Enter para guardar memoria
        document.getElementById('memoryInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.saveMemory();
            }
        });
        
        // Revelar secreto
        document.getElementById('revealSecret').addEventListener('click', () => {
            this.revealSecret();
        });
        
        // Crear recuerdo especial desde modal
        document.getElementById('createSpecialMemory').addEventListener('click', () => {
            this.createSpecialMemory();
        });
        
        // Cerrar modal
        document.querySelector('.close-modal-btn').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Click fuera del modal para cerrar
        document.getElementById('secretModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('secretModal')) {
                this.closeModal();
            }
        });
    }
    
    beatHeart(type = 'normal') {
        this.state.isBeating = true;
        this.state.beatCount++;
        this.state.lastTouch = Date.now();
        
        // Aumentar latido según el tipo
        let loveIncrease = 0;
        let heartbeatIncrease = 0;
        
        switch(type) {
            case 'gentle':
            case 'touch':
                heartbeatIncrease = 5;
                loveIncrease = 2;
                break;
            case 'strong':
                heartbeatIncrease = 15;
                loveIncrease = 5;
                this.createExplosionParticles();
                break;
            case 'rhythm':
                heartbeatIncrease = 10;
                loveIncrease = 3;
                this.startRhythm();
                break;
            default:
                heartbeatIncrease = 8;
                loveIncrease = 1;
        }
        
        this.state.heartbeat += heartbeatIncrease;
        this.state.love += loveIncrease;
        
        // Limitar valores
        this.state.heartbeat = Math.min(this.state.heartbeat, 200);
        this.state.love = Math.min(this.state.love, 100);
        
        // Efecto visual del latido
        this.animateBeat();
        this.updateUI();
        
        // Mostrar mensaje
        const messages = [
            "¡El corazón late por ti! 💓",
            "Otro latido para ti",
            "Sigue haciendo latir mi corazón",
            "Cada latido es un pensamiento en ti",
            `${this.config.herName}, haces latir este corazón`
        ];
        this.showMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
    
    gentleTouch() {
        this.beatHeart('gentle');
        this.showMessage("Un toque suave para el corazón 💖", 'heart');
        
        // Efecto visual suave
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const scale = 1 + Math.sin(Date.now() / 300) * 0.03;
                this.drawHeart(scale, '#ff99cc');
            }, i * 100);
        }
    }
    
    strongTouch() {
        this.beatHeart('strong');
        this.showMessage("¡Latido fuerte! 💥", 'heart');
        
        // Efecto de explosión visual
        const originalColor = '#ff3366';
        this.drawHeart(1.2, '#ff0066');
        setTimeout(() => this.drawHeart(1, originalColor), 200);
        setTimeout(() => this.drawHeart(1.1, '#ff3366'), 400);
        setTimeout(() => this.drawHeart(1, originalColor), 600);
    }
    
    rhythmTouch() {
        this.beatHeart('rhythm');
        this.showMessage("Ritmo especial activado 🎵", 'heart');
    }
    
    startRhythm() {
        const rhythm = [500, 250, 500, 250, 1000];
        rhythm.forEach((delay, index) => {
            setTimeout(() => {
                const scale = 1 + (index % 2) * 0.1;
                const color = index % 2 ? '#ff6699' : '#ff3366';
                this.drawHeart(scale, color);
            }, delay);
        });
    }
    
    animateBeat() {
        // Animar el latido
        const beatScale = 1.15;
        this.drawHeart(beatScale, '#ff0066');
        
        // Anillo de pulso visible
        const beatRing = document.querySelector('.heart-beat-ring');
        if (beatRing) {
            beatRing.style.opacity = '1';
            beatRing.style.transform = 'translate(-50%, -50%) scale(1)';
            beatRing.style.transition = 'none';
            
            setTimeout(() => {
                beatRing.style.opacity = '0';
                beatRing.style.transform = 'translate(-50%, -50%) scale(1.3)';
                beatRing.style.transition = 'all 0.5s ease';
            }, 50);
        }
        
        // Volver al tamaño normal
        setTimeout(() => {
            this.drawHeart(1, '#ff3366');
            this.state.isBeating = false;
        }, 300);
    }
    
    createClickParticles(x, y) {
        if (!window.particlesSystem) return;
        
        // Convertir coordenadas a relativas al canvas
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;
        
        // Crear partículas desde el punto de click
        const particleCount = Math.floor(10 * this.state.heartScale);
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                if (window.particlesSystem.createParticle) {
                    window.particlesSystem.createParticle(
                        canvasX,
                        canvasY,
                        '#ff3366'
                    );
                }
            }, i * 30);
        }
    }
    
    createExplosionParticles() {
        if (!window.particlesSystem) return;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const rect = this.canvas.getBoundingClientRect();
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                if (window.particlesSystem.createParticle) {
                    window.particlesSystem.createParticle(
                        centerX,
                        centerY,
                        ['#ff3366', '#ff6699', '#ff99cc'][Math.floor(Math.random() * 3)]
                    );
                }
            }, i * 20);
        }
    }
    
    saveMemory() {
        const input = document.getElementById('memoryInput');
        const text = input.value.trim();
        
        if (!text) {
            this.showMessage("Escribe algo primero ✍️", 'warning');
            input.focus();
            return;
        }
        
        const memory = {
            id: Date.now(),
            text: text,
            date: new Date().toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            loveAdded: 10
        };
        
        this.state.memories.unshift(memory);
        this.state.love += memory.loveAdded;
        this.state.heartbeat += 5;
        
        this.saveToLocalStorage();
        this.renderMemory(memory);
        this.updateUI();
        
        // Efecto especial
        this.showMessage("Recuerdo guardado en el corazón 💾", 'save');
        input.value = '';
        
        // Animación especial
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.drawHeart(1 + i * 0.05, '#ff99cc');
            }, i * 200);
        }
        setTimeout(() => this.drawHeart(1, '#ff3366'), 600);
    }
    
    createSpecialMemory() {
        const specialText = `Recuerdo Especial - ${new Date().toLocaleDateString()}\n\n${this.config.herName}, este momento quedó grabado en el código y en mi corazón. Eres la inspiración detrás de cada línea.`;
        
        const memory = {
            id: Date.now(),
            text: specialText,
            date: new Date().toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            loveAdded: 20,
            isSpecial: true
        };
        
        this.state.memories.unshift(memory);
        this.state.love += memory.loveAdded;
        
        this.saveToLocalStorage();
        this.renderMemory(memory);
        this.updateUI();
        this.closeModal();
        
        this.showMessage("¡Recuerdo especial creado! ✨", 'save');
        
        // Gran explosión de partículas
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createExplosionParticles();
            }, i * 50);
        }
    }
    
    renderMemory(memory) {
        const container = document.getElementById('memoriesContainer');
        const memoryCard = document.createElement('div');
        memoryCard.className = 'memory-card';
        if (memory.isSpecial) {
            memoryCard.classList.add('special-memory');
        }
        memoryCard.dataset.id = memory.id;
        memoryCard.innerHTML = `
            <div class="memory-date">
                <i class="far fa-clock"></i>
                ${memory.date}
                ${memory.isSpecial ? '<span class="special-badge">✨ Especial</span>' : ''}
            </div>
            <div class="memory-text">${memory.text}</div>
            <button class="delete-memory" onclick="corazon.deleteMemory(${memory.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.insertBefore(memoryCard, container.firstChild);
        
        // Efecto de entrada
        setTimeout(() => {
            memoryCard.style.opacity = '1';
            memoryCard.style.transform = 'translateY(0)';
        }, 10);
        
        // Actualizar contador
        this.updateMemoryCount();
    }
    
    updateMemoryCount() {
        const count = this.state.memories.length;
        document.getElementById('memoryCount').textContent = count;
    }
    
    deleteMemory(id) {
        this.state.memories = this.state.memories.filter(m => m.id !== id);
        this.saveToLocalStorage();
        
        // Re-renderizar memorias
        const container = document.getElementById('memoriesContainer');
        container.innerHTML = '';
        this.state.memories.forEach(memory => this.renderMemory(memory));
        
        this.showMessage("Recuerdo eliminado 🗑️", 'delete');
    }
    
    loadMemories() {
        const saved = localStorage.getItem(`corazon_${this.config.herName}`);
        if (saved) {
            try {
                this.state.memories = JSON.parse(saved);
                this.state.memories.forEach(memory => this.renderMemory(memory));
                this.state.love = Math.min(this.state.memories.length * 5, 100);
            } catch (e) {
                console.error("Error cargando memorias:", e);
                this.state.memories = [];
            }
        }
    }
    
    saveToLocalStorage() {
        try {
            localStorage.setItem(
                `corazon_${this.config.herName}`,
                JSON.stringify(this.state.memories)
            );
        } catch (e) {
            console.error("Error guardando memorias:", e);
        }
    }
    
    startHeartbeat() {
        // Latido automático base
        setInterval(() => {
            if (!this.state.isBeating) {
                // Latido suave en reposo
                this.state.heartbeat = Math.max(
                    72,
                    this.state.heartbeat - 0.5
                );
                this.updateUI();
            }
            
            // Efecto de pulso suave
            this.state.beatCount++;
            if (this.state.beatCount % 60 === 0 && this.state.love > 0) {
                this.drawPulseEffect();
            }
        }, 1000);
    }
    
    updateUI() {
        // Actualizar latido
        const heartbeatElement = document.getElementById('heartbeat');
        if (heartbeatElement) {
            const bpm = Math.round(this.state.heartbeat);
            heartbeatElement.innerHTML = `${bpm} <span class="unit">BPM</span>`;
            
            // Cambiar color según intensidad
            if (this.state.heartbeat > 100) {
                heartbeatElement.style.color = '#ff0066';
                heartbeatElement.style.textShadow = '0 0 10px rgba(255, 0, 102, 0.5)';
            } else if (this.state.heartbeat > 85) {
                heartbeatElement.style.color = '#ff3366';
                heartbeatElement.style.textShadow = '0 0 5px rgba(255, 51, 102, 0.5)';
            } else {
                heartbeatElement.style.color = '#ff6699';
                heartbeatElement.style.textShadow = 'none';
            }
        }
        
        // Actualizar barra de amor
        const lovePercent = document.getElementById('lovePercent');
        const loveFill = document.getElementById('loveFill');
        
        if (lovePercent && loveFill) {
            const percent = Math.round(this.state.love);
            lovePercent.textContent = `${percent}%`;
            loveFill.style.width = `${percent}%`;
            
            // Cambiar color según nivel de amor
            if (this.state.love < 30) {
                loveFill.style.background = 'linear-gradient(90deg, #ff3366, #ff6699)';
            } else if (this.state.love < 70) {
                loveFill.style.background = 'linear-gradient(90deg, #ff0066, #ff3366)';
            } else {
                loveFill.style.background = 'linear-gradient(90deg, #ff0066, #ff3366, #ff6699)';
                loveFill.style.boxShadow = '0 0 20px rgba(255, 51, 102, 0.7)';
            }
        }
        
        // Actualizar título dinámico
        const title = document.querySelector('.her-name');
        if (title) {
            if (this.state.love > 80) {
                title.innerHTML = `${this.config.herName} <i class="fas fa-heart"></i>`;
            } else if (this.state.love > 50) {
                title.innerHTML = `${this.config.herName} 💖`;
            }
        }
        
        // Actualizar contador de memorias
        this.updateMemoryCount();
    }
    
    showMessage(text, type = 'info') {
        const container = document.getElementById('floatingMessages');
        if (!container) return;
        
        const message = document.createElement('div');
        message.className = 'floating-message';
        message.textContent = text;
        
        // Estilo según tipo
        switch(type) {
            case 'heart':
                message.style.background = 'linear-gradient(45deg, rgba(255, 51, 102, 0.9), rgba(255, 102, 153, 0.9))';
                break;
            case 'warning':
                message.style.background = 'linear-gradient(45deg, rgba(255, 153, 51, 0.9), rgba(255, 204, 102, 0.9))';
                break;
            case 'save':
                message.style.background = 'linear-gradient(45deg, rgba(102, 204, 102, 0.9), rgba(153, 255, 153, 0.9))';
                break;
            case 'delete':
                message.style.background = 'linear-gradient(45deg, rgba(255, 77, 77, 0.9), rgba(255, 153, 153, 0.9))';
                break;
        }
        
        container.appendChild(message);
        
        // Remover después de la animación
        setTimeout(() => {
            if (message.parentNode === container) {
                message.remove();
            }
        }, 3000);
    }
    
    revealSecret() {
        if (this.state.love < 50) {
            this.showMessage(`El corazón necesita más amor para revelar su secreto (${Math.round(this.state.love)}/50) 💝`, 'warning');
            return;
        }
        
        const modal = document.getElementById('secretModal');
        const modalText = document.getElementById('modalText');
        
        if (!modal || !modalText) return;
        
        // Decodificar mensaje binario
        const decoded = this.binaryToString(this.config.binaryMessage);
        
        modalText.innerHTML = `
            <strong>${this.config.secretMessage}</strong>
            <br><br>
            <em>"${decoded}"</em>
            <br><br>
            Cada interacción contigo ha hecho que este corazón lata más fuerte.
            Has acumulado <strong>${this.state.love}% de amor</strong> y 
            <strong>${this.state.memories.length} recuerdos</strong> guardados.
        `;
        
        modal.style.display = 'flex';
        
        // Efecto especial
        this.drawHeart(1.2, '#ff99cc');
        setTimeout(() => this.drawHeart(1, '#ff3366'), 1000);
    }
    
    binaryToString(binary) {
        return binary.split(' ').map(bin => {
            return String.fromCharCode(parseInt(bin, 2));
        }).join('');
    }
    
    closeModal() {
        const modal = document.getElementById('secretModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        try {
            window.corazon = new CorazonDigital();
        } catch (error) {
            console.error("Error inicializando CorazonDigital:", error);
        }
    }, 100);
});