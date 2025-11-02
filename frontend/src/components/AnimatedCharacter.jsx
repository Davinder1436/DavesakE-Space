import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Animated character component with procedural animations
 * This component handles character animations based on movement state
 */
function AnimatedCharacter({ position = [0, 0, 0], rotation = 0, isMoving = false, isJumping = false }) {
  const group = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const bodyRef = useRef()
  const headRef = useRef()
  
  const animationTime = useRef(0)
  
  useFrame((state, delta) => {
    if (!group.current) return
    
    // Update animation time
    if (isMoving) {
      animationTime.current += delta * 8 // Animation speed
    }
    
    const time = animationTime.current
    
    // Arm swing animation
    if (leftArmRef.current && rightArmRef.current) {
      if (isMoving) {
        leftArmRef.current.rotation.x = Math.sin(time) * 0.6
        rightArmRef.current.rotation.x = Math.sin(time + Math.PI) * 0.6
      } else {
        // Smoothly return to idle position
        leftArmRef.current.rotation.x *= 0.9
        rightArmRef.current.rotation.x *= 0.9
      }
    }
    
    // Leg walk animation
    if (leftLegRef.current && rightLegRef.current) {
      if (isMoving) {
        leftLegRef.current.rotation.x = Math.sin(time + Math.PI) * 0.5
        rightLegRef.current.rotation.x = Math.sin(time) * 0.5
      } else {
        leftLegRef.current.rotation.x *= 0.9
        rightLegRef.current.rotation.x *= 0.9
      }
    }
    
    // Body bounce when walking
    if (bodyRef.current && headRef.current) {
      const bounce = isMoving ? Math.abs(Math.sin(time * 2)) * 0.05 : 0
      bodyRef.current.position.y = 0.9 + bounce
      headRef.current.position.y = 1.7 + bounce
    }
    
    // Jump animation
    if (isJumping && bodyRef.current) {
      leftArmRef.current.rotation.x = -0.5
      rightArmRef.current.rotation.x = -0.5
      leftLegRef.current.rotation.x = -0.3
      rightLegRef.current.rotation.x = -0.3
    }
  })
  
  return (
    <group ref={group} position={position} rotation={[0, rotation, 0]}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.6, 1.2, 0.35]} />
        <meshStandardMaterial 
          color="#4a90e2" 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial 
          color="#ffdbac" 
          roughness={0.8}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.12, 1.75, 0.26]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.12, 1.75, 0.26]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Mouth */}
      <mesh position={[0, 1.6, 0.26]} castShadow>
        <boxGeometry args={[0.15, 0.03, 0.03]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
      
      {/* Left Arm - pivot at shoulder */}
      <group position={[-0.475, 1.3, 0]}>
        <mesh 
          ref={leftArmRef}
          position={[0, -0.4, 0]} 
          castShadow
        >
          <boxGeometry args={[0.25, 0.9, 0.25]} />
          <meshStandardMaterial 
            color="#4a90e2" 
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>
      
      {/* Right Arm - pivot at shoulder */}
      <group position={[0.475, 1.3, 0]}>
        <mesh 
          ref={rightArmRef}
          position={[0, -0.4, 0]} 
          castShadow
        >
          <boxGeometry args={[0.25, 0.9, 0.25]} />
          <meshStandardMaterial 
            color="#4a90e2" 
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>
      
      {/* Left Leg - pivot at hip */}
      <group position={[-0.18, 0.5, 0]}>
        <mesh 
          ref={leftLegRef}
          position={[0, -0.4, 0]} 
          castShadow
        >
          <boxGeometry args={[0.25, 0.85, 0.25]} />
          <meshStandardMaterial 
            color="#2c3e50" 
            roughness={0.6}
          />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.8, 0.1]} castShadow>
          <boxGeometry args={[0.27, 0.15, 0.35]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
      </group>
      
      {/* Right Leg - pivot at hip */}
      <group position={[0.18, 0.5, 0]}>
        <mesh 
          ref={rightLegRef}
          position={[0, -0.4, 0]} 
          castShadow
        >
          <boxGeometry args={[0.25, 0.85, 0.25]} />
          <meshStandardMaterial 
            color="#2c3e50" 
            roughness={0.6}
          />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.8, 0.1]} castShadow>
          <boxGeometry args={[0.27, 0.15, 0.35]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
      </group>
    </group>
  )
}

export default AnimatedCharacter
