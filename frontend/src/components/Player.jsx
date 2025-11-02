import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import { Vector3 } from 'three'
import usePlayerControls from '../hooks/usePlayerControls'

const SPEED = 5
const JUMP_FORCE = 10

function Player() {
  const { camera } = useThree()
  const { forward, backward, left, right, jump } = usePlayerControls()
  
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 5, 0],
    args: [0.5], // radius
    fixedRotation: true,
    linearDamping: 0.9,
  }))

  const velocity = useRef([0, 0, 0])
  const position = useRef([0, 5, 0])
  
  useEffect(() => {
    const unsubscribeVelocity = api.velocity.subscribe((v) => {
      velocity.current = v
    })
    const unsubscribePosition = api.position.subscribe((p) => {
      position.current = p
    })
    
    return () => {
      unsubscribeVelocity()
      unsubscribePosition()
    }
  }, [api])

  useFrame(() => {
    // Update camera position to follow player
    camera.position.set(
      position.current[0],
      position.current[1] + 0.6,
      position.current[2]
    )

    // Calculate movement direction based on camera rotation
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
      .applyEuler(camera.rotation)

    // Apply horizontal velocity
    api.velocity.set(
      direction.x,
      velocity.current[1],
      direction.z
    )

    // Jump logic - only jump if not already jumping (velocity.y close to 0)
    if (jump && Math.abs(velocity.current[1]) < 0.1) {
      api.velocity.set(
        velocity.current[0],
        JUMP_FORCE,
        velocity.current[2]
      )
    }
  })

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="blue" transparent opacity={0} />
    </mesh>
  )
}

export default Player
