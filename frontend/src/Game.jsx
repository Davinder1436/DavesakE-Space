import { Canvas } from '@react-three/fiber'
import { Sky, PointerLockControls } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { Suspense } from 'react'
import Player from './components/Player'
import Ground from './components/Ground'
import MapElements from './components/MapElements'
import './Game.css'

function Game() {
  return (
    <div className="game-container">
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000 }}
        style={{ background: '#87CEEB' }}
      >
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[50, 50, 25]}
          castShadow
          intensity={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        
        <Suspense fallback={null}>
          <Physics gravity={[0, -30, 0]}>
            <Player />
            <Ground />
            <MapElements />
          </Physics>
        </Suspense>
        
        <PointerLockControls />
      </Canvas>
      
      <div className="crosshair">+</div>
      <div className="instructions">
        <p>Click to play</p>
        <p>WASD - Move | SPACE - Jump | Mouse - Look around</p>
      </div>
    </div>
  )
}

export default Game
