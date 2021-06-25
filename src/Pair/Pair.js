import Element from '../Element/Element';
import './Pair.css';

export default function Pair({a, b, onSelection}) {
    const willFlip = Math.random() < 0.5;
    const left = willFlip ? a : b;
    const right = willFlip ? b : a;
    return <div className='pair'><Element rendered={left} other={right} onSelection={onSelection} /><Element rendered={right} other={left} onSelection={onSelection} /></div>
}

