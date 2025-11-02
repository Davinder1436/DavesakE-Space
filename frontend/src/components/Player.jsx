import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import { Vector3 } from 'three'
import usePlayerControls from '../hooks/usePlayerControls'
import AnimatedCharacter from './AnimatedCharacter'

const SPEED = 15 // Increased speed for more realistic movement
const JUMP_FORCE = 12
const PLAYER_HEIGHT = 1.8 // Realistic human height
const CAMERA_DISTANCE = 5 // Distance behind player
const CAMERA_HEIGHT = 2 // Height above player

function Player() {
  const { camera } = useThree()
  const { forward, backward, left, right, jump } = usePlayerControls()
  
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 5, 0],
    args: [0.5], // Collision sphere radius
    fixedRotation: true,
    linearDamping: 0.9,
  }))

  const characterRef = useRef()
  const cameraRotation = useRef({ yaw: 0, pitch: 0 })
  const [characterRotation, setCharacterRotation] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [isJumping, setIsJumping] = useState(false)

  const velocity = useRef([0, 0, 0])
  const position = useRef([0, 5, 0])
  
  useEffect(() => {
    const unsubscribeVelocity = api.velocity.subscribe((v) => {
      velocity.current = v
    })
    const unsubscribePosition = api.position.subscribe((p) => {
      position.current = p
    })
    
    // Handle mouse movement for third-person camera
    const handleMouseMove = (e) => {
      if (document.pointerLockElement) {
        cameraRotation.current.yaw -= e.movementX * 0.002
        cameraRotation.current.pitch -= e.movementY * 0.002
        cameraRotation.current.pitch = Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 3, cameraRotation.current.pitch)
        )
      }
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      unsubscribeVelocity()
      unsubscribePosition()
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [api])

  useFrame(() => {
    // Calculate movement direction based on camera yaw
    const direction = new Vector3()
    const frontVector = new Vector3(
      0,
      0,
      Number(backward) - Number(forward)
    )
    const sideVector = new Vector3(
      Number(left) - Number(right),
      0,
      0
    )

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)

    // Rotate direction based on camera yaw
    const yaw = cameraRotation.current.yaw
    const pitch = cameraRotation.current.pitch
    const rotatedDirection = new Vector3(
      direction.x * Math.cos(yaw) - direction.z * Math.sin(yaw),
      0,
      direction.x * Math.sin(yaw) + direction.z * Math.cos(yaw)
    )

    // Apply horizontal velocity
    api.velocity.set(
      rotatedDirection.x,
      velocity.current[1],
      rotatedDirection.z
    )

    // Check if player is moving
    const moving = forward || backward || left || right
    setIsMoving(moving)
    
    // Check if player is jumping
    setIsJumping(Math.abs(velocity.current[1]) > 0.5)

    // Rotate character to face movement direction
    if (moving) {
      const angle = Math.atan2(rotatedDirection.x, rotatedDirection.z)
      setCharacterRotation(angle)
    }

    // Jump logic
    if (jump && Math.abs(velocity.current[1]) < 0.1) {
      api.velocity.set(
        velocity.current[0],
        JUMP_FORCE,
        velocity.current[2]
      )
    }

    // Third-person camera positioning
    const playerPos = new Vector3(...position.current)

    // Calculate camera position behind and above player
    const cameraOffset = new Vector3(
      Math.sin(yaw) * Math.cos(pitch) * CAMERA_DISTANCE,
      CAMERA_HEIGHT + Math.sin(pitch) * CAMERA_DISTANCE,
      Math.cos(yaw) * Math.cos(pitch) * CAMERA_DISTANCE
    )

    camera.position.copy(playerPos).add(cameraOffset)
    camera.lookAt(playerPos.x, playerPos.y + 1, playerPos.z)
  })

  return (
    <group ref={ref}>
      {/* Animated character model */}
      <AnimatedCharacter 
        position={[0, -0.5, 0]} 
        rotation={characterRotation}
        isMoving={isMoving}
        isJumping={isJumping}
      />
    </group>
  )
}

export default Player
