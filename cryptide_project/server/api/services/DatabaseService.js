const mysql = require('mysql2');
const path = require('path');
const { rejects } = require('assert');

class DatabaseService {

    // ----------------------------------------------------
    // ------------------- UTILITAIRE ---------------------
    // ----------------------------------------------------

    async connect() {

        const mysqlHost = process.env.MYSQL_HOST;
        const mysqlUser = process.env.MYSQL_USER;
        const mysqlPassword = process.env.MYSQL_PASSWORD;
        const mysqlDatabase = process.env.MYSQL_DATABASE;
        const createTables = process.env.CREATETABLES

        const dbConfig = {
            host: mysqlHost,
            user: mysqlUser,
            password: mysqlPassword,
            database: mysqlDatabase
        };

        return new Promise((resolve, reject) => {
            this.client = mysql.createConnection(dbConfig);
            console.log(createTables)

            this.client.connect((err) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    if (createTables === "true"){
                        this.createTables()
                        console.log("create table")
                    }
                    resolve();
                }
            });
        });
    }

    async createTables(){
        try {
            // Requête SQL pour créer la table 'users'
            const createTableQuery = `
              CREATE TABLE IF NOT EXISTS users (
                idUser INT AUTO_INCREMENT PRIMARY KEY,
                pseudo VARCHAR(50) NOT NULL,
                password VARCHAR(60) NOT NULL,
                profilePicture LONGBLOB,
                createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              );
            `;
        
            // Exécuter la requête SQL
            this.client.query(createTableQuery, (err, result) => {
                if(err){
                    console.log(err)
                }
                else{
                    console.log("Table user créée")
                }
            });

            const createTableGameQuery = `
            CREATE TABLE IF NOT EXISTS games (
                idGame INT AUTO_INCREMENT PRIMARY KEY,
                idUser INT NOT NULL,
                gameType VARCHAR(50) CHECK(gameType IN ('mastermind','enigme_facile','enigme_moyenne','enigme_difficile','multijoueur')),
                win INT CHECK(win IN (0,1)) DEFAULT 0,
                score INT NOT NULL DEFAULT 0,
                time REAL NOT NULL DEFAULT 0,
                playedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (idUser) REFERENCES users(idUser)
            );
            `;

            this.client.query(createTableGameQuery, (err, result) => {
                if(err){
                    console.log(err)
                }
                else{
                    console.log("Table user créée")
                }
            });

        }
        catch(error){
            console.log(error)
        }
    }

    async disconnect(){
        return new Promise((resolve, reject) => {
            this.client.end((err) => {
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
            this.client.query('SELECT * FROM users WHERE idUser = ?', [id], (err, result) => {
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
            this.client.query('SELECT * FROM users WHERE pseudo = ?', [pseudo], (err, result) => {
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
            this.client.query('INSERT INTO users (pseudo, password) VALUES (?, ?)', [pseudo, password], (err, result) => {
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
            this.client.query('DELETE FROM users WHERE idUser=?', [userId], (err, result) => {
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
            this.client.query('UPDATE users SET pseudo = ? WHERE idUser = ?', [newPseudo, userId], (err, result) => {
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
            this.client.query('UPDATE users SET password = ? WHERE idUser = ?', [newPassword, userId], (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }

    // ---------------------------------------------------------------
    // ------------------- STATS JOURNALIERE -------------------------
    // ---------------------------------------------------------------

    async getDailyMastermindStats() {
        return new Promise((resolve, reject) => {
            // Obtenez la date actuelle au format AAAA-MM-JJ
            const currentDate = new Date().toISOString().slice(0, 10);

            // Récupérer les 5 meilleurs scores de la journée
            this.client.query(
                'SELECT pseudo, score FROM users INNER JOIN games ON users.idUser = games.idUser WHERE gameType = ? AND SUBSTR(playedDate, 1, 10) = ? ORDER BY score ASC LIMIT 10',
                ["mastermind",
                currentDate],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }

    async getDailyEnigmaStats(enigmaLevel) {
        return new Promise((resolve, reject) => {
            const currentDate = new Date().toISOString().slice(0, 10);

            this.client.query(
                'SELECT pseudo, time FROM users INNER JOIN games ON users.idUser = games.idUser WHERE gameType = ? AND SUBSTR(playedDate, 1, 10) = ? ORDER BY time ASC LIMIT 10',
                [enigmaLevel,
                currentDate],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }

    async getDailyOnlineStats() {
        return new Promise((resolve, reject) => {
            const currentDate = new Date().toISOString().slice(0, 10);
    
            this.client.query(
                'SELECT pseudo, COUNT(*) AS wins FROM users INNER JOIN games ON users.idUser = games.idUser WHERE gameType = ? AND SUBSTR(playedDate, 1, 10) = ? AND win = ? GROUP BY users.idUser ORDER BY wins ASC LIMIT 10',
                ["multijoueur", currentDate, 1],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }
    
    
    // ---------------------------------------------------------------
    // ------------------- STATS HEBDOMADAIRE ------------------------
    // ---------------------------------------------------------------

    async getWeeklyMastermindStats() {
        return new Promise((resolve, reject) => {
            const currentDate = new Date().toISOString().slice(0, 10);
            const currentDay = new Date().getDay();
            const firstDayOfWeek = new Date(new Date().setDate(new Date().getDate() - currentDay)).toISOString().slice(0, 10);

            this.client.all(
                'SELECT pseudo, score FROM users INNER JOIN games ON users.idUser = games.idUser WHERE gameType = ? AND SUBSTR(playedDate, 1, 10) BETWEEN ? AND ? ORDER BY score ASC LIMIT 10',
                ["mastermind",
                firstDayOfWeek,
                currentDate],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }

    async getWeeklyEnigmaStats(enigmaLevel) {
        return new Promise((resolve, reject) => {
            const currentDate = new Date().toISOString().slice(0, 10);
            const currentDay = new Date().getDay();
            const firstDayOfWeek = new Date(new Date().setDate(new Date().getDate() - currentDay)).toISOString().slice(0, 10);

            this.client.query(
                'SELECT pseudo, time FROM users INNER JOIN games ON users.idUser = games.idUser WHERE gameType = ? AND SUBSTR(playedDate, 1, 10) BETWEEN ? AND ? ORDER BY time ASC LIMIT 10',
                [enigmaLevel,
                firstDayOfWeek,
                currentDate],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }

    async getWeeklyOnlineStats() {
        return new Promise((resolve, reject) => {
            const currentDate = new Date().toISOString().slice(0, 10);
            const currentDay = new Date().getDay();
            const firstDayOfWeek = new Date(new Date().setDate(new Date().getDate() - currentDay)).toISOString().slice(0, 10);

            this.client.query(
                'SELECT pseudo, COUNT(*) as wins FROM users INNER JOIN games ON users.idUser = games.idUser WHERE gameType = ? AND SUBSTR(playedDate, 1, 10) BETWEEN ? AND ? AND win = ? ORDER BY wins ASC LIMIT 10',
                ["multijoueur",
                firstDayOfWeek,
                currentDate,
                1],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }

    // -------------------------------------------------------------
    // ------------------- STATS MASTERMIND ------------------------
    // -------------------------------------------------------------
    
    async getNbGamesMastermindByUserId(userId){
        return new Promise((resolve, reject) => {
            this.client.query('SELECT COUNT(*) AS nbGames FROM games WHERE idUser = ? AND gameType = ?', [userId, "mastermind"], (err, result) => {
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
            this.client.query('SELECT MIN(score) AS bestScore FROM games WHERE idUser = ? AND gameType = ?', [userId, "mastermind"], (err, result) => {
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
            this.client.query('SELECT AVG(score) AS avgNbTry FROM games WHERE idUser = ? AND gameType = ?', [userId, "mastermind"], (err, result) => {
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
            this.client.query('INSERT INTO games (idUser, gameType, win, score, time) VALUES (?, ?, ?, ?, ?)', [userId, "mastermind", 1, score, time], (err, result) => {
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
            this.client.query('SELECT COUNT(*) AS nbGames FROM games WHERE idUser = ? AND gameType = ?', [userId, "multijoueur"], (err, result) => {
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
            this.client.query('SELECT COUNT(*) AS nbWins FROM games WHERE idUser = ? AND gameType = ? AND win = ?', [userId, "multijoueur", 1], (err, result) => {
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
            this.client.query('INSERT INTO games (idUser, gameType, win, score, time) VALUES (?, ?, ?, ?, ?)', [userId, "multijoueur", win, 0, time], (err, result) => {
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
            this.client.query('SELECT COUNT(*) AS nbGames FROM games WHERE idUser = ? AND gameType = ?', [userId, enigmaLevel], (err, result) => {
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
            this.client.query('SELECT COUNT(*) AS nbWins FROM games WHERE idUser = ? AND gameType = ? AND win = ?', [userId, enigmaLevel, 1], (err, result) => {
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
            this.client.query('SELECT MAX(score) AS bestScore FROM games WHERE idUser = ? AND gameType = ?', [userId, enigmaLevel], (err, result) => {
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
            this.client.query('SELECT AVG(score) AS avgScore FROM games WHERE idUser = ? AND gameType = ?', [userId, enigmaLevel], (err, result) => {
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
            this.client.query('SELECT MIN(time) AS bestTime FROM games WHERE idUser = ? AND gameType = ?', [userId, enigmaLevel], (err, result) => {
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
            this.client.query('SELECT AVG(time) AS avgTime FROM games WHERE idUser = ? AND gameType = ?', [userId, enigmaLevel], (err, result) => {
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
            this.client.query('INSERT INTO games (idUser, gameType, win, score, time) VALUES (?, ?, ?, ?, ?)', [userId, enigmaLevel, win, 0, time], (err, result) => {
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
            this.client.query('INSERT INTO games (idUser, gameType, win, score, time) VALUES (?, ?, ?, ?, ?)', [userId, enigmaLevel, win, 0, time], (err, result) => {
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