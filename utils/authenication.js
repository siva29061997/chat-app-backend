const jwt = require('jsonwebtoken');

exports.isAuth = async (req, res, next) => {
    const { cookies } = req;

    const data = jwt.verify(cookies.accessToken, process.env.SECRET_KEY);
    req.id = data._id;
    if(!req.id){
        return res.status(401).send({message: 'Not authorized.'})
    }

    next();
}