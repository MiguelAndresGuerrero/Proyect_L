class SistemaParticulas {
    constructor() {
        this.canvas = document.getElementById('particles-bg');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Crear partículas iniciales
        this.createParticles(80);
        
        // Iniciar animación
        this.animate();
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                color: this.getRandomColor(),
                opacity: Math.random() * 0.4 + 0.1,
                waveOffset: Math.random() * Math.PI * 2
            });
        }
    }
    
    getRandomColor() {
        const colors = [
            'rgba(255, 51, 102, 0.6)',
            'rgba(255, 102, 153, 0.5)',
            'rgba(255, 153, 204, 0.4)',
            'rgba(255, 204, 229, 0.3)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    createParticle(x, y, color = null) {
        this.particles.push({
            x: x,
            y: y,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 4,
            speedY: (Math.random() - 0.5) * 4,
            color: color || this.getRandomColor(),
            opacity: 0.8,
            life: 100
        });
    }
    
    animate() {
        if (!this.canvas || !this.ctx) return;
        
        // Fondo semi-transparente para efecto de estela
        this.ctx.fillStyle = 'rgba(12, 12, 46, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const currentTime = Date.now() * 0.001;
        
        // Actualizar y dibujar partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Movimiento base
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Efecto de onda
            p.x += Math.sin(currentTime + p.waveOffset) * 0.3;
            p.y += Math.cos(currentTime + p.waveOffset) * 0.3;
            
            // Rebote en bordes
            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
            
            // Mantener dentro de límites
            p.x = Math.max(0, Math.min(this.canvas.width, p.x));
            p.y = Math.max(0, Math.min(this.canvas.height, p.y));
            
            // Reducir vida si existe
            if (p.life !== undefined) {
                p.life -= 1;
                p.opacity = p.life / 100;
                p.size *= 0.99;
                
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }
            }
            
            // Dibujar partícula
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            
            // Parsear color RGBA
            const colorMatch = p.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (colorMatch) {
                const r = colorMatch[1];
                const g = colorMatch[2];
                const b = colorMatch[3];
                const baseAlpha = colorMatch[4] ? parseFloat(colorMatch[4]) : 1;
                const finalAlpha = p.opacity !== undefined ? p.opacity * baseAlpha : baseAlpha;
                
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
            } else {
                this.ctx.fillStyle = p.color;
            }
            
            this.ctx.fill();
        }
        
        // Dibujar conexiones entre partículas cercanas
        this.drawConnections();
        
        // Continuar animación
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        const maxDistance = 100;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const distance = Math.sqrt(
                    Math.pow(p1.x - p2.x, 2) + 
                    Math.pow(p1.y - p2.y, 2)
                );
                
                if (distance < maxDistance) {
                    const opacity = (1 - (distance / maxDistance)) * 0.1;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(255, 153, 204, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    // Método para ser llamado desde corazon.js
    createHeartParticles(x, y, count = 15) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createParticle(x, y, 'rgba(255, 51, 102, 0.8)');
            }, i * 30);
        }
    }
}

// Inicializar sistema de partículas
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        try {
            window.particlesSystem = new SistemaParticulas();
        } catch (error) {
            console.error("Error inicializando partículas:", error);
        }
    }, 150);
});