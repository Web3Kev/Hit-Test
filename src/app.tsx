import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Analytics } from "@vercel/analytics/react" //<-- analytics for the web demo (remove from your code)

import {
  createXRStore,
  DefaultXRController,
  DefaultXRHand,
  // IfInSessionMode,
  useXRInputSourceStateContext,
  XR,
  XRDomOverlay,
  XRHitTest,
  XRSpace,
} from '@react-three/xr'

import { Matrix4 } from 'three'
// import { Duck } from './duck'
import { Ducks } from './ducks'
import { useStore } from './store'
// import { HitTest } from './hit-test'
// import { OrbitControls } from '@react-three/drei'
import { ContinuousHitTest } from './xustomHit'
// import { HitTest } from './hit-test'



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
  hitTest: 'required',
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

  const { spawnCall, setSpawnCall,callReset, showReset, resetAll } = useStore()

  const [showInfo, setShowInfo] = useState<Boolean>(true);
  const [gettingReady, setGettingReady] = useState<boolean>(false);
  const resetButton = useRef<null | HTMLButtonElement>(null)
  // const [arReady, setArReady] = useState<boolean>(false);

  const handleSpawnDuck = () => {
    if (!spawnCall) {
      setSpawnCall(true)
    }
  }

  useEffect(() => {
    const el = resetButton.current
    if (!el) return

    el.disabled = !showReset
    el.style.visibility = showReset ? 'visible' : 'hidden'
    el.style.pointerEvents = showReset ? 'auto' : 'none'

    // ⚡ force EyeJack to refresh overlay after change
    requestAnimationFrame(() => {
      const overlay = document.querySelector('[xr-dom-overlay], #interface')
      if (overlay instanceof HTMLElement) overlay.offsetHeight
    })
  }, [showReset])

  const handleReset = () => {
    if (!callReset) {
      // setCallReset(true);
      resetAll();
    }
  }

 


  // const hideInfo = () => {
  //   setShowInfo(false);
  // }

    const hideInfo = () => {
    // setShowInfo(false)
     const instructions = document.getElementById('hit-test-instructions')
      if (instructions) {
        instructions.classList.add('fading-out')
        setTimeout(() => setShowInfo(false), 300) // Wait for animation
      } else {
        setShowInfo(false)
      }
  }

  const handleEnterAR = async () => {

    console.log('!!!!!!!!!!!! --------- HERE -------- !!!!!!!!!!!!!');

  try {
    setGettingReady(true);
    
    // Ensure session is properly initialized
    console.log('🎯 Entering AR...');
    
    await xr_store.enterAR();
    
    // Force a small delay to ensure session is fully started
    setTimeout(() => {
      console.log('✅ AR Session state:');
      setGettingReady(false);
      // setArReady(true);
    }, 500);

    setTimeout(() => {
    if (resetButton.current) {
      resetButton.current.style.visibility = showReset ? 'visible' : 'hidden'
      resetButton.current.style.pointerEvents = showReset ? 'auto' : 'none'
    }
  }, 1000)
    
  } catch (error) {
    console.error('❌ Failed to enter AR:', error);
    setGettingReady(false);
  }
};



  return (
    <>
      <button
        // onClick={() => xr_store.enterAR()}
        onClick={() => handleEnterAR()}
        className='ARbutton'
        disabled={gettingReady}
      >
        {/* Enter AR */}
        {gettingReady ? 'Loading AR...' : 'Enter AR'}
      </button>

   
      

      <Canvas>
        {/* Vercel Analytics for the web Demo ... remove in your code */}
        <Analytics/>
        
        <XR store={xr_store}>
          {/* <AggressivePolyfillFix /> */}
          <directionalLight position={[1, 2, 1]} />
          
          <ambientLight />

         

          {/* <IfInSessionMode allow={'immersive-ar'}> */}
          {/* {arReady && <> */}
            {/* <HitTest /> */}
             <ContinuousHitTest/>
            <Ducks />
            <XRDomOverlay>
              <div id='interface' >
              {showInfo &&(<div id='hit-test-instructions'>
                1 - Aim with the targeting reticle<br /><br />
                2 - Choose a flat surface (floor, table, etc.)<br /><br />
                3 - Place a duck (press button)<br />

                <button
                  onClick={() => hideInfo()}
                >
                  close
                </button>
              </div>)}
              <button
                onClick={() => xr_store.getState().session?.end()}
                className='top-right'
              >
                <img 
                  src="exit.png" 
                  alt="Exit"
                  style={{
                    width: "30px", 
                    height: "30px", 
                    objectFit: "contain", 
                  }}
                />
              </button>
              {/* {showReset && ( */}
                <button
                ref={resetButton}
                onClick={() => handleReset()}
                disabled={true}
                style={{
                  visibility: 'hidden',
                  pointerEvents: 'none',
                }}
                className='top-right-second'
              >
                <img 
                  src="trash.png" 
                  alt="reset"
                  style={{
                    width: "30px", 
                    height: "30px", 
                    objectFit: "contain", 
                  }}
                />
              </button>
            {/* )}  */}
              <button
                onClick={() => handleSpawnDuck()}
                className='bottom-right'
              >
                <img 
                  src="duck.png"  
                  alt="Duck"
                  style={{
                    width: "45px", 
                    height: "45px",
                    objectFit: "contain",
                  }}
                />
              </button>
              </div>
            </XRDomOverlay>
          {/* </>} */}
          {/* </IfInSessionMode> */}

          {/* <IfInSessionMode deny={'immersive-ar'}> */}
          {/* {!arReady && <>
            <Suspense fallback={null}>
              <Duck position={[0, -2, 0]} scale={2} />
            </Suspense>
            <OrbitControls/>
          </>} */}
           {/* </IfInSessionMode> */}

        </XR>
      </Canvas>
    </>
  )
}

