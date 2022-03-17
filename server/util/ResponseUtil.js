class ResponseUtil {
    sendStatusOfOperation(res, status) {
        res.json({
            isSuccess: status
        });

        res.end();
    }

    sendResultOfQuery(res, result) {
        res.json({
            result: result
        });

        res.end();
    }
}

module.exports.ResponseUtil = ResponseUtil;