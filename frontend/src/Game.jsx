import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { Suspense } from 'react'
import Player from './components/Player'
import Ground from './components/Ground'
import MapElements from './components/MapElements'
import './Game.css'

function Game() {
  const handleCanvasClick = () => {
    document.body.requestPointerLock()
  }

  return (
    <div className="game-container">
      <Canvas
        shadows
        camera={{ fov: 45, near: 1, far: 100, position: [-1, 2, 3] }}
        gl={{ antialias: true }}
        onClick={handleCanvasClick}
      >
        {/* Scene background color matching world.html */}
        <color attach="background" args={['#a0a0a0']} />
        
        {/* Fog matching world.html setup */}
        <fog attach="fog" args={['#a0a0a0', 10, 50]} />
        
        {/* Hemisphere Light (sky and ground ambient lighting) */}
        <hemisphereLight 
          args={['#ffffff', '#8d8d8d', 3]} 
          position={[0, 20, 0]} 
        />
        
        {/* Directional Light (sun) with shadows */}
        <directionalLight
          position={[3, 10, 10]}
          intensity={3}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-top={2}
          shadow-camera-bottom={-2}
          shadow-camera-left={-2}
          shadow-camera-right={2}
          shadow-camera-near={0.1}
          shadow-camera-far={40}
        />
        
        <Suspense fallback={null}>
          <Physics gravity={[0, -30, 0]}>
            <Player />
            <Ground />
            <MapElements />
          </Physics>
        </Suspense>
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
