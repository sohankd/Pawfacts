import { useEffect, useRef } from "react";

export default function useLazyLoad($el){
    let lazyloadObserver = useRef(null);

    useEffect(()=>{
        lazyloadObserver.current = !lazyloadObserver.current ? lazyload($el.current) : lazyloadObserver.current;
    });
}

function lazyload ($el){
    let isNodeList = $el instanceof NodeList
    ,   isHTMLElement = $el instanceof HTMLElement
    ,   $images = (isHTMLElement && $el.querySelectorAll('[data-src], [data-srcset]')) || (isNodeList && $el)
    ,   isEmptyNodeList = $images instanceof NodeList && !$images.length;
    
    if(!isHTMLElement && !isNodeList && isEmptyNodeList){
        return;
    }

    let isElementInViewPort = (el) => {
            let rect = el.getBoundingClientRect();

            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    ,   updateSrcAttributes = (el) => {
            if(!el.getAttribute('src') && el.getAttribute('data-src')){
                el.src = el.getAttribute('data-src');
            }
            else if(!el.getAttribute('srcset') && el.getAttribute('data-srcset')){
                el.srcset = el.getAttribute('data-srcset');
            }
        }
    ,   removePropsAndEventListeners = (e) => {
            let $el = e.currentTarget;

            $el.removeAttribute('data-src');
            $el.removeAttribute('data-srcset');
            $el.removeEventListener('load', removePropsAndEventListeners);
            $el.removeEventListener('error', imageOnError);
        }
    ,   imageOnError = (e) => {
            e.currentTarget.src = 'img/no_image.svg';
            removePropsAndEventListeners(e);
        }
    ,   imageObserver = new IntersectionObserver(function(entries, imageObserver){
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    entry.target.classList.add('lazyload-blur');
                    (entry.intersectionRatio > 0.25) && updateSrcAttributes(entry.target);
                    
                    if(entry.intersectionRatio > 0.5){
                        entry.target.classList.remove('lazyload-blur');
                        imageObserver.unobserve(entry.target);
                    }
                }
            });
        }, {threshold: [0, 0.25, 0.75], rootMargin: '0px 0px 0px 0px'});
        
    $images.forEach($image => {
        let isImageSupportedElement = !!~['IMG', 'PICTURE', 'FIGURE'].indexOf($image.tagName)
        ,   hasSameSrcValue = $image.getAttribute('src') === $image.getAttribute('data-src')
        ,   hasSameSrcSetValue = $image.getAttribute('srcset') === $image.getAttribute('data-srcset');
        
        if(isImageSupportedElement && (!hasSameSrcSetValue || !hasSameSrcValue)){
            $image.addEventListener('load', removePropsAndEventListeners);
            $image.addEventListener('error', imageOnError);
            !!isElementInViewPort($image) ? updateSrcAttributes($image) : imageObserver.observe($image);
        }
    });

    return imageObserver;
}