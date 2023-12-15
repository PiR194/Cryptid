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

            this.client.connect(async (err) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    if (createTables === "true"){
                        await this.createTables()
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
                    console.log("Table users créée")
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
                    console.log("Table games créée")
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
        try {
            const [rows] = await this.client.promise().query('SELECT * FROM users WHERE idUser = ?', [id])
            console.log('Rows:', rows);
            return rows[0];
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    // Récupère l'utilisateur par son pseudo
    async getUserByPseudo(pseudo){
        try {
            const [rows] = await this.client.promise().query('SELECT * FROM users WHERE pseudo = ?', [pseudo])
            console.log('Rows:', rows);
            return rows[0];
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async getUsers(){
        try {
            const [rows] = await this.client.promise().query('SELECT * FROM users');
            console.log('Rows:', rows);
            return rows;
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async getGames(){
        try {
            const [rows] = await this.client.promise().query('SELECT * FROM games');
            console.log('Rows:', rows);
            return rows;
          } catch (err) {
            throw new Error(`Error fetching games: ${err.message}`);
          }
    }

    // insère un utilisateur dans la base de données
    async insertUser(user) {
        try {
            const { pseudo, password } = user;
            const [rows] = await this.client.promise().query('INSERT INTO users (pseudo, password) VALUES (?, ?)', [pseudo, password])
            console.log('Rows:', rows);
            return rows;
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async deleteUser(userId){
        try {
            const [rows] = await this.client.promise().query('DELETE FROM users WHERE idUser=?', [userId])
            console.log('Rows:', rows);
            return rows;
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async updatePseudo(userId, newPseudo){
        try {
            const [rows] = await this.client.promise().query('UPDATE users SET pseudo = ? WHERE idUser = ?', [newPseudo, userId])
            console.log('Rows:', rows);
            return rows;
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async updatePassword(userId, newPassword){
        try {
            const [rows] = await this.client.promise().query('UPDATE users SET password = ? WHERE idUser = ?', [newPassword, userId])
            console.log('Rows:', rows);
            return rows;
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    // ---------------------------------------------------------------
    // ------------------- STATS JOURNALIERE -------------------------
    // ---------------------------------------------------------------

    async getDailyMastermindStats() {
        try {
            const currentDate = new Date().toISOString().slice(0, 10);
            const [rows] = await this.client.promise().query('SELECT pseudo, score FROM users INNER JOIN games ON users.idUser = games.idUser WHERE gameType = ? AND SUBSTR(playedDate, 1, 10) = ? ORDER BY score ASC LIMIT 10',
            ["mastermind",
            currentDate])
            return rows;
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async getDailyEnigmaStats(enigmaLevel) {
        try {
            const currentDate = new Date().toISOString().slice(0, 10);
            const [rows] = await this.client.promise().query('SELECT pseudo, time FROM users INNER JOIN games ON users.idUser = games.idUser WHERE gameType = ? AND SUBSTR(playedDate, 1, 10) = ? ORDER BY time ASC LIMIT 10',
            [enigmaLevel,
            currentDate])
            return rows;
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async getDailyOnlineStats() {
        try {
            const currentDate = new Date().toISOString().slice(0, 10);
            const [rows] = await this.client.promise().query('SELECT pseudo, COUNT(*) AS wins FROM users INNER JOIN games ON users.idUser = games.idUser WHERE gameType = ? AND SUBSTR(playedDate, 1, 10) = ? AND win = ? GROUP BY users.idUser ORDER BY wins ASC LIMIT 10',
            ["multijoueur", currentDate, 1])
            return rows;
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
        
    }
    
    
    // ---------------------------------------------------------------
    // ------------------- STATS HEBDOMADAIRE ------------------------
    // ---------------------------------------------------------------

    async getWeeklyMastermindStats() {
        try {
            const currentDate = new Date().toISOString().slice(0, 10);
            const currentDay = new Date().getDay();
            const firstDayOfWeek = new Date(new Date().setDate(new Date().getDate() - currentDay)).toISOString().slice(0, 10);
            const [rows] = await this.client.promise().query('SELECT pseudo, score FROM users INNER JOIN games ON users.idUser = games.idUser WHERE gameType = ? AND SUBSTR(playedDate, 1, 10) BETWEEN ? AND ? ORDER BY score ASC LIMIT 10',
            ["mastermind",
            firstDayOfWeek,
            currentDate])
            return rows;
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async getWeeklyEnigmaStats(enigmaLevel) {
        try {
            const currentDate = new Date().toISOString().slice(0, 10);
            const currentDay = new Date().getDay();
            const firstDayOfWeek = new Date(new Date().setDate(new Date().getDate() - currentDay)).toISOString().slice(0, 10);
            const [rows] = await this.client.promise().query('SELECT pseudo, time FROM users INNER JOIN games ON users.idUser = games.idUser WHERE gameType = ? AND SUBSTR(playedDate, 1, 10) BETWEEN ? AND ? ORDER BY time ASC LIMIT 10',
            [enigmaLevel,
            firstDayOfWeek,
            currentDate])
            return rows;
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async getWeeklyOnlineStats() {
        try {
            const currentDate = new Date().toISOString().slice(0, 10);
            const currentDay = new Date().getDay();
            const firstDayOfWeek = new Date(new Date().setDate(new Date().getDate() - currentDay)).toISOString().slice(0, 10);
            const [rows] = await this.client.promise().query(`
            SELECT users.pseudo, COUNT(*) as wins
            FROM users
            INNER JOIN games ON users.idUser = games.idUser
            WHERE gameType = ? AND SUBSTR(playedDate, 1, 10) BETWEEN ? AND ? AND win = ?
            GROUP BY users.pseudo
            ORDER BY wins ASC
            LIMIT 10;
            `,
        ["multijoueur",
        firstDayOfWeek,
        currentDate,
        1])
            return rows;
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    // -------------------------------------------------------------
    // ------------------- STATS MASTERMIND ------------------------
    // -------------------------------------------------------------
    
    async getNbGamesMastermindByUserId(userId){
        try {
            const [rows] = await this.client.promise().query('SELECT COUNT(*) AS nbGames FROM games WHERE idUser = ? AND gameType = ?', [userId, "mastermind"])
            return rows[0];
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async getBestScoreMastermindByUserId(userId){
        try {
            const [rows] = await this.client.promise().query('SELECT MIN(score) AS bestScore FROM games WHERE idUser = ? AND gameType = ?', [userId, "mastermind"])
            return rows[0];
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async getAvgNbTryMastermindByUserId(userId){
        try {
            const [rows] = await this.client.promise().query('SELECT AVG(score) AS avgNbTry FROM games WHERE idUser = ? AND gameType = ?', [userId, "mastermind"])
            return rows[0];
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async addMastermindStats(userId, score, time){
        try {
            const [rows] = await this.client.promise().query('INSERT INTO games (idUser, gameType, win, score, time) VALUES (?, ?, ?, ?, ?)', [userId, "mastermind", 1, score, time])
            return rows[0];
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }
    // -------------------------------------------------------------
    // ------------------- STATS EN LIGNE --------------------------
    // -------------------------------------------------------------

    async getNbGamesOnlineByUserId(userId){
        try {
            const [rows] = await this.client.promise().query('SELECT COUNT(*) AS nbGames FROM games WHERE idUser = ? AND gameType = ?', [userId, "multijoueur"])
            return rows[0];
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async getNbWinsOnlineByUserId(userId){
        try {
            const [rows] = await this.client.promise().query('SELECT COUNT(*) AS nbWins FROM games WHERE idUser = ? AND gameType = ? AND win = ?', [userId, "multijoueur", 1])
            return rows[0];
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async addOnlineStats(userId, win, time){
        try {
            const [rows] = await this.client.promise().query('INSERT INTO games (idUser, gameType, win, score, time) VALUES (?, ?, ?, ?, ?)', [userId, "multijoueur", win, 0, time])
            return rows;
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    // -------------------------------------------------------------
    // ------------------- STATS ENIGME ----------------------------
    // -------------------------------------------------------------

    async getNbGamesEnigmeByUserId(userId, enigmaLevel){
        try {
            const [rows] = await this.client.promise().query('SELECT COUNT(*) AS nbGames FROM games WHERE idUser = ? AND gameType = ?', [userId, enigmaLevel])
            return rows[0];
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async getNbWinsEnigmeByUserId(userId, enigmaLevel){
        try {
            const [rows] = await this.client.promise().query('SELECT COUNT(*) AS nbWins FROM games WHERE idUser = ? AND gameType = ? AND win = ?', [userId, enigmaLevel, 1])
            return rows[0];
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async getBestScoreEnigmeByUserId(userId, enigmaLevel){
        try {
            const [rows] = await this.client.promise().query('SELECT MAX(score) AS bestScore FROM games WHERE idUser = ? AND gameType = ?', [userId, enigmaLevel])
            return rows[0];
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async getAvgScoreEnigmeByUserId(userId, enigmaLevel){
        try {
            const [rows] = await this.client.promise().query('SELECT AVG(score) AS avgScore FROM games WHERE idUser = ? AND gameType = ?', [userId, enigmaLevel])
            return rows[0];
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async getBestTimeEnigmeByUserId(userId, enigmaLevel){
        try {
            const [rows] = await this.client.promise().query('SELECT MIN(time) AS bestTime FROM games WHERE idUser = ? AND gameType = ?', [userId, enigmaLevel])
            return rows[0];
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async getAvgTimeEnigmeByUserId(userId, enigmaLevel){
        try {
            const [rows] = await this.client.promise().query('SELECT AVG(time) AS avgTime FROM games WHERE idUser = ? AND gameType = ?', [userId, enigmaLevel])
            return rows[0];
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    async addEasyEnigmaStats(userId, enigmaLevel, win, time){
        try {
            const [rows] = await this.client.promise().query('INSERT INTO games (idUser, gameType, win, score, time) VALUES (?, ?, ?, ?, ?)', [userId, enigmaLevel, win, 0, time])
            return rows;
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }

    // async addMediumEnigmaStats(userId, enigmaLevel, score)

    async addHardEnigmaStats(userId, enigmaLevel, win, time){
        try {
            const [rows] = await this.client.promise().query('INSERT INTO games (idUser, gameType, win, score, time) VALUES (?, ?, ?, ?, ?)', [userId, enigmaLevel, win, 0, time])
            return rows;
          } catch (err) {
            throw new Error(`Error fetching users: ${err.message}`);
          }
    }
}

module.exports = DatabaseService;