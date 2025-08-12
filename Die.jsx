const unicodeDice = ["", "\u2680", "\u2681", "\u2682", "\u2683", "\u2684", "\u2685"];

export default function Die(props) {
    const dieSymbol = unicodeDice[props.value] || props.value;
    return (
        <button 
            onClick={props.hold}
            aria-pressed={props.isHeld}
            aria-label={`Die with value ${props.value}, 
            ${props.isHeld ? "held" : "not held"}`}
            style={{ fontSize: "2.5rem", lineHeight: 1 }}
        >{dieSymbol}</button>
    )
}