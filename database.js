// database.js

const mysql = require('mysql2/promise');

const HOST = 'svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com';
const USER = 'enter-user';
const PASSWORD = 'enter-password';
const DATABASE = 'enter-db';

async function createConnection() {
    try {
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            port: 3333,
            database: DATABASE,
            ssl: {} // Disable certificate verification
        });
        console.log("Connected to the database.");
        return connection;
    } catch (err) {
        console.error("Error connecting to database:", err);
        throw err;
    }
}

async function readComments(connection) {
    const [rows] = await connection.execute('SELECT * FROM comments');
    return rows;
}

async function insertComments(connection, comments) {
    const sql = "INSERT INTO comments (commentid, commenter, comment, gpt, flag , respond) VALUES ?";
    comments = comments.map(c => {
        if (c[2].length > 512) {
            c[2] = c[2].substring(0, 512);  // Truncate to 512 characters
        }
        return c;
    });
    try {
        const [results] = await connection.query(sql, [comments]);
        console.log('Inserted comments:', results);
        return results.insertId;
    } catch (error) {
        console.error("Error inserting comments:", error);
        throw error;
    }
}

async function updateCommentResponse(connection, commentId, respondFlag) {
    const [results] = await connection.execute(
        `UPDATE comments SET respond = ? WHERE id = ?`,
        [respondFlag, commentId]
    );
    console.log('Updated comment response:', results);
}

module.exports = { createConnection, readComments, insertComments, updateCommentResponse };
