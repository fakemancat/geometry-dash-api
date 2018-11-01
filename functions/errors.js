const error = (text = "Unknown error") => {
    const error = new Error(text);
    
    throw error;
};

const syntaxError = (text = "Unknown error") => {
    const error = new SyntaxError(text);
    
    throw error;
};

module.exports = {
    error,
    syntaxError
};
