// Requires Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function initRainbowOrb() {
// Setup scene
const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Create starfield background
    const starCount = 2000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    const starColors = [];
    
    for (let i = 0; i < starCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = 50 + Math.random() * 50;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        starPositions.push(x, y, z);
        
        const intensity = 0.3 + Math.random() * 0.3;
        const blueShift = Math.random() * 0.2;
        starColors.push(intensity, intensity, intensity + blueShift);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 0.015,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true
    });
    
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    controls.minDistance = 4;
    controls.maxDistance = 20;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.5;
    controls.enablePan = true;
    controls.panSpeed = 0.5;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.0;
    controls.autoRotate = false;

    // Add UI controls container if it doesn't exist
    const controls_div = document.createElement('div');
    controls_div.style.position = 'fixed';
    controls_div.style.top = '20px';
    controls_div.style.left = '20px';
    controls_div.style.zIndex = '1000';
    controls_div.style.display = 'flex';
    controls_div.style.flexDirection = 'column';
    controls_div.style.gap = '10px';
    document.body.appendChild(controls_div);

    // Shape buttons container
    const buttons_div = document.createElement('div');
    buttons_div.style.display = 'flex';
    buttons_div.style.gap = '10px';
    controls_div.appendChild(buttons_div);

    // Add hue slider container
    const slider_container = document.createElement('div');
    slider_container.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    slider_container.style.padding = '10px';
    slider_container.style.borderRadius = '4px';
    slider_container.style.display = 'flex';
    slider_container.style.alignItems = 'center';
    slider_container.style.gap = '10px';
    controls_div.appendChild(slider_container);

    // Add label
    const label = document.createElement('label');
    label.textContent = 'Color Hue:';
    label.style.color = 'white';
    label.style.fontSize = '14px';
    slider_container.appendChild(label);

    // Add hue slider
    const hueSlider = document.createElement('input');
    hueSlider.type = 'range';
    hueSlider.min = '0';
    hueSlider.max = '360';
    hueSlider.value = '0';
    hueSlider.style.width = '150px';
    slider_container.appendChild(hueSlider);

    // Add value display
    const valueDisplay = document.createElement('span');
    valueDisplay.style.color = 'white';
    valueDisplay.style.fontSize = '14px';
    valueDisplay.style.minWidth = '40px';
    valueDisplay.textContent = '0°';
    slider_container.appendChild(valueDisplay);

    // Style the slider
    hueSlider.style.appearance = 'none';
    hueSlider.style.height = '8px';
    hueSlider.style.borderRadius = '4px';
    hueSlider.style.background = 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)';
    hueSlider.style.cursor = 'pointer';
    
    // Add hover effect
    hueSlider.addEventListener('mouseover', () => {
        hueSlider.style.opacity = '0.9';
    });
    hueSlider.addEventListener('mouseout', () => {
        hueSlider.style.opacity = '1';
    });

    let currentHue = 0;

    // Update colors when slider changes
    hueSlider.addEventListener('input', (e) => {
        currentHue = parseInt(e.target.value);
        valueDisplay.textContent = `${currentHue}°`;
        updateColors();
    });

    const shapes = ['Sphere', 'Cube', 'Torus', 'Spiral'];
    let currentShape = 'Sphere';
    
    shapes.forEach(shape => {
        const button = document.createElement('button');
        button.textContent = shape;
        button.style.padding = '8px 16px';
        button.style.backgroundColor = shape === currentShape ? '#4facfe' : '#333';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.3s ease';
        
        button.addEventListener('mouseover', () => {
            if (shape !== currentShape) {
                button.style.backgroundColor = '#444';
            }
        });
        
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = shape === currentShape ? '#4facfe' : '#333';
        });
        
        button.addEventListener('click', () => {
            currentShape = shape;
            shapes.forEach(s => {
                const btn = buttons_div.querySelector(`button[data-shape="${s}"]`);
                btn.style.backgroundColor = s === shape ? '#4facfe' : '#333';
            });
            regenerateShape();
        });
        
        button.setAttribute('data-shape', shape);
        buttons_div.appendChild(button);
    });

    // Disable controls when shift is pressed
    window.addEventListener('keydown', (event) => {
        if (event.shiftKey) {
            controls.enabled = false;
        }
    });

    window.addEventListener('keyup', (event) => {
        if (!event.shiftKey) {
            controls.enabled = true;
        }
    });

    // Core variables
    const numLights = 1000;
    const radius = 3;
    const trailLength = 0.75;
    let lightGroup = new THREE.Group();
    let shellGroup = new THREE.Group();
    const triangles = [];
    
    // Modify line material for smoother curves
    const lineMaterial = new THREE.LineBasicMaterial({ 
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    // Shell material
    const shellMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: false,
        wireframe: false,
        side: THREE.DoubleSide,
        depthWrite: true,
        depthTest: true
    });

    // Base colors (will be hue-shifted)
    const baseColorBands = [
        { color: new THREE.Color(0x4facfe), radius: 3.0 },
        { color: new THREE.Color(0x9d4edd), radius: 2.2 },
        { color: new THREE.Color(0x00f2fe), radius: 1.4 },
        { color: new THREE.Color(0xf72585), radius: 0.6 }
    ];

    // Function to shift hue of a color
    function shiftHue(color, hueShift) {
        // Convert RGB to HSL
        let hsl = {};
        color.getHSL(hsl);
        
        // Add hue shift (normalize to 0-1 range)
        hsl.h = (hsl.h + (hueShift / 360)) % 1;
        
        // Create new color with shifted hue
        const newColor = new THREE.Color();
        newColor.setHSL(hsl.h, hsl.s, hsl.l);
        return newColor;
    }

    // Modified color bands with hue shift
    let colorBands = baseColorBands.map(band => ({
        ...band,
        color: band.color.clone()
    }));

    function updateColors() {
        // Update color bands
        colorBands = baseColorBands.map(band => ({
            ...band,
            color: shiftHue(band.color.clone(), currentHue)
        }));

        // Update all existing nodes and trails
        lightGroup.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                const pos = child.position;
                const color = getColorForRadius(pos.length());
                child.material.color.copy(color);

                // Update trail colors
                if (child.userData.line) {
                    const lineColors = child.userData.line.geometry.attributes.color;
                    const array = lineColors.array;
                    
                    for (let i = 0; i < array.length; i += 3) {
                        const t = i / array.length;
                        const radiusAtPoint = pos.length() * (1 - (t * trailLength));
                        const colorAtPoint = getColorForRadius(radiusAtPoint);
                        array[i] = colorAtPoint.r;
                        array[i + 1] = colorAtPoint.g;
                        array[i + 2] = colorAtPoint.b;
                    }
                    
                    lineColors.needsUpdate = true;
                }
            }
        });
    }

    function getColorForRadius(radius) {
        for (let i = 0; i < colorBands.length - 1; i++) {
            if (radius >= colorBands[i + 1].radius) {
                const band1 = colorBands[i];
                const band2 = colorBands[i + 1];
                const t = (radius - band2.radius) / (band1.radius - band2.radius);
                const color = new THREE.Color();
                color.lerpColors(band2.color, band1.color, t);
                return color;
            }
        }
        return colorBands[colorBands.length - 1].color;
    }

    // Shape generation functions
    function generateSpherePositions(count) {
        const positions = [];
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        const angleIncrement = Math.PI * 2 * goldenRatio;
        
        for (let i = 0; i < count; i++) {
            const t = i / count;
            const inclination = Math.acos(1 - 2 * t);
            const azimuth = angleIncrement * i;

            const x = radius * Math.sin(inclination) * Math.cos(azimuth);
            const y = radius * Math.sin(inclination) * Math.sin(azimuth);
            const z = radius * Math.cos(inclination);
            
            positions.push(new THREE.Vector3(x, y, z));
        }
        
        return positions;
    }

    function generateCubePositions(count) {
        const positions = [];
        const size = 2.5; // This is the size for nodes
        const pointsPerSide = Math.ceil(Math.pow(count / 6, 1/2));
        
        for (let side = 0; side < 6; side++) {
            for (let i = 0; i < pointsPerSide; i++) {
                for (let j = 0; j < pointsPerSide; j++) {
                    if (positions.length >= count) break;
                    
                    const u = (i / pointsPerSide - 0.5) * 2;
                    const v = (j / pointsPerSide - 0.5) * 2;
                    const pos = new THREE.Vector3();
                    
                    switch(side) {
                        case 0: pos.set(size, u * size, v * size); break;
                        case 1: pos.set(-size, u * size, v * size); break;
                        case 2: pos.set(u * size, size, v * size); break;
                        case 3: pos.set(u * size, -size, v * size); break;
                        case 4: pos.set(u * size, v * size, size); break;
                        case 5: pos.set(u * size, v * size, -size); break;
                    }
                    
                    positions.push(pos);
                }
            }
        }
        
        return positions;
    }

    function generateTorusPositions(count) {
        // Reduce node count for torus specifically
        const torusNodeCount = Math.floor(count * 0.6); // 40% fewer nodes for torus
        const positions = [];
        const majorRadius = 3;  // Main ring radius
        const minorRadius = 1.2; // Tube radius
        
        // Use fibonacci distribution for even point spacing
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
        
        for (let i = 0; i < torusNodeCount; i++) {
            const t = i / torusNodeCount;
            
            // Distribute points evenly around the torus surface
            const ringAngle = phi * i; // Around the main ring
            const tubeAngle = Math.acos(2 * t - 1); // Around the tube
            
            // Calculate position on torus surface
            const x = (majorRadius + minorRadius * Math.cos(tubeAngle)) * Math.cos(ringAngle);
            const y = (majorRadius + minorRadius * Math.cos(tubeAngle)) * Math.sin(ringAngle);
            const z = minorRadius * Math.sin(tubeAngle);
            
            positions.push(new THREE.Vector3(x, y, z));
        }
        
        return positions;
    }

    function generateSpiralPositions(count) {
        const positions = [];
        const turns = 5;
        const baseRadius = radius * 0.3; // Start with a smaller radius
        const maxRadius = radius * 1.2;  // End with a larger radius for expansion
        const heightScale = radius * 1.5; // Total height of the spiral
        
        for (let i = 0; i < count; i++) {
            const t = i / count;
            const angle = turns * Math.PI * 2 * t;
            
            // Make radius expand as the spiral goes outward
            const radiusGrowth = baseRadius + (maxRadius - baseRadius) * (t * t); // Square t for non-linear growth
            const heightPosition = heightScale * (t - 0.5);
            
            // Add some variation to make it more interesting
            const wobble = Math.sin(t * Math.PI * 8) * 0.1; // Add subtle waves to the spiral
            
            const x = radiusGrowth * Math.cos(angle) * (1 + wobble);
            const y = heightPosition;
            const z = radiusGrowth * Math.sin(angle) * (1 + wobble);
            
            positions.push(new THREE.Vector3(x, y, z));
        }
        
        return positions;
    }

    function generateShellGeometry(shape, shellRadius) {
        switch(shape) {
            case 'Sphere':
                // Further increase sphere detail for even finer triangulation
                return new THREE.IcosahedronGeometry(shellRadius, 5);
            case 'Cube': {
                // Increase cube segmentation for finer breaking
                const shellSize = shellRadius * 0.85;
                const cubeGeometry = new THREE.BoxGeometry(shellSize * 2, shellSize * 2, shellSize * 2, 16, 16, 16);
                const cubeBufferGeometry = new THREE.BufferGeometry();
                const cubePositions = [];
                const cubeVertices = cubeGeometry.attributes.position.array;
                const indices = cubeGeometry.index.array;
                
                for (let i = 0; i < indices.length; i += 3) {
                    const a = indices[i];
                    const b = indices[i + 1];
                    const c = indices[i + 2];
                    
                    cubePositions.push(
                        cubeVertices[a * 3], cubeVertices[a * 3 + 1], cubeVertices[a * 3 + 2],
                        cubeVertices[b * 3], cubeVertices[b * 3 + 1], cubeVertices[b * 3 + 2],
                        cubeVertices[c * 3], cubeVertices[c * 3 + 1], cubeVertices[c * 3 + 2]
                    );
                }
                
                cubeBufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(cubePositions, 3));
                return cubeBufferGeometry;
            }
            case 'Torus': {
                const majorRadius = shellRadius;
                const minorRadius = shellRadius * 0.4;
                const shellScale = 0.92;
                
                // Further increase torus segmentation
                const torusGeometry = new THREE.TorusGeometry(
                    majorRadius * shellScale, 
                    minorRadius * shellScale * 1.1,
                    64,  // increased radialSegments
                    96   // increased tubularSegments
                );
                
                torusGeometry.rotateX(Math.PI / 2);
                
                const torusBufferGeometry = new THREE.BufferGeometry();
                const torusPositions = [];
                const torusVertices = torusGeometry.attributes.position.array;
                const indices = torusGeometry.index.array;
                
                for (let i = 0; i < indices.length; i += 3) {
                    const a = indices[i];
                    const b = indices[i + 1];
                    const c = indices[i + 2];
                    
                    torusPositions.push(
                        torusVertices[a * 3], torusVertices[a * 3 + 1], torusVertices[a * 3 + 2],
                        torusVertices[b * 3], torusVertices[b * 3 + 1], torusVertices[b * 3 + 2],
                        torusVertices[c * 3], torusVertices[c * 3 + 1], torusVertices[c * 3 + 2]
                    );
                }
                
                torusBufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(torusPositions, 3));
                return torusBufferGeometry;
            }
            case 'Spiral': {
                const spiralGeometry = new THREE.BufferGeometry();
                const vertices = [];
                const turns = 5;
                const segments = 180; // Increased for smoother spiral
                const tubeSegments = 8; // Segments around the tube
                const tubeRadius = 0.2; // Radius of the spiral's tube
                const baseRadius = shellRadius * 0.3;
                const maxRadius = shellRadius * 1.2;
                const heightScale = shellRadius * 1.5;
                
                // Generate vertices for the spiral tube
                for (let i = 0; i <= segments; i++) {
                    const t = i / segments;
                    const angle = turns * Math.PI * 2 * t;
                    const radiusGrowth = baseRadius + (maxRadius - baseRadius) * (t * t);
                    const heightPosition = heightScale * (t - 0.5);
                    const wobble = Math.sin(t * Math.PI * 8) * 0.1;
                    
                    // Create a ring of vertices around the spiral's path
                    for (let j = 0; j < tubeSegments; j++) {
                        const tubeAngle = (j / tubeSegments) * Math.PI * 2;
                        const tubeGrowth = tubeRadius * (0.5 + t * 0.8); // Tube gets thicker as spiral expands
                        
                        // Calculate position on the tube's surface
                        const ringX = Math.cos(tubeAngle) * tubeGrowth;
                        const ringY = Math.sin(tubeAngle) * tubeGrowth;
                        
                        // Position the ring along the spiral's path
                        const spiralX = radiusGrowth * Math.cos(angle) * (1 + wobble);
                        const spiralY = heightPosition;
                        const spiralZ = radiusGrowth * Math.sin(angle) * (1 + wobble);
                        
                        // Transform ring position to spiral position
                        const transformedX = spiralX + ringX * Math.cos(angle);
                        const transformedY = spiralY + ringY;
                        const transformedZ = spiralZ + ringX * Math.sin(angle);
                        
                        vertices.push(transformedX, transformedY, transformedZ);
                    }
                }
                
                // Create triangles from vertices
                const indices = [];
                for (let i = 0; i < segments; i++) {
                    for (let j = 0; j < tubeSegments; j++) {
                        const current = i * tubeSegments + j;
                        const next = i * tubeSegments + ((j + 1) % tubeSegments);
                        const nextRow = (i + 1) * tubeSegments + j;
                        const nextRowNext = (i + 1) * tubeSegments + ((j + 1) % tubeSegments);
                        
                        // Create two triangles for each quad
                        indices.push(current, next, nextRow);
                        indices.push(next, nextRowNext, nextRow);
                    }
                }
                
                // Create the final geometry
                const spiralBufferGeometry = new THREE.BufferGeometry();
                const trianglePositions = [];
                
                // Convert indexed geometry to non-indexed triangles for breaking
                for (let i = 0; i < indices.length; i += 3) {
                    const a = indices[i];
                    const b = indices[i + 1];
                    const c = indices[i + 2];
                    
                    trianglePositions.push(
                        vertices[a * 3], vertices[a * 3 + 1], vertices[a * 3 + 2],
                        vertices[b * 3], vertices[b * 3 + 1], vertices[b * 3 + 2],
                        vertices[c * 3], vertices[c * 3 + 1], vertices[c * 3 + 2]
                    );
                }
                
                spiralBufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trianglePositions, 3));
                return spiralBufferGeometry;
            }
        }
    }

    function breakTriangle(triangle, impactPoint) {
        triangle.userData.broken = true;
        triangle.material.transparent = true;
        
        // Calculate explosion direction from impact point with more precision
        const direction = triangle.userData.center.clone().sub(impactPoint).normalize();
        
        // Add even finer randomness to the explosion
        direction.add(new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,  // further reduced random factor
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
        ));
        
        // Adjust velocity based on distance with an even sharper falloff
        const distance = triangle.userData.center.distanceTo(impactPoint);
        const breakRadius = radius * 0.15; // further reduced break radius
        const speed = 0.1 * Math.pow(1 - Math.min(distance / breakRadius, 1), 3); // cubic falloff
        triangle.userData.velocity.copy(direction).multiplyScalar(speed);
        
        // Add more controlled rotational energy with distance-based dampening
        const rotationFactor = 1.2 + Math.random() * 0.3 + Math.pow(1 - distance / breakRadius, 2);
        triangle.userData.rotationSpeed *= rotationFactor;
        
        // Enhanced inward collapse effect
        const collapseVector = triangle.userData.center.clone().normalize().multiplyScalar(-0.03);
        triangle.userData.velocity.add(collapseVector);
        
        // Add slight spiral effect to the fragments
        const spiralAxis = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
        const spiralForce = new THREE.Vector3().crossVectors(direction, spiralAxis).multiplyScalar(0.02);
        triangle.userData.velocity.add(spiralForce);
    }

    // Add magnetic field system
    const magneticFields = [];
    const NUM_MAGNETIC_FIELDS = 4;
    
    class MagneticField {
        constructor() {
            this.position = new THREE.Vector3(
                (Math.random() - 0.5) * radius * 2,
                (Math.random() - 0.5) * radius * 2,
                (Math.random() - 0.5) * radius * 2
            );
            this.strength = 0.5 + Math.random() * 0.5; // Increased strength
            this.radius = radius * (0.8 + Math.random() * 0.4); // Increased radius
            this.phase = Math.random() * Math.PI * 2;
            this.frequency = 0.3 + Math.random() * 0.4; // Increased frequency
        }

        update(time) {
            const t = time * this.frequency;
            this.position.x = Math.sin(t + this.phase) * radius * 0.8;
            this.position.y = Math.cos(t * 1.3 + this.phase) * radius * 0.8;
            this.position.z = Math.sin(t * 0.7 + this.phase) * radius * 0.8;
        }
    }

    // Initialize magnetic fields
    for (let i = 0; i < NUM_MAGNETIC_FIELDS; i++) {
        magneticFields.push(new MagneticField());
    }

    function createTrailGeometry(startPoint, endPoint, numPoints = 50) {
        const points = [];
        const colors = [];
        
        for (let i = 0; i < numPoints; i++) {
            const t = i / (numPoints - 1);
            const point = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);
            
            // Apply magnetic influence to each point
            let totalInfluence = new THREE.Vector3();
            
            magneticFields.forEach(field => {
                const distanceToField = point.distanceTo(field.position);
                if (distanceToField < field.radius) {
                    const toField = field.position.clone().sub(point).normalize();
                    const strength = (1 - distanceToField / field.radius) * field.strength;
                    
                    // Create a perpendicular influence for swirling effect
                    const perpendicular = new THREE.Vector3(
                        -toField.z,
                        toField.y,
                        toField.x
                    ).multiplyScalar(strength * 0.5);
                    
                    // Combine direct pull and swirl
                    totalInfluence.add(toField.multiplyScalar(strength));
                    totalInfluence.add(perpendicular);
                }
            });
            
            // Scale influence based on position in trail
            totalInfluence.multiplyScalar(Math.sin(t * Math.PI) * 0.5);
            
            // Apply influence to point
            point.add(totalInfluence);
            
            points.push(point);
            
            // Calculate color based on distance from center
            const radiusAtPoint = point.length();
            const color = getColorForRadius(radiusAtPoint);
            colors.push(color.r, color.g, color.b);
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        return geometry;
    }

    function regenerateShape() {
        scene.remove(lightGroup);
        scene.remove(shellGroup);
        
        lightGroup = new THREE.Group();
        shellGroup = new THREE.Group();
        scene.add(lightGroup);
        scene.add(shellGroup);
        
        triangles.length = 0;
        
        let nodePositions;
        switch(currentShape) {
            case 'Sphere': nodePositions = generateSpherePositions(numLights); break;
            case 'Cube': nodePositions = generateCubePositions(numLights); break;
            case 'Torus': 
                nodePositions = generateTorusPositions(numLights);
                shellGroup.rotation.x = -Math.PI / 2; // Rotate shell group to match nodes
                break;
            case 'Spiral': nodePositions = generateSpiralPositions(numLights); break;
        }
        
        // Create nodes at new positions
        nodePositions.forEach(pos => {
            const color = getColorForRadius(pos.length());
            
    const lightSphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.025, 8, 8),
                new THREE.MeshBasicMaterial({
                    color,
                    transparent: true,
                    opacity: 0.85,
                    blending: THREE.AdditiveBlending
                })
            );
            
    lightSphere.position.copy(pos);
            lightSphere.userData = {
                originalPosition: pos.clone(),
                speed: 0.0008 + (Math.random() * 0.0008),
                phase: Math.random() * Math.PI * 2,
                sphereRadius: pos.length()
            };
            
            // Create trail
            const endPoint = pos.clone().multiplyScalar(1 - trailLength);
            const trailGeometry = createTrailGeometry(pos, endPoint);
            const trail = new THREE.Line(trailGeometry, lineMaterial);
            
            lightSphere.userData.line = trail;
            lightGroup.add(trail);
            lightGroup.add(lightSphere);
        });
        
        // Use consistent shell scaling
        const shellRadius = radius;
        const shellGeometry = generateShellGeometry(currentShape, shellRadius);
        
        const shellPositions = shellGeometry.attributes.position.array;
        for (let i = 0; i < shellPositions.length; i += 9) {
            const triangleGeometry = new THREE.BufferGeometry();
            const vertices = new Float32Array([
                shellPositions[i], shellPositions[i + 1], shellPositions[i + 2],
                shellPositions[i + 3], shellPositions[i + 4], shellPositions[i + 5],
                shellPositions[i + 6], shellPositions[i + 7], shellPositions[i + 8]
            ]);
            
            triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            
            const triangle = new THREE.Mesh(triangleGeometry, shellMaterial.clone());
            triangle.material.transparent = true;
            
            const center = new THREE.Vector3(
                (vertices[0] + vertices[3] + vertices[6]) / 3,
                (vertices[1] + vertices[4] + vertices[7]) / 3,
                (vertices[2] + vertices[5] + vertices[8]) / 3
            );
            
            triangle.userData = {
                originalPosition: vertices.slice(),
                velocity: new THREE.Vector3(),
                rotationAxis: new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).normalize(),
                rotationSpeed: Math.random() * 0.02,
                broken: false,
                center: center
            };
            
            triangles.push(triangle);
            shellGroup.add(triangle);
        }
    }

    // Click handling
    const raycaster = new THREE.Raycaster();
    raycaster.params.Line.threshold = 0.1; // Increase threshold for easier targeting
    const mouse = new THREE.Vector2();
    let highlightedNode = null;

    // Track mouse position for hover effect
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(lightGroup.children.filter(obj => obj instanceof THREE.Mesh));

        // Reset previously highlighted node
        if (highlightedNode) {
            highlightedNode.material.opacity = 0.85;
            highlightedNode.scale.set(1, 1, 1);
        }

        // Highlight new node
        if (intersects.length > 0) {
            const node = intersects[0].object;
            node.material.opacity = 1;
            node.scale.set(1.5, 1.5, 1.5);
            highlightedNode = node;
            document.body.style.cursor = 'pointer';
        } else {
            highlightedNode = null;
            document.body.style.cursor = 'default';
        }
    });

    // Simple click to delete
    window.addEventListener('click', (event) => {
        if (event.shiftKey) return; // Let shift+drag handling take care of this

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(lightGroup.children.filter(obj => obj instanceof THREE.Mesh));

        if (intersects.length > 0) {
            const selectedSphere = intersects[0].object;
            const spherePos = selectedSphere.position;
            const line = selectedSphere.userData.line;
            
            lightGroup.remove(selectedSphere);
            if (line) lightGroup.remove(line);

            const breakRadius = radius * 0.15;
            triangles.forEach(triangle => {
                if (!triangle.userData.broken) {
                    const distance = spherePos.distanceTo(triangle.userData.center);
                    if (distance < breakRadius) {
                        breakTriangle(triangle, spherePos);
                    }
                }
            });

            highlightedNode = null;
            document.body.style.cursor = 'default';
        }
    });

    // Reset cursor when mouse leaves window
    window.addEventListener('mouseleave', () => {
        if (highlightedNode) {
            highlightedNode.material.opacity = 0.85;
            highlightedNode.scale.set(1, 1, 1);
            highlightedNode = null;
        }
        document.body.style.cursor = 'default';
    });

    // Batch deletion with Shift+Drag
