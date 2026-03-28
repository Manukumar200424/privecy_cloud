// 3D Animated Background for Admin Panel
class ThreeJSBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.geometricShapes = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        // Make scene full screen
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        
        // Position camera to see more of the scene
        this.camera.position.z = 50;
        this.camera.position.y = 10;
        
        // Add to body instead of specific container
        document.body.appendChild(this.renderer.domElement);
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.zIndex = '1';
        this.renderer.domElement.style.pointerEvents = 'none';

        // Create lighting
        this.createLighting();

        // Create particles
        this.createParticles();

        // Create geometric shapes
        this.createGeometricShapes();

        // Add event listeners
        this.addEventListeners();

        // Start animation
        this.animate();
    }

    createLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x3b82f6, 0.3);
        this.scene.add(ambientLight);

        // Point lights
        const pointLight1 = new THREE.PointLight(0x3b82f6, 1, 50);
        pointLight1.position.set(10, 10, 10);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.5, 50);
        pointLight2.position.set(-10, -10, -10);
        this.scene.add(pointLight2);
    }

    createParticles() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1500;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            // Position
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 50;

            // Color (mix of blue and purple)
            const colorChoice = Math.random();
            if (colorChoice > 0.5) {
                colors[i] = 0.23;     // R (blue)
                colors[i + 1] = 0.51;  // G (blue)
                colors[i + 2] = 0.96;  // B (blue)
            } else {
                colors[i] = 0.55;     // R (purple)
                colors[i + 1] = 0.36;  // G (purple)
                colors[i + 2] = 0.96;  // B (purple)
            }
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particleSystem);
        this.particles.push(particleSystem);
    }

    createGeometricShapes() {
        // Create floating geometric shapes
        const shapes = [
            { type: 'box', color: 0x3b82f6, size: 2 },
            { type: 'sphere', color: 0x8b5cf6, size: 1.5 },
            { type: 'tetrahedron', color: 0x10b981, size: 1.8 },
            { type: 'octahedron', color: 0xf59e0b, size: 1.2 }
        ];

        shapes.forEach((shapeData, index) => {
            let geometry;
            
            switch (shapeData.type) {
                case 'box':
                    geometry = new THREE.BoxGeometry(shapeData.size, shapeData.size, shapeData.size);
                    break;
                case 'sphere':
                    geometry = new THREE.SphereGeometry(shapeData.size, 32, 32);
                    break;
                case 'tetrahedron':
                    geometry = new THREE.TetrahedronGeometry(shapeData.size, 0);
                    break;
                case 'octahedron':
                    geometry = new THREE.OctahedronGeometry(shapeData.size, 0);
                    break;
            }

            const material = new THREE.MeshPhongMaterial({
                color: shapeData.color,
                transparent: true,
                opacity: 0.3,
                wireframe: true
            });

            const mesh = new THREE.Mesh(geometry, material);
            
            // Random position
            mesh.position.x = (Math.random() - 0.5) * 40;
            mesh.position.y = (Math.random() - 0.5) * 40;
            mesh.position.z = (Math.random() - 0.5) * 20;

            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;

            // Store rotation speed
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.02 + 0.01,
                floatRange: Math.random() * 5 + 2
            };

            this.scene.add(mesh);
            this.geometricShapes.push(mesh);
        });
    }

    addEventListeners() {
        // Mouse movement
        window.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Animate particles
        this.particles.forEach((particleSystem, index) => {
            particleSystem.rotation.y += 0.001;
            particleSystem.rotation.x += 0.0005;
            
            // Subtle floating motion
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(Date.now() * 0.0001 + i) * 0.01;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
        });

        // Animate geometric shapes
        this.geometricShapes.forEach((shape, index) => {
            // Rotation
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;

            // Floating motion
            const time = Date.now() * 0.001;
            shape.position.y += Math.sin(time * shape.userData.floatSpeed + index) * 0.02;
            shape.position.x += Math.cos(time * shape.userData.floatSpeed * 0.7 + index) * 0.01;
        });

        // Camera parallax effect based on mouse movement
        this.camera.position.x = this.mouseX * 2;
        this.camera.position.y = this.mouseY * 2;
        this.camera.lookAt(this.scene.position);

        // Render
        this.renderer.render(this.scene, this.camera);
    }

    // Cleanup method
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
            const canvas = this.renderer.domElement;
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only load Three.js if we're on the admin page
    if (window.location.pathname.includes('/admin')) {
        
        // Load Three.js library
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => {
            // Initialize 3D background
            window.threeJSBackground = new ThreeJSBackground();
        };
        document.head.appendChild(script);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.threeJSBackground) {
        window.threeJSBackground.dispose();
    }
});
