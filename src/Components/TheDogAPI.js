const baseUrl = 'https://api.thedogapi.com/v1/';

function getBreedList(){
    try {
		let [{page, limit}] = [...arguments]
		,	_url = new URL('breeds', baseUrl);

		!isNaN(Number(page)) && _url.searchParams.set('page', page);
		!isNaN(Number(limit)) && _url.searchParams.set('limit', limit);
        
        return fetch(_url)
        	.then(response => {
                if(!!response.ok && response.status === 200){
                    return response.json()
                        .then(data => Promise.resolve({total: response.headers.get('pagination-count'), breeds: data}));
                }
                return Promise.resolve([]);
            })
        	.catch((error) => console.error(error));
    } catch (error) {
        console.error(error);
    }
    
    return Promise.resolve({});
}

function getImage(){
    try {
		let [{breedID, imageSize, limit}] = [...arguments]
		,	_url = new URL('images/search', baseUrl);

        if(!isNaN(Number(breedID)) && !!imageSize){
            _url.searchParams.set('breed_id', breedID);
            _url.searchParams.set('size', imageSize);
            !!parseInt(limit) && _url.searchParams.set('limit', limit);
            _url.searchParams.set('mime_types', ['webp', 'jpg', 'jpeg']);
        }
        else{
            return Promise.resolve([]);
        }
        
        return fetch(_url)
        	.then(response => {
                if(!!response.ok && response.status === 200){
                    return response.json();
                }
                return Promise.resolve([]);
            })
        	.catch((error) => console.error(error));
    } catch (error) {
        console.error(error);
    }
    
    return Promise.resolve([]);
}

function searchForBreed(query){
    return fetch(`${baseUrl}breeds/search?q=${query}`)
        .then(response => {
            if(!!response.ok && response.status === 200){
                return response.json();
            }
            return Promise.resolve([]);
        })
        .catch((error) => console.error(error));
}

export {getBreedList, getImage, searchForBreed};