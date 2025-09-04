const JWT = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(200).send({
                success: false,
                message: "Token is blank",
            })
        }

        const newToken = token.slice(7);

        JWT.verify(newToken, process.env.JWT_SECRET || 'secret', (err, decode) => {
            if (err) {
                // if token expired
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).send({
                        success: false,
                        message: "Token expired",

                    })
                }
                return res.status(400).send({
                    success: false,
                    message: "Token is not valid",
                })
            }
            req.user = decode;

            return next();
        })

    } catch (err) {
        return res.status(501).send({
            success: false,
            error: err
        })
    }
}




module.exports = {
    verifyToken
}