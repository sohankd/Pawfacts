import { useRef } from 'react';
import { Link } from 'react-router-dom';
import useLazyLoad from '../CustomHooks/useLazyLoad';

function Breed(props){
    let {breed} = {...props}
    ,   breedUrl = `/breed/${breed.name ? breed.name.replace(/\s/g, '_') : breed.id}`
    ,   $breedCard = useRef(null);

    useLazyLoad($breedCard);

    return(
        <div className="breed-card" ref={$breedCard}>
            <Link className="breed-card-link" to={breedUrl}>
                <img className='breed-image' data-src={breed.image?.url} alt={breed.name} loading="lazy"/>
                <div className="breed-card-description-wrapper">
                    <p className="breed-card-breed-name" title={breed.name}>{breed.name}</p>
                </div>
            </Link>
        </div>
    );
}
export default Breed;