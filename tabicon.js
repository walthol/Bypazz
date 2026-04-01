function setFavicon(iconPath) {
    let link = document.querySelector("link[rel~='icon']");
    
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    
    link.href = iconPath;
}

setFavicon('/icon/bypazzicon.png');
