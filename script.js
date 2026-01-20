// ================= CONFIGURACIÓN PERSONALIZADA =================
const CONFIG = {
    herName: "Annie",
    yourName: "Andres",
    secretMessage: "Desde el primer momento en que te vi, supe que quería crear cosas hermosas para ti. Este código es solo el inicio de todo lo que podría construir contigo.",
    loveRequired: 100 
};

// ================= ESTADO GLOBAL =================
let state = {
    love: 0,
    memories: [],
    emotions: [],
    heartbeat: 72,
    particles: [],
    lastInteraction: Date.now()
};

// ================= INICIALIZACIÓN =================
document.addEventListener('DOMContentLoaded', function () {
    // Personalizar título
    document.getElementById('dynamic-title').textContent = `Para ${CONFIG.herName}`;

    // Inicializar elementos
    initUniverse();
    initCursor();
    initHeart();
    loadMemories();
    updateHeartbeat();
    startEmotionParticles();

    // Configurar interactividad
    setupEventListeners();

    // Mensaje de bienvenida
    setTimeout(() => {
        showFloatingMessage(`Bienvenida, ${CONFIG.herName}. Este espacio es solo para ti.`, 'joy');
    }, 1000);
});

// ================= UNIVERSO DE FONDO =================
function initUniverse() {
    const container = document.getElementById('universe-container');
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.background = 'white';
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.opacity = Math.random() * 0.7 + 0.3;
        star.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px white`;

        // Animación de parpadeo
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite alternate`;
        const style = document.createElement('style');
        style.textContent = `
                    @keyframes twinkle {
                        0%, 100% { opacity: ${star.style.opacity}; }
                        50% { opacity: ${parseFloat(star.style.opacity) * 0.3}; }
                    }
                `;
        document.head.appendChild(style);

        container.appendChild(star);
    }
}

// ================= CURSOR PERSONALIZADO =================
function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';

        setTimeout(() => {
            cursorRing.style.left = e.clientX + 'px';
            cursorRing.style.top = e.clientY + 'px';
        }, 100);
    });

    document.addEventListener('click', () => {
        cursorRing.style.transform = 'scale(0.8)';
        setTimeout(() => {
            cursorRing.style.transform = 'scale(1)';
        }, 100);

        // Crear partículas al hacer clic
        createParticles(event.clientX, event.clientY, '#ff4d8d');
    });
}

// ================= CORAZÓN INTERACTIVO =================
function initHeart() {
    const heart = document.getElementById('interactive-heart');
    const heartPath = document.querySelector('.heart-path');

    heart.addEventListener('click', function () {
        addLove(5);
        pulseHeart();
        createParticles(
            heart.getBoundingClientRect().left + 200,
            heart.getBoundingClientRect().top + 200,
            '#ff4d8d'
        );
        showFloatingMessage('El corazón late más fuerte...', 'love');
    });

    heart.addEventListener('mouseenter', function () {
        heartPath.style.transform = 'scale(1.1)';
        heartPath.style.fill = '#ff3366';
    });

    heart.addEventListener('mouseleave', function () {
        heartPath.style.transform = 'scale(1)';
        heartPath.style.fill = '#ff4d8d';
    });
}

// ================= SISTEMA DE EMOCIONES =================
function setupEventListeners() {
    // Botones de emoción
    document.querySelectorAll('.emotion-btn[data-emotion]').forEach(btn => {
        btn.addEventListener('click', function () {
            const emotion = this.dataset.emotion;
            registerEmotion(emotion);
            showFloatingMessage(`Sentimiento registrado: ${getEmotionText(emotion)}`, emotion);
            addLove(3);

            // Efectos visuales según emoción
            switch (emotion) {
                case 'love':
                    createHeartParticles();
                    break;
                case 'joy':
                    createConfetti();
                    break;
                case 'peace':
                    createFloatingLeaves();
                    break;
            }
        });
    });

    // Guardar recuerdo
    document.getElementById('saveMemory').addEventListener('click', function () {
        const memoryText = document.getElementById('memoryInput').value.trim();
        if (memoryText) {
            saveMemory(memoryText);
            document.getElementById('memoryInput').value = '';
            addLove(10);
            showFloatingMessage('Recuerdo guardado en la eternidad 💫', 'nostalgia');
        }
    });

    // Enter para guardar recuerdo
    document.getElementById('memoryInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('saveMemory').click();
        }
    });
}

