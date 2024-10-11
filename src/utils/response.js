const responseOk = (res, status, data, page) => {
    if (!page) {
        return res.status(status).json({
            data
        }).end()
    }
    return res.status(status).json({
        data,
        page: {
            size: page.size,
            total: page.total,
            totalPages: page.totalPages,
            current: page.current
        }
    }).end()
}

const responseErr = (res, status, error) => {
    return res.status(status).json({
        error,
    }).end();
}

export {
    responseOk,
    responseErr
};