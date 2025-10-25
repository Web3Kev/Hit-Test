// PolyfillFix.tsx - Add this to your R3F XR project
// Place this inside <XR> component before other content

import { useXR } from '@react-three/xr'
import { useEffect } from 'react'

interface XRRepaintOnChangeProps {
  trigger: unknown
}

export function XRRepaintOnChange({ trigger }: XRRepaintOnChangeProps) {
  const xr = useXR()

  useEffect(() => {
    if (!xr.session) return

    // Try to locate the DOM overlay container as best we can
    const root =
      // Some polyfills expose this root (non-standard)
      (xr.session as any).domOverlayRoot ||
      // Official spec: session.domOverlayState?.rootLayer may exist
      (xr.session as any).domOverlayState?.rootLayer ||
      // Fallback: typical R3F/XRDomOverlay selector
      document.querySelector('[xr-dom-overlay]') ||
      // Or your own custom container
      document.getElementById('interface')

    if (!root) return

    // ✅ Force repaint without layout flicker
    root.style.transform = 'translateZ(0)'
    // Trigger a forced reflow
    root.getBoundingClientRect()
    root.style.transform = ''
  }, [trigger, xr.session])

  return null
}

export function PolyfillFix() {
  const xr = useXR()
  
  useEffect(() => {
    if (!xr.session) return
    
    console.log('🔧 Checking XR session compatibility...')
    
    // Fix 1: Ensure session mode is set
    if (!xr.mode) {
      console.warn('⚠️ Session mode not set, patching...')
      Object.defineProperty(xr, 'mode', {
        value: 'immersive-ar',
        writable: false,
        enumerable: true,
        configurable: false
      })
      console.log('✅ Session mode patched to immersive-ar')
    }
    
    // Fix 2: Ensure environment blend mode is correct for AR
    if (xr.session.environmentBlendMode === 'opaque') {
      console.warn('⚠️ Wrong blend mode detected, patching...')
      Object.defineProperty(xr.session, 'environmentBlendMode', {
        value: 'alpha-blend',
        writable: false,
        enumerable: true,
        configurable: false
      })
      console.log('✅ Environment blend mode patched to alpha-blend')
    }
    
    // Fix 3: Ensure canvas is transparent
    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.style.backgroundColor = 'transparent'
      document.body.style.backgroundColor = 'transparent'
      console.log('✅ Canvas transparency ensured')
    }
    
    // Fix 4: Force re-render of XR components
    // This helps IfInSessionMode components re-evaluate
    setTimeout(() => {
      // Trigger a state update in R3F
      xr.session?.dispatchEvent?.(new Event('visibilitychange'))
    }, 100)
    
    console.log('🎉 XR session compatibility check complete:', {
      mode: xr.mode,
      blendMode: xr.session.environmentBlendMode,
    })
    
  }, [xr.session])
  
  return null
}

// ========================================
// Alternative: More aggressive fix
// ========================================

export function AggressivePolyfillFix() {
  const xr = useXR()
  
  useEffect(() => {
    // Run immediately and periodically until session is correct
    let attempts = 0
    const maxAttempts = 50 // 5 seconds
    
    const fixSession = () => {
      attempts++
      
      if (!xr.session) {
        if (attempts < maxAttempts) {
          setTimeout(fixSession, 100)
        }
        return
      }
      
      let needsRecheck = false
      
      // Fix session mode
      if (!xr.mode || xr.mode !== 'immersive-ar') {
        console.warn(`⚠️ Fixing session mode (attempt ${attempts})`)
        Object.defineProperty(xr, 'mode', {
          value: 'immersive-ar',
          writable: false,
          enumerable: true,
          configurable: false
        })
        needsRecheck = true
      }
      
      // Fix blend mode
      if (xr.session.environmentBlendMode !== 'alpha-blend') {
        console.warn(`⚠️ Fixing blend mode (attempt ${attempts})`)
        Object.defineProperty(xr.session, 'environmentBlendMode', {
          value: 'alpha-blend',
          writable: false,
          enumerable: true,
          configurable: false
        })
        needsRecheck = true
      }
      
      // Verify
      if (xr.mode === 'immersive-ar' && 
          xr.session.environmentBlendMode === 'alpha-blend') {
        
        // Set to transparent / none
        document.documentElement.style.background = 'none';

        console.log('✅ Session properly configured!')
        return
      }
      
      // Retry if needed
      if (needsRecheck && attempts < maxAttempts) {
        setTimeout(fixSession, 100)
      }
    }
    
    fixSession()
  }, [xr.session])
  
  return null
}

// ========================================
// Debug Component
// ========================================

export function XRDebugger({ verbose = false }) {
  const xr = useXR()
  
  useEffect(() => {
    if (!verbose) return
    
    const interval = setInterval(() => {
      console.group('🔍 XR State Debug')
 
      console.log('session:', xr.session ? '✅ exists' : '❌ null')
      console.log('session.mode:', xr.mode || '❌ undefined')
      console.log('session.environmentBlendMode:', 
        xr.session?.environmentBlendMode || '❌ undefined')
      console.log('inputSources:', xr.session?.inputSources?.length || 0)
      console.groupEnd()
    }, 2000)
    
    return () => clearInterval(interval)
  }, [xr, verbose])
  
  // Visual indicator
  if (!xr.session) return null
  
  const isCorrect = xr.mode === 'immersive-ar' && 
                    xr.session.environmentBlendMode === 'alpha-blend'
  
  return (
    <group position={[0, 2, -2]}>
      <mesh>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color={isCorrect ? 'green' : 'red'} />
      </mesh>
    </group>
  )
}