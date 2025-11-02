# How to Add a GLTF 3D Character Model

Currently, the game uses a procedurally animated blocky character. If you want to use a proper 3D animated model (like the one from the `char.html` example), follow these steps:

## Step 1: Get a 3D Character Model

You can get free animated character models from:
- **Mixamo** (https://www.mixamo.com/) - Free rigged characters with animations
- **Sketchfab** (https://sketchfab.com/) - Many free models with CC licenses
- **Ready Player Me** (https://readyplayer.me/) - Create custom avatars

### For Mixamo:
1. Go to https://www.mixamo.com/
2. Browse and select a character
3. Download the character with the "T-pose" or "A-pose"
4. Then download animations separately:
   - Idle
   - Walk
   - Run
   - Jump
5. Download as FBX for Unity (.fbx) or GLB/GLTF format

## Step 2: Convert to GLTF (if needed)

If your model is in FBX format, convert it to GLTF:
- Use online converter: https://products.aspose.app/3d/conversion/fbx-to-gltf
- Or use Blender: Import FBX → Export as GLTF/GLB

## Step 3: Add Model to Project

1. Place your `.glb` or `.gltf` file in: `/frontend/public/models/character.glb`
2. If you have animations as separate files, put them in the same folder

## Step 4: Update AnimatedCharacter Component

Replace the content of `/frontend/src/components/AnimatedCharacter.jsx` with:

\`\`\`jsx
import { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { SkeletonUtils } from 'three-stdlib'
import { useGraph } from '@react-three/fiber'

function AnimatedCharacter({ position = [0, 0, 0], rotation = 0, isMoving = false, isJumping = false }) {
  const group = useRef()
  
  // Load the GLTF model
  const { scene, animations } = useGLTF('/models/character.glb')
  
  // Clone the scene to allow multiple instances
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  
  // Setup animations
  const { actions, mixer } = useAnimations(animations, group)
  
  // Animation state management
  useEffect(() => {
    if (!actions) return
    
    // Play appropriate animation based on state
    if (isJumping && actions.jump) {
      actions.jump.reset().fadeIn(0.1).play()
    } else if (isMoving && actions.walk) {
      actions.walk.reset().fadeIn(0.2).play()
    } else if (actions.idle) {
      actions.idle.reset().fadeIn(0.2).play()
    }
    
    // Cleanup - fade out all other animations
    return () => {
      Object.values(actions).forEach(action => action.fadeOut(0.2))
    }
  }, [actions, isMoving, isJumping])
  
  return (
    <group ref={group} position={position} rotation={[0, rotation, 0]} dispose={null}>
      <primitive object={clone} scale={1} />
    </group>
  )
}

// Preload the model
useGLTF.preload('/models/character.glb')

export default AnimatedCharacter
\`\`\`

## Step 5: Adjust Scale and Position

You may need to adjust the scale and position in the Player component:

\`\`\`jsx
<AnimatedCharacter 
  position={[0, -1, 0]}  // Adjust Y position
  rotation={characterRotation}
  isMoving={isMoving}
  isJumping={isJumping}
  scale={0.01}  // Add scale if model is too big/small
/>
\`\`\`

## Step 6: Animation Names

Make sure the animation names in your GLTF file match what's used in the code:
- `idle` - Standing still
- `walk` - Walking animation
- `run` - Running animation (optional)
- `jump` - Jump animation (optional)

You can inspect animation names by logging them:
\`\`\`jsx
console.log('Available animations:', animations.map(a => a.name))
\`\`\`

## Troubleshooting

### Model is too big/small
Adjust the scale in the Player component or in the AnimatedCharacter component.

### Model is in wrong position
Adjust the Y position in the Player component where AnimatedCharacter is used.

### Animations not playing
1. Check that animations are included in the GLTF file
2. Verify animation names match what's in the code
3. Check browser console for errors

### Model is black or has no texture
Make sure textures are embedded in the GLB file or placed in the correct folder.

## Current Implementation

The current blocky character uses procedural animation and will work perfectly fine for your game. It's animated to:
- Swing arms when walking
- Move legs when walking
- Bounce slightly when moving
- Show jump pose when jumping

You can keep using it or upgrade to a GLTF model whenever you want!
