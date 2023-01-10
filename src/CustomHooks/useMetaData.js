import { useEffect } from "react";

export default function useMetadata(metadata){
    
    useEffect(() => {
        let {title, metaTagData} = metadata;
        
        if(title){
            let $title = document.querySelector('title');
            $title && $title.setHTML(title);
        }
        addOrUpdateMetaTags(metaTagData || []);
    });
}

function addOrUpdateMetaTags(metaTagData){
    if(metaTagData.length){
        metaTagData.forEach(({name, content}) => {
            if(name && content){
                let $metaTag = document.querySelector(`meta[name="${name}"]`);
                
                if(!$metaTag){
                    $metaTag = document.createElement('meta');
                    $metaTag.setAttribute('name', name);
                    $metaTag.setAttribute('content', content);
                    document.querySelector('head').appendChild($metaTag);
                }
                else{
                    $metaTag.setAttribute('content', content);
                }
            }
        });
    }
}