// ================= SISTEMA DE AMOR =================
function addLove(amount) {
    state.love = Math.min(state.love + amount, 100);
    updateLoveMeter();

    if (state.love >= CONFIG.loveRequired && !state.secretRevealed) {
        revealSecret();
        state.secretRevealed = true;
    }
}

function updateLoveMeter() {
    const fill = document.getElementById('loveFill');
    const percentage = document.getElementById('lovePercentage');

    fill.style.width = state.love + '%';
    percentage.textContent = state.love + '%';

    // Cambiar color según el nivel
    if (state.love < 30) {
        fill.style.background = 'linear-gradient(90deg, #ff4d8d, #ff6b9d)';
    } else if (state.love < 70) {
        fill.style.background = 'linear-gradient(90deg, #ff3366, #ff4d8d)';
    } else {
        fill.style.background = 'linear-gradient(90deg, #ff0066, #ff3366)';
    }
}

// ================= SISTEMA DE RECUERDOS =================
function saveMemory(text) {
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
        emotion: state.emotions[state.emotions.length - 1] || 'neutral'
    };

    state.memories.unshift(memory);
    renderMemory(memory);
    saveToLocalStorage();
}

function renderMemory(memory) {
    const container = document.getElementById('memoryContainer');
    const memoryCard = document.createElement('div');
    memoryCard.className = 'memory-card';
    memoryCard.innerHTML = `
                <div class="memory-date">${memory.date}</div>
                <div class="memory-text">${memory.text}</div>
                <button class="delete-memory" onclick="deleteMemory(${memory.id})">×</button>
            `;

    container.insertBefore(memoryCard, container.firstChild);

    // Efecto de entrada
    setTimeout(() => {
        memoryCard.style.transform = 'translateY(0)';
        memoryCard.style.opacity = '1';
    }, 10);
}

function loadMemories() {
    const saved = localStorage.getItem(`memories_${CONFIG.herName}`);
    if (saved) {
        state.memories = JSON.parse(saved);
        state.memories.forEach(renderMemory);
    }
}

function saveToLocalStorage() {
    localStorage.setItem(`memories_${CONFIG.herName}`, JSON.stringify(state.memories));
}

function deleteMemory(id) {
    state.memories = state.memories.filter(m => m.id !== id);
    saveToLocalStorage();
    document.getElementById('memoryContainer').innerHTML = '';
    state.memories.forEach(renderMemory);
}

// ================= EFECTOS VISUALES =================
function createParticles(x, y, color) {
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = color;
        particle.style.borderRadius = '50%';
        particle.style.position = 'fixed';
        particle.style.zIndex = '1000';

        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        let opacity = 1;
        const animate = () => {
            particle.style.left = parseFloat(particle.style.left) + vx + 'px';
            particle.style.top = parseFloat(particle.style.top) + vy + 'px';
            opacity -= 0.02;
            particle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        animate();
    }
}

function createHeartParticles() {
    const heart = document.getElementById('interactive-heart');
    const rect = heart.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createParticles(centerX, centerY, '#ff4d8d');
        }, i * 50);
    }
}

function pulseHeart() {
    const heart = document.querySelector('.heart-path');
    heart.style.transform = 'scale(1.15)';
    setTimeout(() => {
        heart.style.transform = 'scale(1)';
    }, 300);

    // Anillo de pulso
    const ring = document.querySelector('.pulse-ring');
    ring.style.left = '50%';
    ring.style.top = '50%';
    ring.style.width = '0px';
    ring.style.height = '0px';
    ring.style.opacity = '1';

    setTimeout(() => {
        ring.style.width = '100px';
        ring.style.height = '100px';
        ring.style.marginLeft = '-50px';
        ring.style.marginTop = '-50px';
    }, 10);
}

