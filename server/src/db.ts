// @ts-ignore
import Database from 'better-sqlite3'; // Erreur de syntaxe dans l'export du @types/better-sqlite3

// Connexion et création de la table
const db = new Database('./db.sqlite3');
db.exec('CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, cps INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');


// Préparation des requêtes
const addScore = db.prepare('INSERT INTO scores (username, cps) VALUES (@username, @cps)');
const getScore = db.prepare('SELECT * FROM scores ORDER BY cps DESC');
const getLastScore = db.prepare('SELECT * FROM scores WHERE id=? LIMIT 1')
const deleteScore = db.prepare('DELETE FROM scores WHERE id=?')

export {addScore, getScore, getLastScore, deleteScore};