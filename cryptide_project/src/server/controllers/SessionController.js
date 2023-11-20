const DatabaseService = require('../services/DatabaseService');

class SessionController {
    static async getUserInformation(req, res) {
        try{
            console.log(req.session);
            if (!req.session.user) {
                res.status(200).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({ user: req.session.user });
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur.' });
        }
    }
}

module.exports = SessionController;