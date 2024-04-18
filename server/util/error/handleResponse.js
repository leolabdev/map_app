
export  function handleResponse(err, req, res, next){
    const status = err.status || 500;
    res.status(status).json({
        errors: [err.message || 'An unknown error occurred'],
        result: {}
    });
};