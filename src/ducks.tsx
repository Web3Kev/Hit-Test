import { useXRInputSourceEvent } from '@react-three/xr'
import { useEffect, useState } from 'react'
import { Quaternion, Vector3 } from 'three'
import { Duck } from './duck.js'
import { hitTestMatrices } from './app.js'
import { useStore } from './store'

const vectorHelper = new Vector3()

export const Ducks = () => {
  const [ducks, setDucks] = useState<Array<{ position: Vector3; quaternion: Quaternion }>>([])
  const { spawnCall, setSpawnCall, callReset, setCallReset, setShowReset } = useStore()
  
  useEffect(() => {
    if (spawnCall) {
      // Find the first available hit test matrix
      const handedness = Object.keys(hitTestMatrices)[0] as XRHandedness
      const matrix = hitTestMatrices[handedness]
      
      if (matrix) {
        const position = new Vector3()
        const quaternion = new Quaternion()
        matrix.decompose(position, quaternion, vectorHelper)
        setDucks((ducks) => [...ducks, { position, quaternion }])
      }
      
      // Reset spawn call
      setSpawnCall(false)
      //show reset
      setShowReset(true)
    }
  }, [spawnCall, setSpawnCall])

  useEffect(() => {
    if (callReset) {

      setDucks([]);
      
      // Reset spawn call
      setSpawnCall(false)
      //hide reset
      setShowReset(false)
      //reset call
      setCallReset(false)
    }
  }, [callReset])

  useXRInputSourceEvent(
    'all',
    'select',
    (e) => {
      const matrix = hitTestMatrices[e.inputSource.handedness]
      if (matrix) {
        const position = new Vector3()
        const quaternion = new Quaternion()

        matrix.decompose(position, quaternion, vectorHelper)
        setDucks((ducks) => [...ducks, { position, quaternion }])
      }
    },

    [],
  )

  return ducks.map((item, index) => (
    <Duck key={index} position={item.position} quaternion={item.quaternion} scale={0.2} />
  ))
}
