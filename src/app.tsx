// import { Canvas } from '@react-three/fiber'
// import { Suspense, useState } from 'react'
// import { Analytics } from "@vercel/analytics/react" //<-- analytics for the web demo (remove from your code)

// import {
//   createXRStore,
//   DefaultXRController,
//   DefaultXRHand,
//   // IfInSessionMode,
//   useXRInputSourceStateContext,
//   XR,
//   XRDomOverlay,
//   XRHitTest,
//   XRSpace,
// } from '@react-three/xr'

// import { Matrix4 } from 'three'
// import { Duck } from './duck'
// import { Ducks } from './ducks'
// import { useStore } from './store'
// import { HitTest } from './hit-test'
// import { OrbitControls } from '@react-three/drei'


// export let hitTestMatrices: Partial<Record<XRHandedness, Matrix4 | undefined>> = {}

// export function onResults(
//   handedness: XRHandedness,
//   results: Array<XRHitTestResult>,
//   getWorldMatrix: (target: Matrix4, hit: XRHitTestResult) => void,
// ) {
//   if (results && results.length > 0 && results[0]) {
//     hitTestMatrices[handedness] ??= new Matrix4()
//     getWorldMatrix(hitTestMatrices[handedness], results[0])
//   }
// }

// const xr_store = createXRStore({
//   domOverlay: true,
//   hitTest: 'required',
//   anchors: true,
//   layers: false,
//   meshDetection: false,
//   planeDetection: false,

//   hand: () => {
//     const state = useXRInputSourceStateContext()

//     return (
//       <>
//         <DefaultXRHand />
//         <XRSpace space={state.inputSource.targetRaySpace}>
//           <XRHitTest onResults={onResults.bind(null, state.inputSource.handedness)} />
//         </XRSpace>
//       </>
//     )
//   },

//   controller: () => {
//     const state = useXRInputSourceStateContext()

//     return (
//       <>
//         <DefaultXRController />
//         <XRSpace space={state.inputSource.targetRaySpace}>
//           <XRHitTest onResults={onResults.bind(null, state.inputSource.handedness)} />
//         </XRSpace>
//       </>
//     )
//   },
// })

// export function App() {

//   const { spawnCall, setSpawnCall,callReset, setCallReset, showReset } = useStore()

//   const [showInfo, setShowInfo] = useState<Boolean>(true);
//   const [gettingReady, setGettingReady] = useState<boolean>(false);
//   const [arReady, setArReady] = useState<boolean>(false);

//   const handleSpawnDuck = () => {
//     if (!spawnCall) {
//       setSpawnCall(true)
//     }
//   }

//   const handleReset = () => {
//     if (showReset && !callReset) {
//       setCallReset(true);
//     }
//   }

//   const hideInfo = () => {
//     setShowInfo(false);
//   }

//   const handleEnterAR = async () => {
//     setGettingReady(true)
//     // console.log("start")
//     try {
//       await xr_store.enterAR()
//       // console.log("clicked")
      
//       // Wait for session to be fully ready
//       await new Promise<void>(resolve => {
//         const checkSession = () => {
//           const mode = xr_store.getState().mode
//           if (mode && mode === 'immersive-ar') {
//             console.log('✅ Session ready:', mode)
//             resolve()
//           } else {
//             console.log('⏳ Waiting for session...', mode)
//             setTimeout(checkSession, 100)
//           }
//         }
//         checkSession()
//       })
      
//       console.log('✅ AR session fully initialized')
//     } catch (error) {
//       console.error('Failed to enter AR:', error)
//     } finally {
//       setGettingReady(false)
//       setArReady(true);
//     }
//   }

//   return (
//     <>
//       <button
//         // onClick={() => xr_store.enterAR()}
//         onClick={() => handleEnterAR()}
//         className='ARbutton'
//         disabled={gettingReady}
//       >
//         {/* Enter AR */}
//         {gettingReady ? 'Loading AR...' : 'Enter AR'}
//       </button>

   
      

//       <Canvas>
//         {/* Vercel Analytics for the web Demo ... remove in your code */}
//         <Analytics/>
        
//         <XR store={xr_store}>

//           <directionalLight position={[1, 2, 1]} />
          
//           <ambientLight />

