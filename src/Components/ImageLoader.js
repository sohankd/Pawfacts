
export default function lazyload ($el){
    let isNodeList = $el instanceof NodeList
    ,   isHTMLElement = $el instanceof HTMLElement
    ,   $images = (isHTMLElement && $el.querySelectorAll('[data-src], [data-srcset]')) || (isNodeList && $el)
    ,   isEmptyNodeList = $images instanceof NodeList && !$images.length;
    
    if(!isHTMLElement && !isNodeList && isEmptyNodeList){
        return;
    }

    let removePropsAndEventListeners = (e) => {
        let $el = e.currentTarget;

        $el.classList && $el.classList.remove('lazyload');
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
                    if(entry.target.getAttribute('data-src')){
                        entry.target.src = entry.target.getAttribute('data-src');
                    }
                    else if(entry.target.getAttribute('data-srcset')){
                        entry.target.srcset = entry.target.getAttribute('data-srcset');
                    }
                    
                    imageObserver.unobserve(entry.target);
                }
            });
        }, {threshold: 0, rootMargin: '0px 0px 0px 0px'});
        
    $images.forEach($image => {
        let isImageSupportedElement = !!~['IMG', 'PICTURE', 'FIGURE'].indexOf($image.tagName)
        ,   hasSameSrcValue = $image.getAttribute('src') === $image.getAttribute('data-src')
        ,   hasSameSrcSetValue = $image.getAttribute('srcset') === $image.getAttribute('data-srcset');
        
        if(isImageSupportedElement && (!hasSameSrcSetValue || !hasSameSrcValue)){
            imageObserver.observe($image);
            $image.addEventListener('load', removePropsAndEventListeners);
            $image.addEventListener('error', imageOnError);
        }
    });

    return imageObserver;
}