// Enhanced Admin Panel Animations & Transfer Effects
class AdminAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.addFloatingElements();
        this.addTransferAnimations();
        this.addHoverEffects();
        this.addLoadingAnimations();
        this.addProgressAnimations();
        this.startBackgroundAnimations();
    }

    // Floating elements for visual appeal
    addFloatingElements() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                33% { transform: translateY(-10px) rotate(2deg); }
                66% { transform: translateY(5px) rotate(-1deg); }
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 0.8; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.05); }
            }
            
            @keyframes slideInFromLeft {
                from { opacity: 0; transform: translateX(-50px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes slideInFromRight {
                from { opacity: 0; transform: translateX(50px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes glow {
                0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
                50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
            }
            
            @keyframes dataTransfer {
                0% { transform: scale(0.8) rotate(0deg); opacity: 0; }
                50% { transform: scale(1.1) rotate(180deg); opacity: 1; }
                100% { transform: scale(1) rotate(360deg); opacity: 1; }
            }
            
            .floating-element {
                animation: float 6s ease-in-out infinite;
                position: absolute;
                pointer-events: none;
                z-index: 1;
            }
            
            .pulse-animation {
                animation: pulse 2s ease-in-out infinite;
            }
            
            .slide-in-left {
                animation: slideInFromLeft 0.5s ease-out;
            }
            
            .slide-in-right {
                animation: slideInFromRight 0.5s ease-out;
            }
            
            .glow-effect {
                animation: glow 2s ease-in-out infinite;
            }
            
            .transfer-animation {
                animation: dataTransfer 1s ease-in-out;
            }
            
            .stat-box {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }
            
            .stat-box::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent);
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
            }
            
            .stat-box:hover::before {
                opacity: 1;
            }
            
            .stat-box:hover {
                transform: translateY(-5px) scale(1.02);
                box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
            }
            
            .table-card {
                transition: all 0.3s ease;
                position: relative;
            }
            
            .table-card::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, var(--primary), var(--accent));
                transform: scaleX(0);
                transition: transform 0.3s ease;
            }
            
            .table-card:hover::after {
                transform: scaleX(1);
            }
            
            .user-row {
                transition: all 0.3s ease;
                position: relative;
            }
            
            .user-row:hover {
                background: rgba(59, 130, 246, 0.05);
                transform: translateX(5px);
            }
            
            .transfer-indicator {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--primary);
                color: white;
                padding: 10px 15px;
                border-radius: 25px;
                font-weight: 600;
                z-index: 1000;
                opacity: 0;
                transform: translateX(100px);
                transition: all 0.3s ease;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
            
            .transfer-indicator.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .transfer-indicator.success {
                background: var(--success);
            }
            
            .transfer-indicator.error {
                background: var(--danger);
            }
            
            .progress-ring {
                transition: stroke-dashoffset 0.5s ease;
                transform: rotate(-90deg);
                transform-origin: 50% 50%;
            }
            
            .data-stream {
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--primary);
                border-radius: 50%;
                opacity: 0;
                pointer-events: none;
            }
            
            .data-stream.active {
                animation: stream 1s ease-in-out infinite;
            }
            
            @keyframes stream {
                0% { opacity: 0; transform: scale(0); }
                50% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // Add hover effects to interactive elements
    addHoverEffects() {
        document.addEventListener('DOMContentLoaded', () => {
            // Add hover effects to buttons
            const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary');
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', (e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 5px 15px rgba(59, 130, 246, 0.3)';
                });
                
                btn.addEventListener('mouseleave', (e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                });
            });

            // Add ripple effect to clicks
            document.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.classList.contains('btn')) {
                    this.createRipple(e);
                }
            });
        });
    }

    // Create ripple effect
    createRipple(e) {
        const button = e.target;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        // Add ripple styles
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to { transform: scale(4); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Add loading animations
    addLoadingAnimations() {
        const loadingStyle = document.createElement('style');
        loadingStyle.textContent = `
            .loading-spinner {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid var(--primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .skeleton-loader {
                background: linear-gradient(90deg, 
                    rgba(255, 255, 255, 0.1) 25%, 
                    rgba(255, 255, 255, 0.2) 50%, 
                    rgba(255, 255, 255, 0.1) 75%);
                background-size: 200% 100%;
                animation: loading 1.5s ease-in-out infinite;
                border-radius: 4px;
            }
            
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        document.head.appendChild(loadingStyle);
    }

    // Add progress animations
    addProgressAnimations() {
        const progressStyle = document.createElement('style');
        progressStyle.textContent = `
            .progress-bar-animated {
                position: relative;
                overflow: hidden;
            }
            
            .progress-bar-animated::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.3) 50%, 
                    transparent);
                animation: shimmer 2s infinite;
            }
            
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            .circular-progress {
                position: relative;
                width: 60px;
                height: 60px;
            }
            
            .circular-progress svg {
                transform: rotate(-90deg);
            }
            
            .circular-progress circle {
                fill: none;
                stroke-width: 4;
                stroke-linecap: round;
                transition: stroke-dashoffset 0.5s ease;
            }
            
            .progress-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 12px;
                font-weight: 600;
            }
        `;
        document.head.appendChild(progressStyle);
    }

    // Add transfer animations
    addTransferAnimations() {
        // Create transfer indicator
        const indicator = document.createElement('div');
        indicator.className = 'transfer-indicator';
        indicator.innerHTML = '<i class="fa-solid fa-exchange-alt"></i> Transfer Active';
        document.body.appendChild(indicator);
        
        // Expose global functions
        window.showTransfer = (message, type = 'success') => {
            indicator.textContent = message;
            indicator.className = `transfer-indicator show ${type}`;
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 3000);
        };
        
        window.createDataStream = (startElement, endElement) => {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            
            const startRect = startElement.getBoundingClientRect();
            const endRect = endElement.getBoundingClientRect();
            
            stream.style.left = startRect.left + startRect.width / 2 + 'px';
            stream.style.top = startRect.top + startRect.height / 2 + 'px';
            
            const deltaX = endRect.left - startRect.left;
            const deltaY = endRect.top - startRect.top;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            
            stream.style.width = distance + 'px';
            stream.style.height = '2px';
            stream.style.transform = `rotate(${angle}deg)`;
            stream.style.transformOrigin = '0 50%';
            
            document.body.appendChild(stream);
            
            setTimeout(() => {
                stream.classList.add('active');
            }, 100);
            
            setTimeout(() => {
                stream.remove();
            }, 1000);
        };
    }

    // Start background animations
    startBackgroundAnimations() {
        // Add floating particles
        this.createFloatingParticles();
        
        // Add connection lines between elements
        this.createConnectionLines();
    }

    // Create floating particles
    createFloatingParticles() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '1';
        container.id = 'floating-particles';
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-element';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.1})`;
            particle.style.borderRadius = '50%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            
            container.appendChild(particle);
        }
        
        document.body.appendChild(container);
    }

    // Create connection lines
    createConnectionLines() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.position = 'fixed';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '0';
        svg.id = 'connection-lines';
        
        // Create animated connection lines
        for (let i = 0; i < 5; i++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', Math.random() * window.innerWidth);
            line.setAttribute('y1', Math.random() * window.innerHeight);
            line.setAttribute('x2', Math.random() * window.innerWidth);
            line.setAttribute('y2', Math.random() * window.innerHeight);
            line.setAttribute('stroke', `rgba(139, 92, 246, ${Math.random() * 0.2 + 0.1})`);
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke-dasharray', '5, 5');
            line.style.animation = `dash ${Math.random() * 3 + 2}s linear infinite`;
            
            svg.appendChild(line);
        }
        
        document.body.appendChild(svg);
        
        // Add dash animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes dash {
                to { stroke-dashoffset: -10; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize animations
const adminAnimations = new AdminAnimations();

// Export for use in other scripts
window.adminAnimations = adminAnimations;
