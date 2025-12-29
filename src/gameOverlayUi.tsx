// import React, { useEffect } from 'react';

import { XRStore } from '@react-three/xr';
import { useStore } from './store';


interface GameOverlayUIProps {
 store: XRStore | null
}

const GameOverlayUI: React.FC<GameOverlayUIProps> = ({store = null }) => {

    const { spawnCall, setSpawnCall,callReset, setCallReset, showReset, showInfo, setShowInfo } = useStore()
    
      const handleSpawnDuck = () => {
        if (!spawnCall) {
          setSpawnCall(true)
        }
      }
    
      const handleReset = () => {
        if (showReset && !callReset) {
          setCallReset(true);
        }
      }
    


    // useEffect(() => {
    // }, []);


    const exitAR = () =>{
      
      setShowInfo(true);

      if(store)
      {
        store.getState().session?.end()
      }
    }


    

  return (

    <div id='interface' >
    {showInfo &&(<div id='hit-test-instructions'>
      1 - Aim with the targeting reticle<br /><br />
      2 - Choose a flat surface (floor, table, etc.)<br /><br />
      3 - Place a duck (press button)<br />

      <button
        onClick={()=>setShowInfo(!showInfo)}
      >
        close
      </button>
    </div>)}
    <button
      onClick={() => exitAR()}
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
    {showReset && (<button
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
    </button>)}
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

  );
};

export default GameOverlayUI;