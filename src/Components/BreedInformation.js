import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useMetadata from "../CustomHooks/useMetaData";
import { searchForBreed, getImage } from './TheDogAPI';

function BreedInformation(props){
    let {breedName} = useParams()
    ,   [breed, setBreed] = useState(null)
    ,   [standardUnit, setStandardUnit] = useState('metric')
    ,   hasDataFetched = useRef(false);

    breedName = breedName.replace(/_/g, ' ');

    useEffect(() => {
        if(!hasDataFetched.current){
            searchForBreed(breedName)
                .then(results => {
                    let actualBreed = (results || []).find(breed => breed['name'] === breedName);
                    
                    if(actualBreed){
                        getImage({
                            breedID: actualBreed['id'],
                            imageSize: 'med',
                            limit: 10
                        })
                        .then(response => {
                            var imagesSortedByDimensions = (response || []).sort((imgA, imgB) => {
                                if(imgA['width'] > imgB['width'] && imgA['height'] > imgB['height'])
                                    return -1;
                                else if(imgA['width'] < imgB['width'] && imgA['height'] < imgB['height'])
                                    return 1;
                                else
                                    return 0;
                            });
                            
                            setBreed(prevState => ({...prevState, images: imagesSortedByDimensions}));
                        });
                        setBreed(actualBreed);
                    }
                });

            hasDataFetched.current = !hasDataFetched.current;
        }
    });

    useMetadata({
        title: `${breedName} | Pawfacts | Know Your Dog`
    ,   metaTagData: [
            {name: 'keywords', content: breedName}
        ,   {name: 'description', content: breedName}
        ]
    });

    function updateMeasurementUnit(){
        setStandardUnit(standardUnit === 'metric' ? 'imperial' : 'metric');
    }

    return(
        <div className="breed-container">
            {breed ?
            <div className="breed-primary-row">
                <div className="breed-thumbnail-wrapper">
                    <img src={breed && breed.images && breed.images.length ? breed.images[breed.images.length - 1].url : ''} alt={breed ? breed.name : ''} className="breed-thumbnail" />
                </div>
                <div className="breed-details-wrapper">
                    <h1 className="breed-name">{breed ? breed.name : breedName}</h1>
                    <div className="breed-characterstics-wrapper">
                        {breed && breed['bred_for'] &&
                        <p className="breed-characterstic flex">
                            <span className="breed-characterstic-label">Bred for:</span>
                            <span className="breed-characterstic-value">{breed['bred_for']}</span>
                        </p>
                        }
                        {breed && breed['life_span'] &&
                        <p className="breed-characterstic">
                            <span className="breed-characterstic-label">Life Span:</span>
                            <span className="breed-characterstic-value">{breed['life_span']}</span>
                        </p>
                        }
                        {breed && breed['temperament'] &&
                        <p className="breed-characterstic flex">
                            <span className="breed-characterstic-label">Temperant:</span>
                            <span className="breed-characterstic-value">{breed['temperament']}</span>
                        </p>
                        }
                        {breed && breed['weight'] && breed['weight'][standardUnit] &&
                        <p className="breed-characterstic">
                            <span className="breed-characterstic-label">Weight:</span>
                            <span className="breed-characterstic-value">
                                {breed['weight'][standardUnit]}
                                <span style={{marginLeft: '3px'}}>{standardUnit === 'metric' ? 'Kg' : 'lbs'}</span>
                            </span>
                            {breed['weight']['metric'] && breed['weight']['imperial'] &&
                            <label htmlFor="weight-unit" className={"breed-characterstic-measurement-unit-wrapper " + standardUnit}>
                                <input className="breed-characterstic-measurement-unit-toggler" onChange={updateMeasurementUnit} type="checkbox" name="weight-unit" id="weight-unit"/>
                                <span className="breed-characterstic-measurement-unit">Imperial</span>
                                <span className="breed-characterstic-measurement-unit">Metric</span>
                            </label>
                            }
                        </p>
                        }
                        {breed && breed['height'] && breed['height'][standardUnit] &&
                        <p className="breed-characterstic">
                            <span className="breed-characterstic-label">Height:</span>
                            <span className="breed-characterstic-value">
                                {breed['height'][standardUnit]}
                                <span style={{marginLeft: '3px'}}>{standardUnit === 'metric' ? 'cm' : 'in'}</span>
                            </span>
                        </p>
                        }
                        {breed && breed['origin'] &&
                        <p className="breed-characterstic">
                            <span className="breed-characterstic-label">Country of Origin:</span>
                            <span className="breed-characterstic-value">{breed['origin']}</span>
                        </p>
                        }
                    </div>
                </div>
            </div>
            :
            <div className="breed-skeleton-container">
                <div className="breed-skeleton-primary-row"></div>
                <div className="breed-skeleton-secondary-row"></div>
            </div>
            }
            {breed && breed['description'] &&
            <div className="breed-description-wrapper">
                <h2 className="breed-description-header">Description</h2>
                <div className="breed-description">{breed['description']}</div>
            </div>
            }
        </div>
    );
}
export default BreedInformation;