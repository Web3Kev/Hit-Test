import { useXR } from '@react-three/xr'
import { HitTestHeadset } from './hit-test-headset'
import { HitTestHandheld } from './hit-test-handheld'

export const HitTest = () => {
  // const isHandheld = useXR((xr) => xr.session?.interactionMode === 'screen-space')
  const isWearable = useXR((xr)=>xr.session?.interactionMode === 'world-space')
  // return isHandheld ? <HitTestHandheld /> : <HitTestHeadset />
  return isWearable ? <HitTestHeadset /> : <HitTestHandheld /> 
}
