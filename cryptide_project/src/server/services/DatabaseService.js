const sqlite3 = require('sqlite3');
const path = require('path');

class DatabaseService {
    constructor(){
        this.db_name = "socialgraph";
    }

    async connect(client){
        const dbPath = path.resolve(__dirname, `../db/${this.db_name}.db`)
        
        return new Promise((resolve, reject) => {
            this.client = new sqlite3.Database(dbPath, 
            sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, 
            (err) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve();
                }
            });
        });
    }

    async disconnect(){
        return new Promise((resolve, reject) => {
            this.client.close((err) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve();
                }
            });
        });
    }

    // Récupère l'utilisateur par son pseudo
    async getUserByPseudo(pseudo){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT * FROM users WHERE pseudo = ?', pseudo, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    // Récupère stats solo de l'utilisateur
    async getSoloStatsByUserId(userId){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT * FROM solo_stats WHERE idUser = ?', userId, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    // Récupère stats online de l'utilisateur
    async getOnlineStatsByUserId(userId){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT * FROM online_stats WHERE idUser = ?', userId, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    // insère un utilisateur dans la base de données
    async insertUser(user) {
        return new Promise((resolve, reject) => {
            const { pseudo, password } = user;
            this.client.run('INSERT INTO users (pseudo, password) VALUES (?, ?)', [pseudo, password], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    // Mettre à jour l'id de stats solo et online de l'utilisateur
    async updateUserIDStats(userId, soloStatsId, onlineStatsId){
        return new Promise((resolve, reject) => {
            this.client.run('UPDATE users SET idSoloStats = ?, idOnlineStats = ? WHERE idUser = ?', [soloStatsId, onlineStatsId, userId], (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }


    async initSoloStats(userId) {
        return new Promise((resolve, reject) => {
            this.client.run('INSERT INTO solo_stats (nbGames, bestScore, avgNbTry, idUser) VALUES (?, ?, ?, ?)', 0,  0, 0.0, userId, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async initOnlineStats(userId) {
        return new Promise((resolve, reject) => {
            this.client.run('INSERT INTO online_stats (nbGames, nbWins, ratio, idUser) VALUES (?, ?, ?, ?)', 0, 0, 0.0, userId, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }
}

module.exports = DatabaseService;