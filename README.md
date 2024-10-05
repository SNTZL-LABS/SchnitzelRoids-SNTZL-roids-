# 🚀 SCHNITZEL-ROIDS

SCHNITZEL-ROIDS is an exciting multiplayer asteroid-style game where players pilot spaceships through treacherous asteroid fields, collecting Schnitzels and competing for high scores.

## ✨ Features

- 🎮 Multiplayer real-time gameplay
- 🌠 Asteroid field navigation
- 🍗 Schnitzel collection mechanic
- 🛡️ Player shields and speed-boost abilities
- 🏆 Real-time leaderboard
- 🗺️ Minimap for enhanced navigation
- 📱 Responsive design for various screen sizes
- 🦊 Integration with MetaMask for Ethereum-based rewards

## 🛠️ Technologies Used

- 🟢 Node.js
- 🔌 Socket.IO for real-time communication
- 🎨 HTML5 Canvas for rendering
- 🟨 JavaScript (ES6+)
- 🎭 CSS3 for styling

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v14.0.0 or higher recommended)
- npm (v6.0.0 or higher)
- Modern web browser with WebSocket support

### 💻 Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/schnitzel-roids.git
   cd schnitzel-roids
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   node server.js
   ```

4. Open your web browser and navigate to `http://localhost:3000` (or the port specified in your environment).

## 🕹️ How to Play

1. Enter your name on the login screen.
2. (Optional) Connect your MetaMask wallet for Ethereum-based rewards.
3. Use the following controls to navigate your spaceship:
   - ↑: Thrust
   - Double-tap ↑: Activate boost
   - ←: Turn left
   - →: Turn right
   - ↓: Activate shield
   - Spacebar: Shoot
4. Collect Schnitzels to increase your score.
5. Avoid or destroy asteroids to survive and climb the leaderboard.
6. Use your shield strategically to protect against collisions.
7. Activate boost for quick escapes or to catch up to Schnitzels.
8. Keep an eye on the minimap for situational awareness.

## 🎮 Game Mechanics

- 🌠 **Asteroids**: Come in various sizes and velocities. Larger asteroids split into smaller ones when destroyed.
- 🍗 **Schnitzels**: Special collectibles that increase your score and fuel upgrades.
- 🛡️ **Shield**: Temporary invulnerability with a cooldown period.
- 🚀 **Boost**: Short burst of speed, useful for dodging or chasing.
- 🆙 **Upgrades**: Collect Schnitzels to unlock ship improvements like faster shooting or increased maneuverability.

## 📁 Project Structure

- `server.js`: Main server file, sets up Express and Socket.IO
- `game.js`: Core game logic and state management
- `game-state.js`: Manages and updates the global game state
- `player.js`: Player entity logic and methods
- `asteroid.js`: Asteroid entity logic and methods
- `bullet.js`: Bullet entity logic and methods
- `collision-handler.js`: Manages collision detection and resolution
- `spawn-utils.js`: Utilities for spawning game entities
- `constants.js`: Game-wide constant values
- `public/`: Client-side files
  - `game-client.js`: Main client-side game logic
  - `*-renderer.js`: Rendering logic for various game entities
  - `input-handler.js`: Manages user input and controls
  - `network-handler.js`: Handles client-server communication
  - `ui-renderer.js`: Renders game UI elements
  - `CanvasManager.js`: Manages canvas operations and resizing
  - `PlayerManager.js`: Manages player-related UI and data
  - `PopupManager.js`: Handles in-game popups and modals
  - `MessageManager.js`: Manages in-game messaging system
  - `hitmarker.js`: Handles hit markers for player feedback
  - `*.html`: Game interface and various popup contents
  - `style.css`: Main stylesheet for the game

## 🤝 Contributing

Contributions are welcome!

## 📄 License

This project is licensed under the [MIT License](LICENSE).

**Additional Terms:**
These Additional Terms supplement the MIT License. By using, copying, modifying, or distributing the Software, you agree to comply with these Additional Terms in addition to the MIT License.

No Support Obligation
The copyright holders and contributors are under no obligation to provide technical support, updates, or bug fixes for the Software.

Assumption of Risk
You acknowledge that running the Software on your own server involves inherent risks, including but not limited to security vulnerabilities, data loss, and system instability. You assume all risks associated with installing and using the Software.

Disclaimer of Warranties
The software is provided "As is" and "With all faults," and the entire risk as to satisfactory quality, performance, accuracy, and effort is with you. To the maximum extent permitted by applicable law, the copyright holders and contributors expressly disclaim all warranties of any kind, whether express, implied, statutory or otherwise, including, but not limited to, any warranties of merchantability, fitness for a particular purpose, and non-infringement.

Limitation of Liability
To the maximum extent permitted by applicable law, in no event shall the copyright holders or contributors be liable for any direct, indirect, incidental, special, exemplary, consequential, or punitive damages whatsoever (including, but not limited to, damages for loss of profits, loss of data, business interruption, loss of business information, or any other pecuniary loss) arising out of the use of or inability to use the software, even if advised of the possibility of such damages.

Indemnification
You agree to indemnify, defend, and hold harmless the copyright holders and contributors from and against any and all claims, liabilities, damages, losses, or expenses, including legal fees and costs, arising out of or in any way connected with your access to or use of the Software.

Third-Party Content
The Software may enable access to third-party websites, services, or content. The copyright holders and contributors are not responsible for any third-party content accessed through the Software and make no warranties about the content, accuracy, or reliability of such third-party content.

Compliance with Laws
You are solely responsible for ensuring that your use of the Software complies with all applicable local, state, national, and international laws and regulations.

Severability
If any provision of these Additional Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.

By using the Software, you acknowledge that you have read and understood these Additional Terms and agree to be bound by them.

## 🙏 Acknowledgements

- "Press Start 2P" font by CodeMan38
- All contributors and players of the SCHNITZEL-ROIDS game

## ⚠️ Disclaimer

Please read the [Terms of Service](public/terms-of-service.html) and [Privacy Policy](public/privacy-policy.html) before playing. The in-game "Schnitzels" are virtual assets with no real-world value. SNTZL tokens used for rewards are subject to cryptocurrency regulations and risks.