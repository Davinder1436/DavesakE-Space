import { useBox } from '@react-three/cannon'

// Wall component - improved materials
function Wall({ position, size, color = "#8B7355" }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: size,
  }))

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshPhongMaterial 
        color={color}
        shininess={5}
      />
    </mesh>
  )
}

// Road component - darker asphalt
function Road({ position, size }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [position[0], position[1] + 0.01, position[2]], // Just above ground to prevent z-fighting
    args: size,
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={size} />
      <meshPhongMaterial 
        color="#2a2a2a"
        shininess={20}
      />
    </mesh>
  )
}

// Garden/Grass patch component
function Garden({ position, size }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [position[0], position[1] + 0.02, position[2]],
    args: size,
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={size} />
      <meshPhongMaterial 
        color="#4a7c3e"
        shininess={3}
      />
    </mesh>
  )
}

// Tree component with collision
function Tree({ position }) {
  // Trunk
  const [trunkRef] = useBox(() => ({
    type: 'Static',
    position: [position[0], position[1] + 1.5, position[2]],
    args: [0.5, 3, 0.5],
  }))

  // Leaves (collision)
  const [leavesRef] = useBox(() => ({
    type: 'Static',
    position: [position[0], position[1] + 4, position[2]],
    args: [2.5, 2.5, 2.5],
  }))

  return (
    <group>
      {/* Trunk */}
      <mesh ref={trunkRef} castShadow receiveShadow>
        <boxGeometry args={[0.5, 3, 0.5]} />
        <meshPhongMaterial 
          color="#6b4423"
          shininess={5}
        />
      </mesh>
      
      {/* Leaves - multiple layers for depth */}
      <mesh ref={leavesRef} castShadow receiveShadow>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshPhongMaterial 
          color="#2d5016"
          shininess={10}
        />
      </mesh>
      
      {/* Additional leaf layer for more volume */}
      <mesh position={[position[0], position[1] + 3.5, position[2]]} castShadow>
        <boxGeometry args={[3, 1.5, 3]} />
        <meshPhongMaterial 
          color="#3a6621"
          shininess={10}
        />
      </mesh>
    </group>
  )
}

// Building/House component
function Building({ position, size, color = "#b5651d" }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: size,
  }))

  return (
    <group>
      {/* Main building */}
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshPhongMaterial 
          color={color}
          shininess={20}
        />
      </mesh>
      
      {/* Roof */}
      <mesh position={[position[0], position[1] + size[1]/2 + 0.5, position[2]]} castShadow>
        <boxGeometry args={[size[0] + 1, 1, size[2] + 1]} />
        <meshPhongMaterial 
          color="#8b4513"
          shininess={5}
        />
      </mesh>
    </group>
  )
}

// Main MapElements component
function MapElements() {
  return (
    <group>
      {/* Main Roads - Cross pattern */}
      <Road position={[0, 0, 0]} size={[30, 0.1, 4]} />
      <Road position={[0, 0, 0]} size={[4, 0.1, 30]} />
      
      {/* Secondary roads */}
      <Road position={[15, 0, -10]} size={[10, 0.1, 2]} />
      <Road position={[15, 0, 10]} size={[10, 0.1, 2]} />
      <Road position={[-15, 0, -10]} size={[10, 0.1, 2]} />
      <Road position={[-15, 0, 10]} size={[10, 0.1, 2]} />

      {/* Garden areas */}
      <Garden position={[-15, 0, -15]} size={[10, 0.1, 10]} />
      <Garden position={[15, 0, -15]} size={[10, 0.1, 10]} />
      <Garden position={[-15, 0, 15]} size={[10, 0.1, 10]} />
      <Garden position={[15, 0, 15]} size={[10, 0.1, 10]} />
      
      {/* Small garden patches */}
      <Garden position={[-8, 0, -8]} size={[4, 0.1, 4]} />
      <Garden position={[8, 0, -8]} size={[4, 0.1, 4]} />
      <Garden position={[-8, 0, 8]} size={[4, 0.1, 4]} />
      <Garden position={[8, 0, 8]} size={[4, 0.1, 4]} />

      {/* Perimeter walls */}
      <Wall position={[0, 1.5, -30]} size={[64, 3, 1]} color="#8b7355" />
      <Wall position={[0, 1.5, 30]} size={[64, 3, 1]} color="#8b7355" />
      <Wall position={[-30, 1.5, 0]} size={[1, 3, 60]} color="#8b7355" />
      <Wall position={[30, 1.5, 0]} size={[1, 3, 60]} color="#8b7355" />

      {/* Small walls that players can jump over */}
      <Wall position={[-6, 0.5, -6]} size={[3, 1, 0.5]} color="#a0826d" />
      <Wall position={[6, 0.5, -6]} size={[3, 1, 0.5]} color="#a0826d" />
      <Wall position={[-6, 0.5, 6]} size={[3, 1, 0.5]} color="#a0826d" />
      <Wall position={[6, 0.5, 6]} size={[3, 1, 0.5]} color="#a0826d" />
      
      {/* Additional low walls for variety */}
      <Wall position={[0, 0.4, -15]} size={[6, 0.8, 0.4]} color="#a0826d" />
      <Wall position={[0, 0.4, 15]} size={[6, 0.8, 0.4]} color="#a0826d" />

      {/* Buildings */}
      <Building position={[-22, 3, -22]} size={[6, 6, 6]} color="#c4a673" />
      <Building position={[22, 3, -22]} size={[6, 6, 6]} color="#b5a17d" />
      <Building position={[-22, 3, 22]} size={[6, 6, 6]} color="#c9ad7f" />
      <Building position={[22, 3, 22]} size={[6, 6, 6]} color="#b59368" />
      
      {/* Smaller structures */}
      <Building position={[-18, 2, 0]} size={[4, 4, 4]} color="#d4a574" />
      <Building position={[18, 2, 0]} size={[4, 4, 4]} color="#c49b6a" />

      {/* Trees - more distributed */}
      <Tree position={[-12, 0, -12]} />
      <Tree position={[12, 0, -12]} />
      <Tree position={[-12, 0, 12]} />
      <Tree position={[12, 0, 12]} />
      <Tree position={[-20, 0, 0]} />
      <Tree position={[20, 0, 0]} />
      <Tree position={[0, 0, -20]} />
      <Tree position={[0, 0, 20]} />
      <Tree position={[-8, 0, -18]} />
      <Tree position={[8, 0, 18]} />
      <Tree position={[-16, 0, -8]} />
      <Tree position={[16, 0, -8]} />
      <Tree position={[-16, 0, 8]} />
      <Tree position={[16, 0, 8]} />
      <Tree position={[-25, 0, -15]} />
      <Tree position={[25, 0, 15]} />
    </group>
  )
}

export default MapElements
