
import { useState } from 'react';
import Image from 'next/image';

const Jason: React.FC = () => {
  const [showText, setShowText] = useState(0);
  const [secretPath, setSecretPath] = useState('/assets/media/skeleton.png');

  function clickSkele() {
    if (showText == -1) return;
    if (showText == 15) {
      setShowText(-1);
      setSecretPath('/assets/media/secret.gif')
      return
    }
    setShowText(showText + 1);
  }

  return (
    <div onClick={clickSkele} className='skeleton' style={{  cursor: 'pointer', position: 'absolute', bottom: '0', right: '0', overflow:'hidden', zIndex:'-1'}}>
      <Image
        style={{height:'auto', width:'360px', position: 'relative', bottom: '-11px', right: '-40px', transform: "rotateZ(-2.5deg)"}}
        src={secretPath}
        alt="skeleton"
        width="300"
        height="300"
      ></Image>
      <div style={{ display: showText > 0 ? 'block':'none', backgroundColor:'azure', borderRadius: '5px', color:'darkslategrey', padding: '3px', textAlign: 'right', maxWidth: '11em', position: 'absolute', top: '60px', right: '80px', zIndex:'20', pointerEvents: 'none'}}>
        {
          showText == 1 ? 'hi, im jason' :
          showText == 2 ? 'i need a favour, got it?' :
          showText == 3 ? 'you can free my spirit from my corpse' :
          showText == 4 ? 'just click my body a few times' :
          showText == 5 ? "if you do, i'll give you something" :
          showText == 7 ? "and i'll tell my spirit friends about you" : null
        }
      </div>
    </div>
  )
}

export default Jason;
