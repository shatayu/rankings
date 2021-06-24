export default function Pair({a, b, onSelection}) {
    const willFlip = Math.random() < 0.5;
    const left = willFlip ? a : b;
    const right = willFlip ? b : a;
    return <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            height: '100vh',
            alignItems: 'center',
            backgroundColor: '#111111',
        }}
    ><Element rendered={left} other={right} onSelection={onSelection} /><Element rendered={right} other={left} onSelection={onSelection} /></div>
}

function Element({rendered, other, onSelection}) {
    return <span style={{
        width: 400,
        height: 400,
        border: '10px solid white',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    }}
    value={rendered} onClick={() => onSelection(rendered, other)}>
        {String(rendered)}
    </span>
}