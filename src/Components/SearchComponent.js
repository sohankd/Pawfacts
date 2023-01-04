import { useRef, useState } from "react";
import {searchForBreed} from './TheDogAPI';
import Breed from './Breed';
import SkeletonCards from './Skeleton.Cards';

function SearchComponent(props){
    let $searchInput = useRef(null)
    ,   $clearButton = useRef(null)
    ,   [searchModel, setSearchModel] = useState({isFetching: false, query: '', results: []});

    function toggleBreedsContainerVisibility(hide){
        let $breedsContainer = document.querySelector('.breeds-container');
        $breedsContainer && $breedsContainer.classList[!!hide ? 'add' : 'remove']('collapse');
    }
    
    function debounce(func, timeout = 300){
        let timer;
        return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
	}
	
	let inputHandler = debounce(function(e){
			let inputValue = $searchInput.current.value;
            
			if(!!inputValue && inputValue.length > 2){
                $clearButton.current.classList.add('show');
                toggleBreedsContainerVisibility(true);
                setSearchModel(prevState => ({...prevState, isFetching: !prevState.isFetching, query: inputValue}));
				searchForBreed(inputValue)
					.then(response => {
                        setSearchModel(prevState => ({...prevState, isFetching: !prevState.isFetching, results: response}));
                    });
			}
            else{
                toggleBreedsContainerVisibility(false);
                setSearchModel({isFetching: false, query: '', results: []});
            }
		});

    function resetInput(e){
        var $input = $searchInput.current
        ,   nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

        nativeInputValueSetter.call($input, '');
        $clearButton.current.classList.remove('show');
        $input.dispatchEvent(new Event('change', { bubbles: true}));
    }

    return (
        <div className="search-component-wrapper">
            <div className="search-component-input-wrapper">
                <label htmlFor="query" className="search-component-input-label">
                    <i className="icon-magnifying-glass"></i>
                    <i className="icon-clear-search" onClick={resetInput} ref={$clearButton}></i>
                    <input onChange={inputHandler} className="search-component-search-input" type="text" name="query" id="query" ref={$searchInput} placeholder="Search for breed"/>
                </label>
            </div>
            {!!searchModel.query && searchModel.results.length > 0 &&
                <div className="search-component-results-wrapper">
                    {searchModel.results.map(result => <Breed breed={result} key={result.id}></Breed>)}
                </div>
            }
            {!!searchModel.query && !searchModel.isFetching && !searchModel.results.length && <h1 className="search-component-no-result-text">Wrong input, Hooman!</h1>}
            {!!searchModel.isFetching && <SkeletonCards cardCount="5"></SkeletonCards>}
        </div>
    );
}

export default SearchComponent;