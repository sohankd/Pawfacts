import { useState, useEffect, useRef} from "react";
import Breed from "./Breed";
import {getBreedList} from "./TheDogAPI";
import SkeletonCards from './Skeleton.Cards';

function Breeds(props){
    let [breedCollection, setBreedCollection] = useState({total: 0, breeds: []})
    ,   [pagination, setPagination] = useState({currentPage: 0, pageCount: 1})
    ,   isFetching = useRef(false);

    useEffect(() => {
        let limit = 10;

        !isFetching.current && 
            getBreedList({page: pagination.currentPage, limit: limit})
                .then((response) => {
                    setBreedCollection(prevState => ({
                        total: response.total
                    ,   breeds: [].concat(prevState.breeds, response.breeds)
                    }));
                    setPagination(prevState => ({...prevState, pageCount: Math.floor(response.total/limit)}));
                });
        
        isFetching.current = !isFetching.current;
    }, [pagination.currentPage]);

    function handleLoadMoreAction(){
        setPagination(prevState => ({...prevState, currentPage: prevState.currentPage + 1}));
    }
    
    return (
        <div className="breeds-container">
            <div className="breeds-wrapper">
                {!breedCollection.breeds.length
                    ? <SkeletonCards cardCount="10"></SkeletonCards>
                    : (breedCollection.breeds).map((breed) => <Breed breed={breed} key={breed.id}></Breed>)
                }
            </div>
            {pagination.currentPage < pagination.pageCount &&
            <div className="breeds-load-more-button-wrapper">
                <button onClick={handleLoadMoreAction} className="breeds-load-more-button">Load More</button>
            </div>
            }
        </div>
    );
}
export default Breeds;