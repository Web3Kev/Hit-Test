import { useXRHitTest } from '@react-three/xr'

import { Reticle } from './reticle.js'
import { onResults } from './app.js'
import React from 'react'

const HitTestHandheld = () => {
  useXRHitTest(onResults.bind(null, 'none'), 'viewer')

  return <Reticle handedness="none" />
}

export { HitTestHandheld }
