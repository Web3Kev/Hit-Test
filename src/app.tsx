import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

import {
  createXRStore,
  DefaultXRController,
  DefaultXRHand,
  IfInSessionMode,
  useXRInputSourceStateContext,
  XR,
  XRDomOverlay,
  XRHitTest,
  XRSpace,
} from '@react-three/xr'

import { Matrix4 } from 'three'
import { Duck } from './duck'
import { Ducks } from './ducks'
// import { HitTestHandheld } from './hit-test-handheld'
import { useSpawnStore } from './store'
import { HitTest } from './hit-test'
import { OrbitControls } from '@react-three/drei'


export let hitTestMatrices: Partial<Record<XRHandedness, Matrix4 | undefined>> = {}

export function onResults(
  handedness: XRHandedness,
  results: Array<XRHitTestResult>,
  getWorldMatrix: (target: Matrix4, hit: XRHitTestResult) => void,
) {
  if (results && results.length > 0 && results[0]) {
    hitTestMatrices[handedness] ??= new Matrix4()
    getWorldMatrix(hitTestMatrices[handedness], results[0])
  }
}

const xr_store = createXRStore({
  domOverlay: true,
  hitTest: true,
  anchors: true,
  layers: false,
  meshDetection: false,
  planeDetection: false,

  hand: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const state = useXRInputSourceStateContext()

    return (
      <>
        <DefaultXRHand />
        <XRSpace space={state.inputSource.targetRaySpace}>
          <XRHitTest onResults={onResults.bind(null, state.inputSource.handedness)} />
        </XRSpace>
      </>
    )
  },

  controller: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const state = useXRInputSourceStateContext()

    return (
      <>
        <DefaultXRController />
        <XRSpace space={state.inputSource.targetRaySpace}>
          <XRHitTest onResults={onResults.bind(null, state.inputSource.handedness)} />
        </XRSpace>
      </>
    )
  },
})

export function App() {

  const { spawnCall, setSpawnCall } = useSpawnStore()

  const handleSpawnDuck = () => {
    if (!spawnCall) {
      setSpawnCall(true)
    }
  }

  return (
    <>
      {/* Start AR button - Center Top */}
      <button
        onClick={() => xr_store.enterAR()}
        className='ARbutton'
      >
        Enter AR
      </button>
      {/* <div id='interface' >
        <button
          onClick={() => xr_store.getState().session?.end()}
          className='top-right'
        >
          <img 
            src="exit.png"  // Path to your exit.png file
            alt="Exit"
            style={{
              width: "30px", // Set the image size
              height: "30px", // Set the image size
              objectFit: "contain", // Ensure the image doesn't stretch
            }}
          />
        </button>
        <button
          onClick={() => handleSpawnDuck()}
          className='bottom-right'
        >
           <img 
            src="duck.png"  // Path to your exit.png file
            alt="Duck"
            style={{
              width: "45px", // Set the image size
              height: "45px", // Set the image size
              objectFit: "contain", // Ensure the image doesn't stretch
            }}
          />
        </button>
      </div> */}

      <Canvas>
        <XR store={xr_store}>
          <directionalLight position={[1, 2, 1]} />
          <ambientLight />

          <IfInSessionMode allow={'immersive-ar'}>
            <HitTest />
            {/* <HitTestHandheld/> */}
            <Ducks />

            <XRDomOverlay>
              {/* Exit AR button - Top Right */}
              {/* <button
                onClick={() => xr_store.getState().session?.end()}
                style={{
                  position: "absolute",
                  top: "50px",
                  right: "20px",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  background: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px", // Increased font size
                  fontWeight: "bold",
                }}
              >
                Exit AR
              </button> */}

              {/* Duck spawn button - Bottom Center */}
              {/* <button
                onClick={()=>handleSpawnDuck()}
                style={{
                  position: "absolute",
                  top: "50px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  background: "#FFD700",
                  color: "black",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  fontWeight: "bold",
                  width: "150px",
                  height:"50px",
                }}
              >
                Duck
              </button> */}

              <div id='interface' >
              <button
                onClick={() => xr_store.getState().session?.end()}
                className='top-right'
              >
                <img 
                  src="exit.png"  // Path to your exit.png file
                  alt="Exit"
                  style={{
                    width: "30px", // Set the image size
                    height: "30px", // Set the image size
                    objectFit: "contain", // Ensure the image doesn't stretch
                  }}
                />
              </button>
              <button
                onClick={() => handleSpawnDuck()}
                className='bottom-right'
              >
                <img 
                  src="duck.png"  // Path to your exit.png file
                  alt="Duck"
                  style={{
                    width: "45px", // Set the image size
                    height: "45px", // Set the image size
                    objectFit: "contain", // Ensure the image doesn't stretch
                  }}
                />
              </button>
              </div>
            </XRDomOverlay>
          </IfInSessionMode>

          <IfInSessionMode deny={'immersive-ar'}>
            <Suspense fallback={null}>
              <Duck position={[0, -2, 0]} scale={2} />
            </Suspense>
            <OrbitControls/>
          </IfInSessionMode>
        </XR>
      </Canvas>
    </>
  )
}
