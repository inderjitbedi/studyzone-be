const makeExpressCallback = (controller) => {
    console.log("controller = ",controller);
    return async (req, res) => {
        try {
            const response = await controller(req);
            if (response.headers) {
                res.set(response.headers);
            }
            res.status(response.statusCode).send(response.body);
        } catch (error) {
            res.status(500).send({ error: 'Internal server error' });
        }
    };
};
module.exports= makeExpressCallback