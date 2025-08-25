<img width="1908" height="842" alt="Screenshot_26" src="https://github.com/user-attachments/assets/830e050f-060e-4b44-9fc9-8ba6609c6213" />


# 3D Multiplayer Racing & City Game

A real-time 3D multiplayer racing and city exploration game built with modern web technologies and blockchain integration. Players can explore a virtual city, participate in races, join clans, and interact with other players in real-time.

## 🎮 Game Features

- **3D City Exploration**: Navigate through a detailed 3D city environment
- **Multiplayer Racing**: Real-time racing with physics simulation
- **Clan System**: Create and join clans with blockchain-based membership
- **VIP Membership**: Premium features through smart contract integration
- **Real-time Chat**: Communicate with other players
- **AI Assistant**: Built-in AI chat for game assistance
- **Location-based Gameplay**: Different zones for racing, socializing, and exploration
- **Flying Cars**: Futuristic vehicle mechanics
- **Physics Simulation**: Realistic 3D physics using Rapier

## 🛠 Technologies Used

### Frontend
- **Svelte 5** - Modern reactive framework
- **TypeScript** - Type-safe development
- **Three.js** - 3D graphics and rendering
- **Threlte** - Svelte wrapper for Three.js
- **Rapier** - Physics simulation engine
- **TailwindCSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **WebSocket** - Real-time communication

### Backend
- **Bun** - Fast JavaScript runtime
- **TypeScript** - Server-side type safety
- **WebSocket** - Real-time multiplayer communication
- **Rapier3D** - Server-side physics simulation
- **GLTF/GLB** - 3D model loading and processing
- **Draco** - 3D model compression

### Blockchain
- **Solidity** - Smart contract development
- **Ethers.js** - Ethereum interaction
- **OpenZeppelin** - Security and standard contracts

### AI Integration
- **Cerebras AI** - AI-powered chat assistant
- **Google Generative AI** - Additional AI capabilities

## 📋 Prerequisites

- **Bun** (latest version)
- **Git**
- **Web3 Wallet** (MetaMask recommended)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd some
```

### 2. Frontend Setup
```bash
cd frontend
bun install
```

### 3. Backend Setup
```bash
cd ../ws
bun install
```

### 4. Environment Configuration

Copy the environment example file:
```bash
cd ../frontend
cp .env.example .env
```

Edit `.env` and configure the following variables:

```env
# Cerebras AI Configuration
# Get your API key from: https://cloud.cerebras.ai/
CEREBRAS_API_KEY=your_actual_cerebras_api_key_here
CEREBRAS_MODEL=gpt-oss-120b

# Development (Vite requires VITE_ prefix for client-side access)
VITE_CEREBRAS_API_KEY=your_actual_cerebras_api_key_here
VITE_CEREBRAS_MODEL=gpt-oss-120b
```

## 🎯 Running the Application

### Development Mode

1. **Start the Backend Server**:
```bash
cd ws
bun run dev
```
The WebSocket server will start on `ws://localhost:4000`

2. **Start the Frontend Development Server**:
```bash
cd frontend
bun run dev
```
The frontend will be available at `http://localhost:5173`

### Production Build

```bash
cd frontend
bun run build
bun run preview
```

## 🎮 Game Controls

- **WASD** - Move player/vehicle
- **Mouse** - Look around
- **Space** - Jump/Brake
- **Shift** - Sprint/Boost
- **Enter** - Open chat
- **ESC** - Open menu

## 🏗 Project Structure

```
some/
├── frontend/                 # Svelte frontend application
│   ├── src/
│   │   ├── components/      # Svelte components
│   │   │   ├── game/       # Game-specific components
│   │   │   ├── ui/         # UI components
│   │   │   └── Canvas.svelte
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Svelte stores
│   │   ├── types/          # TypeScript definitions
│   │   ├── abi/            # Smart contract ABIs
│   │   └── websockets/     # WebSocket client
│   ├── public/             # Static assets (3D models, textures)
│   └── package.json
├── ws/                      # Backend WebSocket server
│   ├── src/
│   │   ├── entities/       # Game entities (vehicles, players)
│   │   ├── events/         # WebSocket event handlers
│   │   ├── gameState/      # Game state management
│   │   ├── locations/      # Location system
│   │   ├── physics/        # Physics simulation
│   │   ├── racing/         # Racing mechanics
│   │   ├── rooms/          # Room management
│   │   ├── types/          # TypeScript definitions
│   │   └── websockets/     # WebSocket server logic
│   └── package.json
└── contracts/               # Smart contracts
    ├── clan.sol            # Clan management contract
    └── vipMembership.sol   # VIP membership contract
```

## 🔗 Smart Contracts

### Clan Management
- Create and manage gaming clans
- Set join prices and member limits
- Clan leadership and member management

### VIP Membership
- Premium membership system
- 30-day membership duration
- 0.1 Sei membership price
- Enhanced game features for VIP members

## 🌐 WebSocket API

The game uses WebSocket for real-time communication:

- **Player Movement**: Real-time position updates
- **Chat Messages**: Instant messaging system
- **Race Events**: Racing mechanics and checkpoints
- **Location Updates**: Zone-based gameplay
- **Vehicle Spawning**: Dynamic vehicle management

## 🎨 3D Assets

The game includes various 3D models:
- City environment (`city-transformed.glb`)
- Vehicles (`car-transformed.glb`)
- Characters (`man-transformed.glb`)
- Props and buildings
- Compressed with Draco for optimal loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Use the in-game AI chat for gameplay assistance

## 🚧 Development Status

This project is actively under development. Features and APIs may change.

---

**Enjoy exploring the virtual city and racing with friends!** 🏎️🌆
