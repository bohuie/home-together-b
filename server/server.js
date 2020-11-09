import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
// This is required to read from the .env.local file
import localenv from 'localenv';

var con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// Asynchronous helper function for MySQL queries
function query(sql, params) {
  return new Promise((resolve, reject) => {
    con.execute(sql, params, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Expects url like: server-url/get-members-by-name?firstName=John
app.get('/get-members-by-name', (req, res) => {
  getMembersByName(req.query.firstName).then((members) => {
    res.send(members);
  });
});

// Expects url like: server-url/get-members?genderID=2&minAge=21&... etc
app.get('/get-members', (req, res) => {
  getMembers(
    req.query.genderID,
    req.query.minAge,
    req.query.maxAge,
    req.query.familyStatusID,
    req.query.maxMonthlyBudget
  ).then((members) => {
    res.send(members);
  });
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});

function getMembers(genderID, minAge, maxAge, familyStatusID, maxMonthlyBudget) {
  var sql =
    'SELECT * \
    FROM SearchableInfo s \
    JOIN Member m ON m.id = s.memberID \
    WHERE genderID = ? AND birthYear >= ? AND birthYear <= ? AND familyStatusID = ? AND maxMonthlyBudget = ?';
  return query(sql, [genderID, minAge, maxAge, familyStatusID, maxMonthlyBudget]);
}

function getMembersByName(firstName) {
  var sql = 'SELECT * \
  FROM Member m \
  WHERE firstName = ?';
  return query(sql, [firstName]);
}
