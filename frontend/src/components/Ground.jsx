import { usePlane } from '@react-three/cannon'

function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    type: 'Static',
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshPhongMaterial 
        color="#cbcbcb" 
        depthWrite={false}
        shininess={10}
      />
    </mesh>
  )
}

export default Ground
