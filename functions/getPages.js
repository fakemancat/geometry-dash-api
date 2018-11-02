module.exports = (num) => {
    let pages = num / 10;

    if ((pages % 1) == 0) {
        pages = Math.floor(pages);
    }
    else {
        pages = Math.floor(pages) + 1;
    }
    
    return pages;
};
