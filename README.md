# 🌈 Rainbow Orb

An interactive 3D visualization featuring a dynamic orb that can transform between different shapes, with colorful nodes, trailing lines, and a breakable shell.

## 🚀 Features

### Shape Modes
- **Sphere**: A perfect spherical formation
- **Cube**: A cubic arrangement with nodes on all faces
- **Torus**: A donut-shaped configuration
- **Spiral**: An expanding spiral pattern

### Interactive Elements
- **Node Interaction**: Click any node to destroy it and break the surrounding shell
- **Batch Deletion**: Hold Shift and drag to select and remove multiple nodes
- **Color Control**: Use the hue slider to shift the color palette of all nodes and trails
- **Screenshot**: Capture the current state with the "📸 Snap Screenshot" button

### Visual Effects
- **Trailing Lines**: Each node leaves a colorful trail that follows its movement
- **Breaking Shell**: Black shell that fragments and flies apart when nodes are destroyed
- **Dynamic Movement**: Nodes gently float and move in patterns
- **Starfield Background**: Dynamic star field that adds depth to the visualization

## 🛠️ Installation

1. Make sure you have Node.js installed on your system
2. Clone this repository:
   ```bash
   git clone [repository-url]
   cd rainbow-orb
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🎮 How to Use

### Basic Controls
- **Rotate View**: Click and drag with the left mouse button
- **Pan View**: Click and drag with the right mouse button
- **Zoom**: Use the mouse wheel
- **Reset View**: Double-click the background

### Shape Selection
Use the buttons at the top-left to switch between different shapes:
- Click "Sphere" for the classic orb shape
- Click "Cube" for a cubic arrangement
- Click "Torus" for a donut shape
- Click "Spiral" for an expanding spiral pattern

### Node Interaction
1. **Single Node Deletion**:
   - Left-click any node to destroy it
   - Each click removes exactly one node
   - The surrounding black shell will break and fly apart
   - Perfect for precise, artistic removal of nodes

2. **Multiple Node Selection** (Batch Mode):
   - Hold Shift key
   - Left-click and drag to create a selection box
   - All nodes within the box will be removed when you release
   - Useful for removing many nodes at once

3. **Camera Control vs Node Deletion**:
   - Left-click + drag on empty space: Rotate camera
   - Left-click on node: Remove node
   - Right-click + drag: Pan camera
   - Mouse wheel: Zoom in/out

### Color Control
1. Use the hue slider to change the color scheme:
   - Slide left/right to shift through the color spectrum
   - Changes affect both nodes and their trails
   - Color gradients are maintained but shifted to the new hue

### Taking Screenshots
1. Set up the view angle you want using mouse controls
2. Create interesting patterns by removing nodes
3. Click the "📸 Snap Screenshot" button
4. The image will automatically download with a timestamp filename

## 🎨 Visual Elements Explained

### Nodes
- Bright, colorful spheres
- Color indicates position (outer nodes different from inner)
- Move in gentle patterns
- Leave trailing lines behind them

### Trails
- Connect to each node
- Fade out behind the node
- Color matches the node's gradient
- Create flowing patterns

### Shell
- Black outer surface
- Breaks into triangular pieces
- Pieces fly away when broken
- Gradually fade out

### Background
- Starfield effect
- Stars twinkle subtly
- Adds depth to the visualization
- Moves with camera rotation

## 🔧 Performance Tips

1. If experiencing lag:
   - Reduce browser window size
   - Let broken shell pieces fade out before further interaction
   - Use single-node deletion instead of batch deletion
   - Avoid rapid successive deletions

2. For best visual experience:
   - View in a full-screen browser window
   - Use a modern GPU-enabled device
   - Keep some distance between deletion points for better shell breaking effects

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Share your creations

## 📝 License

[Add your license information here] 