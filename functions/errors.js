const error = (text = "Unknown error", code = 1) => {
    const error = new Error(text);
    
    throw error;
};

const paramError = Parameter => error(`Parameter ${Parameter} is required`);

module.exports = {
    error,
    paramError
};
