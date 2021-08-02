import styles from './Pair.module.css';

export default function Pair({a, b, onSelection, highlightedTerm}) {
    const willFlip = Math.random() < 0.5;
    const left = willFlip ? a : b;
    const right = willFlip ? b : a;
    const highlightLeft = left === highlightedTerm;
    const highlightRight = right === highlightedTerm;
    return (
        <div className={styles.pair}>
            <Element rendered={left} other={right} onSelection={onSelection} highlighted={highlightLeft}/>
            <Element rendered={right} other={left} onSelection={onSelection} highlighted={highlightRight}/>
        </div>
    );

}

function Element({rendered, other, onSelection, highlighted}) {
    return <span
    className={styles.element + (highlighted ? ' ' + styles.highlightedElement : '')}
    value={rendered} onClick={() => onSelection(rendered, other)}>
        {String(rendered)}
    </span>
};