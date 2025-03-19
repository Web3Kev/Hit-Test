### R3F HitTest example, adjusted to work on iOS (via Eyejack)

![0319](https://github.com/user-attachments/assets/450e7167-73ae-4714-968e-13da00074fea)

Original code from [Sung Powley](https://github.com/shpowley) on  [Poimandres r3f XR repo](https://github.com/pmndrs/xr).

I made the following changes to make it work out of the box on iOS WebXR via the Eyejack AppClips:

- **Added Zustand** for global state management (DOM overlay clicks).
- **Added "Spawn Duck" and "Erase All" buttons**.
- **Updated CSS styling** for better compatibility.
- **Modified logic to select HitTest components** between screen-based AR and world-based AR.  
  - Eyejack, being a wrapper, didn't seem to register the session as "screen-based."  
  - Instead, I check for "world-based" (AR passthrough) and default to "screen-based" if unavailable.

### Notes on XRDomOverlay:
- Works fine, but **CSS styling needs to be simplified**—ideally, with a **single CSS file at the root**.
- The experience **is not dynamically resizable**.
- It is currently **only available in full-screen, portrait mode**.

### Live Demo:
- follow this link if you already are on your phone [▶ Here](https://play.eyejack.xyz/link/?url=https%3A%2F%2Fhit-test-theta.vercel.app%2F)
- or Scan this QR code with an iPhone
- Choose "Open with AppClip" from eyejack (no download required).
  
<img src="https://github.com/user-attachments/assets/fa634bc6-b8a7-4e54-bfe1-0a1fb4826d5a" width="400">


