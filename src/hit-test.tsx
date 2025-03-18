import { useXR } from '@react-three/xr'

import { HitTestHandheld } from './hit-test-handheld.js'
import { HitTestHeadset } from './hit-test-headset.js'
import React from 'react'

export const HitTest = () => {
  const isHandheld = useXR((xr) => xr.session?.interactionMode === 'screen-space')
  return isHandheld ? <HitTestHandheld /> : <HitTestHeadset />
}
