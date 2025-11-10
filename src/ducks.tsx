import { useXRControllerButtonEvent, useXRInputSourceEvent, useXRInputSourceState } from '@react-three/xr'
import { useEffect } from 'react'
import { Quaternion, Vector3 } from 'three'
import { Duck } from './duck.js'
import { hitTestMatrices } from './app.js'
import { useStore } from './store'
import { useThree } from '@react-three/fiber'

const vectorHelper = new Vector3()

export const Ducks = () => {
  // const [ducks, setDucks] = useState<Array<{ position: Vector3; quaternion: Quaternion }>>([])
  const { spawnCall, setSpawnCall, setShowReset,ducks, addDuck, resetAll,setCallReset, callReset } = useStore()
  
  const controller_right = useXRInputSourceState("controller", "right");

  //spawn at reticule on button pressed (screen based AR) >> eyejack
  useEffect(() => {
    if (spawnCall) {
      // Find the first available hit test matrix
      const handedness = Object.keys(hitTestMatrices)[0] as XRHandedness
      const matrix = hitTestMatrices[handedness]
      
      if (matrix) {
        const position = new Vector3()
        const quaternion = new Quaternion()
        matrix.decompose(position, quaternion, vectorHelper)
        addDuck({ position, quaternion })
        // setDucks((ducks) => [...ducks, { position, quaternion }])
      }
      
      // Reset spawn call
      setSpawnCall(false)
      //show reset
      setShowReset(true)
    }
  }, [spawnCall, setSpawnCall])

  const invalidate = useThree((state) => state.invalidate)

  useEffect(()=>{
    if(callReset)
    {
      console.log("resetting !")
      resetAll();
      invalidate();
    }
    
  },[callReset])

  useXRControllerButtonEvent(controller_right!, "b-button", (state) => {
    if (state === "pressed") {
      vibrate(controller_right);
      // Handle pressed event
      setCallReset(true);
    }
    if (state === "touched") {
      // Handle touched event
    }
    if (state === "default") {
      // Handle default state
    }
  });

  const vibrate = (controller: ReturnType<typeof useXRInputSourceState>) => {
    try {
      controller?.inputSource?.gamepad?.vibrationActuator?.playEffect("dual-rumble", {
        duration: 10,
        strongMagnitude: 1,
        weakMagnitude: 0.5,
      });
    } catch {
      console.log("No haptic feedback available");
    }
  };
  
  //delete all ducks on button pressed (screen based AR) >> eyejack
  // useEffect(() => {
  //   if (callReset) {
  //     setDucks([]);
  //     // Reset spawn call
  //     setSpawnCall(false)
  //     //hide reset
  //     setShowReset(false)
  //     //reset call
  //     setCallReset(false)
  //   }
  // }, [callReset])

  //normal passthrough AR, Hands and Controller placement
  // delete all ducks not implemented
  useXRInputSourceEvent(
    'all',
    'select',
    (e) => {
      const matrix = hitTestMatrices[e.inputSource.handedness]
      if (matrix) {
        const position = new Vector3()
        const quaternion = new Quaternion()
        matrix.decompose(position, quaternion, vectorHelper)
        // setDucks((ducks) => [...ducks, { position, quaternion }])
        addDuck({ position, quaternion })
      }
    },

    [],
  )

  

  return ducks.map((item, index) => (
    <Duck key={index} position={item.position} quaternion={item.quaternion} scale={0.2} />
  ))
}