function showFloatingMessage(text, emotion) {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.position = 'fixed';
    message.style.top = '20%';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.background = getEmotionColor(emotion);
    message.style.color = 'white';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '20px';
    message.style.zIndex = '10000';
    message.style.fontWeight = '600';
    message.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    message.style.opacity = '0';
    message.style.transition = 'all 0.3s ease';

    document.body.appendChild(message);

    setTimeout(() => {
        message.style.opacity = '1';
        message.style.top = '18%';
    }, 10);

    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// ================= SECRETOS Y FUNCIONES ESPECIALES =================
function revealSecret() {
    const secretDiv = document.getElementById('secretMessage');
    const content = document.getElementById('secretContent');

    // Decodificar mensaje binario
    const binaryMessage = document.getElementById('encryptedMessage').textContent;
    const decodedMessage = binaryToString(binaryMessage);
    content.textContent = `${decodedMessage}\n\n${CONFIG.secretMessage}`;

    secretDiv.style.display = 'block';

    // Efecto especial
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createParticles(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight,
                ['#ff4d8d', '#ffb6c1', '#8a2be2'][Math.floor(Math.random() * 3)]
            );
        }, i * 50);
    }
}

function binaryToString(binary) {
    return binary.split(' ').map(bin => {
        return String.fromCharCode(parseInt(bin, 2));
    }).join('');
}

function closeSecret() {
    document.getElementById('secretMessage').style.display = 'none';
}

function createSpecialMemory() {
    const specialMemory = `Recuerdo Especial - ${CONFIG.specialDate}\n\nEste momento quedó grabado en el código y en mi corazón. ${CONFIG.herName}, eres la inspiración detrás de cada línea.`;
    saveMemory(specialMemory);
    closeSecret();
}

// ================= FUNCIONES AUXILIARES =================
function registerEmotion(emotion) {
    state.emotions.push(emotion);
    state.lastInteraction = Date.now();
    updateHeartbeat();
}

function getEmotionText(emotion) {
    const emotions = {
        'love': '❤️ Amor',
        'joy': '😊 Alegría',
        'peace': '🕊️ Paz',
        'excitement': '✨ Emoción',
        'nostalgia': '🌙 Nostalgia'
    };
    return emotions[emotion] || 'Emoción';
}

function getEmotionColor(emotion) {
    const colors = {
        'love': 'linear-gradient(45deg, #ff4d8d, #ff3366)',
        'joy': 'linear-gradient(45deg, #ffd166, #ffb347)',
        'peace': 'linear-gradient(45deg, #8ac6d1, #6a8caf)',
        'excitement': 'linear-gradient(45deg, #b388eb, #8a2be2)',
        'nostalgia': 'linear-gradient(45deg, #7bdff2, #b2f7ef)'
    };
    return colors[emotion] || colors['love'];
}

function updateHeartbeat() {
    // El latido aumenta con las interacciones
    const baseRate = 72;
    const activityBonus = Math.min(state.emotions.length * 2, 40);
    const timeBonus = Math.max(0, 60 - (Date.now() - state.lastInteraction) / 1000);

    state.heartbeat = baseRate + activityBonus + timeBonus;
    document.getElementById('heartbeat').textContent = `LATIDO: ${Math.round(state.heartbeat)} BPM`;

    // Cambiar color según intensidad
    const display = document.querySelector('.heartbeat-display');
    if (state.heartbeat > 100) {
        display.style.color = '#ff3366';
        display.style.textShadow = '0 0 10px #ff3366';
    } else if (state.heartbeat > 85) {
        display.style.color = '#ff4d8d';
        display.style.textShadow = '0 0 5px #ff4d8d';
    } else {
        display.style.color = '#ffb6c1';
        display.style.textShadow = 'none';
    }
}

function startEmotionParticles() {
    setInterval(() => {
        if (state.emotions.length > 0) {
            const lastEmotion = state.emotions[state.emotions.length - 1];
            if (Math.random() > 0.7) {
                createParticles(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    lastEmotion === 'love' ? '#ff4d8d' :
                        lastEmotion === 'joy' ? '#ffd166' :
                            lastEmotion === 'peace' ? '#8ac6d1' :
                                lastEmotion === 'excitement' ? '#b388eb' : '#7bdff2'
                );
            }
        }
    }, 2000);

    // Actualizar latido cada segundo
    setInterval(updateHeartbeat, 1000);
}

// ================= EFECTO DE CONFETTI =================
function createConfetti() {
    const colors = ['#ff4d8d', '#ffd166', '#8ac6d1', '#b388eb', '#7bdff2'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            confetti.style.zIndex = '1000';
            confetti.style.opacity = '0.9';

            document.body.appendChild(confetti);

            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });

            animation.onfinish = () => confetti.remove();
        }, i * 30);
    }
}