//           {/* <IfInSessionMode allow={'immersive-ar'}> */}
//           {arReady && <>
//             <HitTest />
//             <Ducks />
//             <XRDomOverlay>
//               <div id='interface' >
//               {showInfo &&(<div id='hit-test-instructions'>
//                 1 - Aim with the targeting reticle<br /><br />
//                 2 - Choose a flat surface (floor, table, etc.)<br /><br />
//                 3 - Place a duck (press button)<br />

//                 <button
//                   onClick={() => hideInfo()}
//                 >
//                   close
//                 </button>
//               </div>)}
//               <button
//                 onClick={() => xr_store.getState().session?.end()}
//                 className='top-right'
//               >
//                 <img 
//                   src="exit.png" 
//                   alt="Exit"
//                   style={{
//                     width: "30px", 
//                     height: "30px", 
//                     objectFit: "contain", 
//                   }}
//                 />
//               </button>
//               {showReset && (<button
//                 onClick={() => handleReset()}
//                 className='top-right-second'
//               >
//                 <img 
//                   src="trash.png" 
//                   alt="reset"
//                   style={{
//                     width: "30px", 
//                     height: "30px", 
//                     objectFit: "contain", 
//                   }}
//                 />
//               </button>)}
//               <button
//                 onClick={() => handleSpawnDuck()}
//                 className='bottom-right'
//               >
//                 <img 
//                   src="duck.png"  
//                   alt="Duck"
//                   style={{
//                     width: "45px", 
//                     height: "45px",
//                     objectFit: "contain",
//                   }}
//                 />
//               </button>
//               </div>
//             </XRDomOverlay>
//           </>}
//           {/* </IfInSessionMode> */}

//           {/* <IfInSessionMode deny={'immersive-ar'}> */}
//           {!arReady && <>
//             <Suspense fallback={null}>
//               <Duck position={[0, -2, 0]} scale={2} />
//             </Suspense>
//             <OrbitControls/>
//           </>}
//            {/* </IfInSessionMode> */}

//         </XR>
//       </Canvas>
//     </>
//   )
// }


import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { Analytics } from "@vercel/analytics/react"

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
import { useStore } from './store'
import { HitTest } from './hit-test'
import { OrbitControls } from '@react-three/drei'

// Import the polyfill fix
import { AggressivePolyfillFix } from './PolyfillFix'

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
  const { spawnCall, setSpawnCall, callReset, setCallReset, showReset } = useStore()
  const [showInfo, setShowInfo] = useState<boolean>(true)

  const handleSpawnDuck = () => {
    if (!spawnCall) {
      setSpawnCall(true)
    }
  }

  const handleReset = () => {
    if (showReset && !callReset) {
      setCallReset(true)
    }
  }

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

  return (
    <>
      <button
        onClick={() => xr_store.enterAR()}
        className='ARbutton'
      >
        Inter AR
      </button>

      <Canvas
        // Ensure canvas has alpha channel for camera feed
        gl={{
          alpha: true,
          preserveDrawingBuffer: true,
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
        }}
      >
        <Analytics />
        
        <XR store={xr_store}>
          {/* 🔧 ADD POLYFILL FIX FIRST - This is critical! */}
          <AggressivePolyfillFix />
          
          {/* 🔍 Optional: Enable for debugging */}
          {/* <XRDebugger verbose={true} /> */}

          <directionalLight position={[1, 2, 1]} />
          <ambientLight />

          <IfInSessionMode allow={'immersive-ar'}>
            <HitTest />
            <Ducks />
            <XRDomOverlay>
              <div id='interface'>

                {showInfo && (
                  <div id='hit-test-instructions'>
                    1 - Aim with the targeting reticle<br /><br />
                    2 - Choose a flat surface (floor, table, etc.)<br /><br />
                    3 - Place a duck (press button)<br />

                    <button onClick={() => hideInfo()}>
                      close
                    </button>
                  </div>
                )}
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
                {showReset && (
                  <button
                    onClick={() => handleReset()}
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
                )}
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
          </IfInSessionMode>

          <IfInSessionMode deny={'immersive-ar'}>
            <Suspense fallback={null}>
              <Duck position={[0, -2, 0]} scale={2} />
            </Suspense>
            <OrbitControls />
          </IfInSessionMode>

        </XR>
      </Canvas>
    </>
  )
}