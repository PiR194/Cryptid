const DatabaseService = require('../services/DatabaseService');

class SessionController {
    static async getUserInformation(req, res) {
        if (!req.session.user) {
            res.status(200).json({ message: 'Utilisateur non connecté' });
            return;
        }
        res.status(200).json({ user: req.session.user });
    }
}

module.exports = SessionController;