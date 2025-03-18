import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'

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
import './App.css';

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

  useEffect(() => {
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    appHeight();
    window.addEventListener('resize', appHeight);
    window.addEventListener('orientationchange', appHeight);
    return () => {
      window.removeEventListener('resize', appHeight);
      window.removeEventListener('orientationchange', appHeight);
    };
  }, []);

  return (
    <div className="app-container">
      {/* Start AR button - Center Top */}
      <button
        onClick={() => xr_store.enterAR()}
        style={{
          position: "absolute",
          top: "50px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          borderRadius: "12px",
          background: "teal",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "20px", // Increased font size
          fontWeight: "bold",
          zIndex: 1000, 
        }}
      >
        Enter AR
      </button>

      {/* <button
  onClick={() => xr_store.getState().session?.end()}
  style={{
    position: "absolute",
    top: "50px",
    right: "20px",
    borderRadius: "20%",
    background: "red",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px", // Set the button size
    height: "50px", // Set the button size
  }}
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
  style={{
    position: "absolute",
    top: "80%",
    right: "20px",
    transform: "translateY(-80%)",
    padding: "0", // Remove padding to allow the button size to fit the content
    paddingBottom :"8px",
    borderRadius: "12px",
    background: "#FFD700",
    color: "black",
    border: "none",
    cursor: "pointer",
    fontSize: "50px", // Ensure this is large enough
    fontWeight: "bold",
    width: "50px", // Set width to match font size or slightly bigger
    height: "50px", // Set height to match font size or slightly bigger
    display: "flex",
    alignItems: "center", // Centers vertically
    justifyContent: "center", // Centers horizontally
    lineHeight: "50px", // Ensure line-height matches the height to center text vertically
  }}
>
  +
</button> */}

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
              <button
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
              </button>

              {/* Duck spawn button - Bottom Center */}
              <button
                onClick={()=>handleSpawnDuck()}
                style={{
                  position: "absolute",
                  top: "80%",
                  left: "50%",
                  transform: "translateY(-80%)",
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
              </button>
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
    </div>
  )
}
