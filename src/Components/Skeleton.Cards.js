function SkeletonCards (props){
    let {cardCount} = {...props}
    ,   $cards = [];
    
    for(var i = 0; i < cardCount; i++){
        $cards.push(<div className="skeleton-card" key={i * Math.random()}></div>);
    }
    
    return $cards.length && (
        <div className="skeleton-cards-wrapper">{$cards.map($card => $card)}</div>
    );
}

export default SkeletonCards;