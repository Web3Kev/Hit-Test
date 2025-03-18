import { useXR } from '@react-three/xr'
import { HitTestHeadset } from './hit-test-headset'
import { HitTestHandheld } from './hit-test-handheld'

export const HitTest = () => {
  // // screen-space not recognized on ios via eyejack
  // const isHandheld = useXR((xr) => xr.session?.interactionMode === 'screen-space')
  const isWearable = useXR((xr)=>xr.session?.interactionMode === 'world-space')
  // return isHandheld ? <HitTestHandheld /> : <HitTestHeadset />
  return isWearable ? <HitTestHeadset /> : <HitTestHandheld /> 
}