let startPoint = null;
let endPoint = null;

const overlay = document.createElement('div');
overlay.style.position = 'absolute';
overlay.style.border = '1px dashed red';
overlay.style.pointerEvents = 'none';
overlay.style.display = 'none';
document.body.appendChild(overlay);

window.addEventListener('mousedown', (event) => {
    if (event.shiftKey) {
        startPoint = { x: event.clientX, y: event.clientY };
        overlay.style.left = `${startPoint.x}px`;
        overlay.style.top = `${startPoint.y}px`;
        overlay.style.width = '0px';
        overlay.style.height = '0px';
        overlay.style.display = 'block';
    }
});

window.addEventListener('mousemove', (event) => {
    if (startPoint && event.shiftKey) {
        const x = Math.min(event.clientX, startPoint.x);
        const y = Math.min(event.clientY, startPoint.y);
        const width = Math.abs(event.clientX - startPoint.x);
        const height = Math.abs(event.clientY - startPoint.y);
        overlay.style.left = `${x}px`;
        overlay.style.top = `${y}px`;
        overlay.style.width = `${width}px`;
        overlay.style.height = `${height}px`;
    }
});

window.addEventListener('mouseup', (event) => {
    if (startPoint && event.shiftKey) {
        endPoint = { x: event.clientX, y: event.clientY };

        const minX = Math.min(startPoint.x, endPoint.x);
        const maxX = Math.max(startPoint.x, endPoint.x);
        const minY = Math.min(startPoint.y, endPoint.y);
        const maxY = Math.max(startPoint.y, endPoint.y);

        const selected = [];
        lightGroup.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                const vector = child.position.clone().project(camera);
                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight;
                if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
                    selected.push(child);
                }
            }
        });

        selected.forEach(obj => {
            const line = obj.userData.line;
                const spherePos = obj.position.clone();
            lightGroup.remove(obj);
            if (line) lightGroup.remove(line);

                triangles.forEach(triangle => {
                    if (!triangle.userData.broken) {
                        const distance = spherePos.distanceTo(triangle.userData.center);
                        if (distance < radius * 0.15) { // Match the new break radius
                            breakTriangle(triangle, spherePos);
                        }
                    }
                });
        });

        overlay.style.display = 'none';
        startPoint = null;
        endPoint = null;
    }
});

