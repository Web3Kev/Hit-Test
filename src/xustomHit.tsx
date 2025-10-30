import { useFrame } from "@react-three/fiber"
import { useXRHitTest } from "@react-three/xr"
import { useRef } from "react"
import { Matrix4, Mesh, Vector3 } from "three"

const matrixHelper = new Matrix4()
const hitTestPosition = new Vector3()

export function ContinuousHitTest() {
  const previewRef = useRef<Mesh>(null)

  useXRHitTest(
    (results, getWorldMatrix) => {
      if (results.length === 0) return

      getWorldMatrix(matrixHelper, results[0])
      hitTestPosition.setFromMatrixPosition(matrixHelper)
    },
    'viewer', // Cast rays from the viewer reference space. This will typically be either the camera or where the user is looking
    'plane' // Only hit test against detected planes
  )

  useFrame(() => {
    if (hitTestPosition && previewRef.current) {
      previewRef.current.position.copy(hitTestPosition)
    }
  })

  return (
      
      <mesh ref={previewRef} position={hitTestPosition}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="red" />
      </mesh>
  )
}
