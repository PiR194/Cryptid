const sqlite3 = require('sqlite3');
const path = require('path');
const { rejects } = require('assert');

class DatabaseService {
    constructor(){
        this.db_name = "socialgraph";
    }

    // ----------------------------------------------------
    // ------------------- UTILITAIRE ---------------------
    // ----------------------------------------------------

    async connect(client){
        const dbPath = path.resolve(__dirname, `../../../db/${this.db_name}.db`)
        
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


    // ----------------------------------------------------
    // ------------------- UTILISATEUR --------------------
    // ----------------------------------------------------

    // Récupère l'utilisateur par son id
    async getUserByID(id){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT * FROM users WHERE idUser = ?', id, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
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

    async deleteUser(userId){
        return new Promise((resolve, reject) => {
            this.client.run('DELETE FROM users WHERE idUser=?', userId, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async updatePseudo(userId, newPseudo){
        return new Promise((resolve, reject) => {
            this.client.run('UPDATE users SET pseudo = ? WHERE idUser = ?', newPseudo, userId, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async updatePassword(userId, newPassword){
        return new Promise((resolve, reject) => {
            this.client.run('UPDATE users SET password = ? WHERE idUser = ?', newPassword, userId, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    // -------------------------------------------------------------
    // ------------------- STATS MASTERMIND ------------------------
    // -------------------------------------------------------------
    
    async getNbGamesMastermindByUserId(userId){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT COUNT(*) AS nbGames FROM games WHERE idUser = ? AND gameType = ?', userId, "mastermind", (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async getBestScoreMastermindByUserId(userId){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT MIN(score) AS bestScore FROM games WHERE idUser = ? AND gameType = ?', userId, "mastermind", (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async getAvgNbTryMastermindByUserId(userId){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT AVG(score) AS avgNbTry FROM games WHERE idUser = ? AND gameType = ?', userId, "mastermind", (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async addMastermindStats(userId, score, time){
        return new Promise((resolve, reject) => {
            this.client.run('INSERT INTO games (idUser, gameType, win, score, time) VALUES (?, ?, ?, ?, ?)', userId, "mastermind", 1, score, time, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }
    // -------------------------------------------------------------
    // ------------------- STATS EN LIGNE --------------------------
    // -------------------------------------------------------------

    async getNbGamesOnlineByUserId(userId){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT COUNT(*) AS nbGames FROM games WHERE idUser = ? AND gameType = ?', userId, "multijoueur", (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async getNbWinsOnlineByUserId(userId){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT COUNT(*) AS nbWins FROM games WHERE idUser = ? AND gameType = ? AND win = ?', userId, "multijoueur", 1, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async addOnlineStats(userId, win, time){
        return new Promise((resolve, reject) => {
            this.client.run('INSERT INTO games (idUser, gameType, win, score, time) VALUES (?, ?, ?, ?, ?)', userId, "multijoueur", win, 0, time, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    // -------------------------------------------------------------
    // ------------------- STATS ENIGME ----------------------------
    // -------------------------------------------------------------

    async getNbGamesEnigmeByUserId(userId, enigmaLevel){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT COUNT(*) AS nbGames FROM games WHERE idUser = ? AND gameType = ?', userId, enigmaLevel, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async getNbWinsEnigmeByUserId(userId, enigmaLevel){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT COUNT(*) AS nbWins FROM games WHERE idUser = ? AND gameType = ? AND win = ?', userId, enigmaLevel, 1, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async getBestScoreEnigmeByUserId(userId, enigmaLevel){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT MAX(score) AS bestScore FROM games WHERE idUser = ? AND gameType = ?', userId, enigmaLevel, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async getAvgScoreEnigmeByUserId(userId, enigmaLevel){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT AVG(score) AS avgScore FROM games WHERE idUser = ? AND gameType = ?', userId, enigmaLevel, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async getBestTimeEnigmeByUserId(userId, enigmaLevel){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT MIN(time) AS bestTime FROM games WHERE idUser = ? AND gameType = ?', userId, enigmaLevel, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async getAvgTimeEnigmeByUserId(userId, enigmaLevel){
        return new Promise((resolve, reject) => {
            this.client.get('SELECT AVG(time) AS avgTime FROM games WHERE idUser = ? AND gameType = ?', userId, enigmaLevel, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    async addEasyEnigmaStats(userId, enigmaLevel, win, time){
        return new Promise((resolve, reject) => {
            this.client.run('INSERT INTO games (idUser, gameType, win, score, time) VALUES (?, ?, ?, ?, ?)', userId, enigmaLevel, win, 0, time, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    // async addMediumEnigmaStats(userId, enigmaLevel, score)

    async addHardEnigmaStats(userId, enigmaLevel, win, time){
        return new Promise((resolve, reject) => {
            this.client.run('INSERT INTO games (idUser, gameType, win, score, time) VALUES (?, ?, ?, ?, ?)', userId, enigmaLevel, win, 0, time, (err, result) => {
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