function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    // Update magnetic fields
    magneticFields.forEach(field => field.update(time));
    
    // Star twinkling
    const colors = starGeometry.attributes.color.array;
    for (let i = 0; i < starCount; i++) {
        const idx = i * 3;
        const twinkle = Math.sin(time + i) * 0.1 + 0.9;
        const baseIntensity = 0.3 + Math.random() * 0.3;
        colors[idx] = baseIntensity * twinkle;
        colors[idx + 1] = baseIntensity * twinkle;
        colors[idx + 2] = (baseIntensity + Math.random() * 0.2) * twinkle;
    }
    starGeometry.attributes.color.needsUpdate = true;

    // Update nodes and trails
    lightGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
            const userData = child.userData;
            const originalPos = userData.originalPosition;
            
            const newPos = originalPos.clone();
            const sphereRadius = userData.sphereRadius;
            
            const theta = time * 0.15 + userData.phase;
            const phi = time * 0.25 + userData.phase;
            
            newPos.x += Math.sin(theta) * 0.08;
            newPos.y += Math.cos(phi) * 0.08;
            newPos.z += Math.sin(theta + phi) * 0.08;
            
            newPos.normalize().multiplyScalar(sphereRadius);
            child.position.copy(newPos);

            // Update trail
            if (userData.line) {
                const endPoint = newPos.clone().multiplyScalar(1 - trailLength);
                const newGeometry = createTrailGeometry(newPos, endPoint);
                userData.line.geometry.dispose();
                userData.line.geometry = newGeometry;
            }
        }
    });

    // Animate shell triangles
    triangles.forEach(triangle => {
        if (triangle.userData.broken) {
            triangle.position.add(triangle.userData.velocity);
            triangle.userData.velocity.y -= 0.001;
            
            triangle.rotateOnAxis(triangle.userData.rotationAxis, triangle.userData.rotationSpeed);
            
            triangle.material.opacity *= 0.99;
            
            if (triangle.material.opacity < 0.01 || triangle.position.length() > radius * 3) {
                shellGroup.remove(triangle);
                const index = triangles.indexOf(triangle);
                if (index > -1) {
                    triangles.splice(index, 1);
                }
            }
        } else {
            const floatOffset = Math.sin(time + triangle.userData.rotationSpeed * 10) * 0.002;
            const vertices = triangle.userData.originalPosition;
            for (let i = 0; i < vertices.length; i += 3) {
                triangle.geometry.attributes.position.array[i] = vertices[i] * (1 + floatOffset);
                triangle.geometry.attributes.position.array[i + 1] = vertices[i + 1] * (1 + floatOffset);
                triangle.geometry.attributes.position.array[i + 2] = vertices[i + 2] * (1 + floatOffset);
            }
            triangle.geometry.attributes.position.needsUpdate = true;
        }
    });

    controls.update();
    renderer.render(scene, camera);
}
    
animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Initialize with sphere shape
    regenerateShape();

    // Add state capture button to controls
    const captureButton = document.createElement('button');
    captureButton.textContent = 'Capture 10 Random States';
    captureButton.style.padding = '8px 16px';
    captureButton.style.backgroundColor = '#4facfe';
    captureButton.style.color = 'white';
    captureButton.style.border = 'none';
    captureButton.style.borderRadius = '4px';
    captureButton.style.cursor = 'pointer';
    captureButton.style.transition = 'all 0.3s ease';
    captureButton.style.marginTop = '10px';
    
    captureButton.addEventListener('mouseover', () => {
        captureButton.style.backgroundColor = '#45a0f5';
    });
    
    captureButton.addEventListener('mouseout', () => {
        captureButton.style.backgroundColor = '#4facfe';
    });
    
    controls_div.appendChild(captureButton);

    // Function to generate a random break pattern
    function generateRandomBreaks() {
        // Reset all triangles
        triangles.forEach(triangle => {
            triangle.userData.broken = false;
            triangle.material.transparent = false;
            triangle.position.set(0, 0, 0);
            triangle.quaternion.set(0, 0, 0, 1);
            triangle.material.opacity = 1;
        });

        // Create random break points
        const numBreaks = 3 + Math.floor(Math.random() * 4); // 3-6 break points
        for (let i = 0; i < numBreaks; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const breakPoint = new THREE.Vector3(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );

            triangles.forEach(triangle => {
                if (!triangle.userData.broken) {
                    const distance = breakPoint.distanceTo(triangle.userData.center);
                    if (distance < radius * 0.3) {
                        breakTriangle(triangle, breakPoint);
                    }
                }
            });
        }
    }

    // Function to randomize node positions while maintaining sphere shape
    function randomizeNodes() {
        lightGroup.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                const userData = child.userData;
                const originalPos = userData.originalPosition;
                
                // Generate random offset
                const offset = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.3
                );
                
                // Apply offset while maintaining radius
                const newPos = originalPos.clone().add(offset);
                newPos.normalize().multiplyScalar(userData.sphereRadius);
                child.position.copy(newPos);

                // Update trail
                if (userData.line) {
                    const endPoint = newPos.clone().multiplyScalar(1 - trailLength);
                    const newGeometry = createTrailGeometry(newPos, endPoint);
                    userData.line.geometry.dispose();
                    userData.line.geometry = newGeometry;
                }
            }
        });
    }

    // Function to remove a chunk of nodes around a point
    function removeNodeChunk(center, radius) {
        const nodesToRemove = [];
        lightGroup.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                const distance = child.position.distanceTo(center);
                if (distance < radius) {
                    nodesToRemove.push(child);
                    if (child.userData.line) {
                        lightGroup.remove(child.userData.line);
                    }
                }
            }
        });
        
        nodesToRemove.forEach(node => {
            lightGroup.remove(node);
        });

        // Break shell around the chunk
        triangles.forEach(triangle => {
            if (!triangle.userData.broken) {
                const distance = center.distanceTo(triangle.userData.center);
                if (distance < radius * 1.2) { // Slightly larger radius for shell breaking
                    breakTriangle(triangle, center);
                }
            }
        });
    }

    // Function to check if shell fragments have mostly disappeared
    function areShellFragmentsSettled() {
        let visibleCount = 0;
        let totalBroken = 0;
        
        triangles.forEach(triangle => {
            if (triangle.userData.broken) {
                totalBroken++;
                if (triangle.material.opacity > 0.15) { // Count fragments that are still visible
                    visibleCount++;
                }
            }
        });
        
        // Return true if at least 85% of broken fragments have faded
        return totalBroken === 0 || (visibleCount / totalBroken) < 0.15;
    }

    // Modified save function to wait for shell fragments
    function saveAsImage(index) {
        return new Promise(resolve => {
            const checkAndSave = () => {
                if (areShellFragmentsSettled()) {
                    // Render the scene
                    renderer.render(scene, camera);
                    
                    // Create a link element
                    const link = document.createElement('a');
                    link.download = `sphere-state-${index + 1}.png`;
                    
                    // Convert the canvas to a data URL and trigger download
                    link.href = renderer.domElement.toDataURL('image/png');
                    link.click();
                    
                    // Wait a bit before resolving to ensure download starts
                    setTimeout(resolve, 200);
                } else {
                    // Check again in a short while
                    setTimeout(checkAndSave, 100);
                }
            };
            
            checkAndSave();
        });
    }

    // Modified capture function to create two chunks and wait for settling
    async function captureRandomStates() {
        // Store original camera position
        const originalPosition = camera.position.clone();
        
        // Set camera to fixed position for consistent shots
        camera.position.set(8, 0, 0);
        camera.lookAt(0, 0, 0);
        
        // Disable controls during capture
        controls.enabled = false;
        captureButton.disabled = true;
        captureButton.style.opacity = '0.5';
        captureButton.textContent = 'Capturing...';

        // Force sphere shape
        currentShape = 'Sphere';
        
        // Generate and save 10 states
        for (let i = 0; i < 10; i++) {
            // Regenerate fresh sphere for each shot
            regenerateShape();
            
            // Wait a moment for the shape to stabilize
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Create first chunk
            const theta1 = Math.random() * Math.PI * 2;
            const phi1 = Math.acos(2 * Math.random() - 1);
            const chunkCenter1 = new THREE.Vector3(
                radius * Math.sin(phi1) * Math.cos(theta1),
                radius * Math.sin(phi1) * Math.sin(theta1),
                radius * Math.cos(phi1)
            );
            removeNodeChunk(chunkCenter1, radius * 0.4);
            
            // Create second chunk at least 90 degrees away
            let theta2, phi2;
            do {
                theta2 = Math.random() * Math.PI * 2;
                phi2 = Math.acos(2 * Math.random() - 1);
            } while (
                Math.abs(theta2 - theta1) < Math.PI / 2 &&
                Math.abs(phi2 - phi1) < Math.PI / 2
            );
            
            const chunkCenter2 = new THREE.Vector3(
                radius * Math.sin(phi2) * Math.cos(theta2),
                radius * Math.sin(phi2) * Math.sin(theta2),
                radius * Math.cos(phi2)
            );
            removeNodeChunk(chunkCenter2, radius * 0.4);
            
            // Wait for shell fragments to mostly disappear
            await new Promise(resolve => {
                const checkFragments = () => {
                    if (areShellFragmentsSettled()) {
                        resolve();
                    } else {
                        setTimeout(checkFragments, 100);
                    }
                };
                checkFragments();
            });
            
            // Save the image
            await saveAsImage(i);
        }
        
        // Restore camera and controls
        camera.position.copy(originalPosition);
        controls.enabled = true;
        captureButton.disabled = false;
        captureButton.style.opacity = '1';
        captureButton.textContent = 'Capture 10 Random States';
        
        // Regenerate one last time to restore the sphere
        regenerateShape();
    }

    // Add click handler for capture button
    captureButton.addEventListener('click', captureRandomStates);

    // Add screenshot button to controls
    const snapButton = document.createElement('button');
    snapButton.textContent = '📸 Snap Screenshot';
    snapButton.style.padding = '8px 16px';
    snapButton.style.backgroundColor = '#4facfe';
    snapButton.style.color = 'white';
    snapButton.style.border = 'none';
    snapButton.style.borderRadius = '4px';
    snapButton.style.cursor = 'pointer';
    snapButton.style.transition = 'all 0.3s ease';
    snapButton.style.marginTop = '10px';
    snapButton.style.display = 'flex';
    snapButton.style.alignItems = 'center';
    snapButton.style.gap = '5px';
    
    snapButton.addEventListener('mouseover', () => {
        snapButton.style.backgroundColor = '#45a0f5';
    });
    
    snapButton.addEventListener('mouseout', () => {
        snapButton.style.backgroundColor = '#4facfe';
    });
    
    controls_div.appendChild(snapButton);

    // Function to save current view as image
    function saveAsImage() {
        // Create timestamp for filename
        const date = new Date();
        const timestamp = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${date.getHours().toString().padStart(2,'0')}${date.getMinutes().toString().padStart(2,'0')}${date.getSeconds().toString().padStart(2,'0')}`;
        
        // Render the scene
        renderer.render(scene, camera);
        
        // Create a link element
        const link = document.createElement('a');
        link.download = `orb-${timestamp}.png`;
        
        // Convert the canvas to a data URL and trigger download
        link.href = renderer.domElement.toDataURL('image/png');
        link.click();

        // Visual feedback
        snapButton.style.backgroundColor = '#28a745';
        snapButton.textContent = '✓ Saved!';
        setTimeout(() => {
            snapButton.style.backgroundColor = '#4facfe';
            snapButton.textContent = '📸 Snap Screenshot';
        }, 1000);
    }

    // Add click handler for snap button
    snapButton.addEventListener('click', saveAsImage);
}
