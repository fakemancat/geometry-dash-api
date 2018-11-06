module.exports = (num, maxElements = 10) => {
    let pages = num / maxElements;

    if ((pages % 1) == 0) {
        pages = Math.floor(pages);
    }
    else {
        pages = Math.floor(pages) + 1;
    }
    
    return pages;
};
