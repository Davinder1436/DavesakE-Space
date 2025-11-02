import { useBox } from '@react-three/cannon'

// Wall component
function Wall({ position, size }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: size,
  }))

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  )
}

// Road component
function Road({ position, size }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [position[0], position[1] - 0.1, position[2]], // Slightly below ground
    args: size,
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#404040" />
    </mesh>
  )
}

// Garden component
function Garden({ position, size }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [position[0], position[1] - 0.1, position[2]],
    args: size,
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#228B22" />
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
    args: [2, 2, 2],
  }))

  return (
    <group>
      {/* Trunk */}
      <mesh ref={trunkRef} castShadow receiveShadow>
        <boxGeometry args={[0.5, 3, 0.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Leaves */}
      <mesh ref={leavesRef} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </group>
  )
}

// Main MapElements component
function MapElements() {
  return (
    <group>
      {/* Roads */}
      <Road position={[0, 0, -10]} size={[20, 0.1, 3]} />
      <Road position={[0, 0, 10]} size={[20, 0.1, 3]} />
      <Road position={[-10, 0, 0]} size={[3, 0.1, 20]} />
      <Road position={[10, 0, 0]} size={[3, 0.1, 20]} />

      {/* Gardens */}
      <Garden position={[-15, 0, -15]} size={[8, 0.1, 8]} />
      <Garden position={[15, 0, -15]} size={[8, 0.1, 8]} />
      <Garden position={[-15, 0, 15]} size={[8, 0.1, 8]} />
      <Garden position={[15, 0, 15]} size={[8, 0.1, 8]} />

      {/* Walls - perimeter */}
      <Wall position={[0, 1, -30]} size={[60, 2, 1]} />
      <Wall position={[0, 1, 30]} size={[60, 2, 1]} />
      <Wall position={[-30, 1, 0]} size={[1, 2, 60]} />
      <Wall position={[30, 1, 0]} size={[1, 2, 60]} />

      {/* Small walls that players can jump over */}
      <Wall position={[-5, 0.5, -5]} size={[3, 1, 0.5]} />
      <Wall position={[5, 0.5, -5]} size={[3, 1, 0.5]} />
      <Wall position={[-5, 0.5, 5]} size={[3, 1, 0.5]} />
      <Wall position={[5, 0.5, 5]} size={[3, 1, 0.5]} />

      {/* Trees */}
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
    </group>
  )
}

export default MapElements
