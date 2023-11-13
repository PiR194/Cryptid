const mysql = require('mysql');

class DatabaseService {
    constructor() {
        this.client = mysql.createConnection({
            host:'localhost',
            user:'root',
            password:'',
            database:'cryptide'
        });
    }

    async connect(){
        return new Promise((resolve, reject) => {
            this.client.connect((err) => {
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

    // Récupère l'utilisateur par son pseudo
    async getUserByPseudo(pseudo){
        return new Promise((resolve, reject) => {
            this.client.query('SELECT * FROM users WHERE pseudo = ?', [pseudo], (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result[0]);
                }
            });
        });
    }

    // Insert le pseudo et le mot de passe dans la table users
    async insertUser(user){
        return new Promise((resolve, reject) => {
            this.client.query('INSERT INTO users SET ?', user, (err, result) => {
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