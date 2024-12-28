# 2048 Game

A modern implementation of the classic 2048 puzzle game built with Next.js and TypeScript.

## Features

- 🎮 Multiple input methods:
  - Keyboard arrows
  - Touch swipe gestures
  - Mouse drag
- 🎯 Score tracking with local storage persistence
- ↩️ Undo functionality
- 🎨 Modern UI with smooth animations
- 📱 Fully responsive design
- 🏆 Win/lose state management

## Technical Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **Animations**: Tailwind CSS transitions

## Architecture

The project follows a modular architecture with clear separation of concerns:

```
├── app/
│   ├── page.tsx           # Main game component
│   └── globals.css        # Global styles
├── components/
│   └── ui/               # Reusable UI components
├── hooks/
│   ├── use-mouse.ts      # Mouse drag controls
│   └── use-touch.ts      # Touch swipe controls
├── lib/
│   ├── game/
│   │   ├── types.ts      # Game type definitions
│   │   ├── constants.ts  # Game constants
│   │   ├── grid.ts       # Grid operations
│   │   ├── core.ts       # Core game logic
│   │   └── utils.ts      # Utility functions
│   └── styles.ts         # Style utilities
```

## Game Logic

The game implements the following key features:

1. **Grid Management**
   - 4x4 grid with tile merging
   - Random tile generation (2 or 4)
   - Grid rotation for directional moves

2. **Movement System**
   - Tile sliding and merging
   - Chain reactions for multiple merges
   - Movement validation

3. **State Management**
   - Score tracking
   - Best score persistence
   - Undo history
   - Win/lose conditions

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

MIT License - feel free to use this code for your own projects!