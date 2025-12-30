import { useXRHitTest } from '@react-three/xr'

import { Reticle } from './reticle.js'
import { onResults } from './app.js'


const HitTestHandheld = () => {
  useXRHitTest(onResults.bind(null, 'none'), 'viewer', 'plane')

  return <Reticle handedness="none" />
}

export { HitTestHandheld }

// import { useXRHitTest } from '@react-three/xr'


// import { CircleGeometry, DoubleSide, Matrix4, Mesh, Quaternion, RingGeometry, Vector3 } from 'three'
// import { ThreeElements, useFrame } from '@react-three/fiber'
// import { forwardRef, useRef } from 'react'
// import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js'

// const matrixHelper = new Matrix4()
// const hitTestPosition = new Vector3()
// const hitTestRotation = new Quaternion()

// const ReticleMesh = forwardRef<Mesh, ThreeElements['mesh']>((props, ref) => {
//   const geometry_merged = BufferGeometryUtils.mergeGeometries([
//     new RingGeometry(0.05, 0.06, 30),
//     new CircleGeometry(0.007, 12),
//   ]).rotateX(-Math.PI * 0.5)

//   return (
//     <mesh ref={ref} geometry={geometry_merged} {...props}>
//       <meshBasicMaterial side={DoubleSide} color={"white"} />
//       {/* props.color */}
//     </mesh>
//   )
// })

// const HitTestHandheld = () => {
//   const previewRef = useRef<Mesh>(null)
  
//   useXRHitTest(
//     (results, getWorldMatrix) => {
//       if (results.length === 0) return

//       getWorldMatrix(matrixHelper, results[0])
//       hitTestPosition.setFromMatrixPosition(matrixHelper)
//       hitTestRotation.setFromRotationMatrix(matrixHelper)
   
//     },
//     'viewer', // Cast rays from the viewer reference space. This will typically be either the camera or where the user is looking
//     'plane' // Only hit test against detected planes
//   )

//   useFrame(() => {
//     if (previewRef.current) {
//       if(hitTestPosition)
//       {
//         previewRef.current.position.copy(hitTestPosition)
//         previewRef.current.quaternion.copy(hitTestRotation)
//         previewRef.current.visible=true;
//       }else
//       {
//         previewRef.current.visible=false;
//       }
      
//     }

//   })
//   return <ReticleMesh ref={previewRef} visible={false} />
// }

// export { HitTestHandheld }

