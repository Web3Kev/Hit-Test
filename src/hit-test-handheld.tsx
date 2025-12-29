// import { useXRHitTest } from '@react-three/xr'

// import { Reticle } from './reticle.js'
// import { onResults } from './app.js'


// const HitTestHandheld = () => {
//   useXRHitTest(onResults.bind(null, 'none'), 'viewer')

//   return <Reticle handedness="none" />
// }

// export { HitTestHandheld }

// hit-test-handheld.tsx
import { useFrame } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { useEffect, useRef } from 'react'
import { onResults } from './app.js'
import { Reticle } from './reticle.js'

const HitTestHandheld = () => {
  const session = useXR((state) => state.session)
  const hitTestSourceRef = useRef<XRHitTestSource | null>(null)
  const hitTestSourceRequestedRef = useRef(false)
  const viewerSpaceRef = useRef<XRReferenceSpace | null>(null)

  useEffect(() => {
    if (!session) return

    // Reset when session changes
    hitTestSourceRequestedRef.current = false
    hitTestSourceRef.current = null
    viewerSpaceRef.current = null

    const handleEnd = () => {
      hitTestSourceRequestedRef.current = false
      hitTestSourceRef.current = null
      viewerSpaceRef.current = null
    }

    session.addEventListener('end', handleEnd)
    
    return () => {
      session.removeEventListener('end', handleEnd)
      if (hitTestSourceRef.current) {
        hitTestSourceRef.current.cancel()
      }
    }
  }, [session])

  useFrame((_, __, frame) => {
    if (!session || !frame) return

    // Request hit test source once (mimics Three.js example)
    if (!hitTestSourceRequestedRef.current) {
      // TypeScript-safe: check method exists
      if (!session.requestHitTestSource) {
        console.error('❌ Hit test not supported by this session')
        hitTestSourceRequestedRef.current = true
        return
      }

      session
        .requestReferenceSpace('viewer')
        .then((referenceSpace) => {
          viewerSpaceRef.current = referenceSpace
          
          // TypeScript-safe: check session and method still exist
          if (!session || !session.requestHitTestSource) {
            throw new Error('Session or hit test support ended')
          }
          
          // Now TypeScript knows it's defined
          const hitTestPromise = session.requestHitTestSource({ space: referenceSpace })
          
          if (!hitTestPromise) {
            throw new Error('requestHitTestSource returned undefined')
          }
          
          return hitTestPromise
        })
        .then((source) => {
          console.log('✅ Hit test source created successfully')
          if (source) {
            hitTestSourceRef.current = source
          } else {
            console.warn('⚠️ Hit test source is undefined')
          }
        })
        .catch((err) => {
          console.error('❌ Failed to create hit test source:', err)
        })

      hitTestSourceRequestedRef.current = true
    }

    // Get results if source exists
    if (hitTestSourceRef.current && viewerSpaceRef.current) {
      const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current)
      
      if (hitTestResults.length > 0) {
        console.log(`🎯 Got ${hitTestResults.length} hit test results`)
        
        const referenceSpace = viewerSpaceRef.current
        
        onResults('none', hitTestResults, (target, hit) => {
          const pose = hit.getPose(referenceSpace)
          if (pose) {
            target.fromArray(pose.transform.matrix)
          }
        })
      }
    }
  })

  return <Reticle handedness="none" />
}

export { HitTestHandheld }