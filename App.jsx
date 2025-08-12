import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    let [time, setTime] = useState(0);
    const [isOn,setisOn]=useState(false);
    const [dice, setDice] = useState(() => generateAllNewDice())
    const buttonRef = useRef(null)
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    })
    useEffect(()=>{
        let timer;
        if(isOn)
        {
            timer=setInterval(()=>{
                setTime(prev => prev + 1);
                },1000)
        }
        
        return () => clearInterval(timer);
    },[isOn])

    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
        
    useEffect(() => {
        if (gameWon) {
            setisOn(false);
            buttonRef.current.focus()
        }
    }, [gameWon])

    useEffect(() => {
        const onResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value:Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }))
    }
    
    function rollDice() {
         if (isOn==false && time === 0) {
            setisOn(true);
        }

        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
        } else {
            setDice(generateAllNewDice())
             setTime(0)
            setisOn(false)
        }
    }

    function hold(id) {
        if (isOn==false && time === 0) {
            setisOn(true);
        }
        
        setDice(oldDice => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    }

    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
        />
    ))
    
     function startTimer() {
    setisOn(prev=>!prev);
  }

  function resetTimer() {
    setTime(0);
    setisOn(false);
  }

    return (
        <>
            {gameWon && createPortal(
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1000 }}
                />,
                document.body
            )}
        <main>
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            
            <div className="timer-section">
                <h3 className="timer-display">{time} seconds</h3>
            </div>
            
            <div className="dice-container">
                {diceElements}
            </div>
            <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
                {gameWon ? "🎉 New Game" : "🎲 Roll"}
            </button>
        </main>
        </>
      
    )
}