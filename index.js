const express = require('express');
const mysql = require('mysql');
const fake = require('./fake-registers');

const app = express();
const port = 3000;

const conn = mysql.createConnection({
    host: 'full-cycle-mysql',
    user: 'root',
    password: 'root',
    database: 'nodedb'
});

const createTable = 'create table if not exists people (id int not null auto_increment, name varchar(255) not null, primary key (id))';
conn.query(createTable);

app.get('/', (req,res) => {

    let userName = fake.Name.findName(),
        userList;

    conn.query('insert into people(name) values (?)', [userName], (err, row) => {
        if (err) return err;

        console.log('New registry:', userName);
    });

    userList = '<ul>';

    conn.query('select id, name from people', (err, rows) => {
        if (err) throw err;

        rows.forEach((row) => {
            userList = userList + `<li>${row.name}</li>`;
        });

        userList = userList + '</ul>';

        res.send('<h1>Full Cycle Rocks!</h1>' + userList);
    });
});

app.listen(port, () => {
    console.log('Running in: ' + port);
});