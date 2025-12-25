const getYTVideoId = (url) => {
    if (!url) return false;
    
    // Patrón mejorado que soporta: watch, embed, shorts, youtu.be, etc.
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(shorts\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[8].length == 11) ? match[8] : false;
}

export default getYTVideoId;