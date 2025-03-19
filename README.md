Original code taken from pmndrs XR example repo, from https://github.com/shpowley

I made the following changes to work out of the box on ios webXR via eyejack app AppClips (link below)

Added Zustand for global state management (DOM overlay clicks) 
Added "spawn duck" button as well as "erase all" button.
Changed css styling.

Changed the logic to select HitTest components between screenbased Ar and world base AR.
Eyejack being a wrapper didn't seem to register the session as "screenbased", 
so instead I check for "worldbased" (AR passthrough) and default to "screenbase" if not available.

XRDomOverlay works fine. One thing to note is that css styling needs to be simplified, with idially one file only at root.
I had first used inline styling, which failed. It is important to cover the whole screen with width and height 100%.
Having one css file for all styling helped. The experience isn't dynamically resizeable.
As far as tested it is only available in full screen, protrait mode.

![Unknown-6](https://github.com/user-attachments/assets/fa634bc6-b8a7-4e54-bfe1-0a1fb4826d5a)

https://play.eyejack.xyz/link/?url=https%3A%2F%2Fhit-test-theta.vercel.app%2F
