const jwt = require('jsonwebtoken');
const Landlord = require('../models/Landlord');
const Tenant = require('../models/Tenant');

const checkUser = async (req, res, next) => {
    const token = req.header('authtoken');
    const accountType = req.header('accounttype');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        let user;

        if (accountType === 'landlord') {
            user = await Landlord.findById(verified.id);
        } else if (accountType === 'tenant') {
            user = await Tenant.findById(verified.id);
        } else {
            return res.status(400).json({ message: 'Invalid account type' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

module.exports = checkUser;