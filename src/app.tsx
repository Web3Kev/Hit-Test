import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Analytics } from "@vercel/analytics/react" //<-- analytics for the web demo (remove from your code)

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
import { HitTest } from './hit-test'
import { OrbitControls } from '@react-three/drei'
import GameOverlayUI from './gameOverlayUi'


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

  

  return (
    <>
      <button
        onClick={() => xr_store.enterAR()}
        className='ARbutton'
      >
        Enter AR
      </button>

      <Canvas>
        {/* Vercel Analytics for the web Demo ... remove in your code */}
        <Analytics/>
        
        <XR store={xr_store}>

          <directionalLight position={[1, 2, 1]} />
          
          <ambientLight />

          <IfInSessionMode allow={['immersive-ar', "inline"]}>
            <HitTest />
            <Ducks />
            <XRDomOverlay>
              <GameOverlayUI store={xr_store}/>
            </XRDomOverlay>
          </IfInSessionMode>

          <IfInSessionMode deny={['immersive-ar', "inline"]}>
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
