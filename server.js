// These are our required libraries to make the server work.
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import sqlite3 from 'sqlite3';
import {open} from 'sqlite';
//const sqlite3 = require('sqlite3').verbose();

const dbSettings = {
  filename: './tmp/database.db',
  driver: sqlite3.Database,
};

let db;

async function databaseInitialize(dbSettings) {
  try {
    const db = await open(dbSettings);
    await db.exec(`CREATE TABLE IF NOT EXISTS food (

    )
    `)
    console.log('Connected to ' + db);
  }
  catch(e) {
    console.log("Error")
  }

  
}


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.route('/api')
  .get((req, res) => {
    console.log('GET request detected');
    res.send(`Lab 5 for ${process.env.NAME}`);
  })
  .post(async (req, res) => {
    console.log('POST request detected');
    console.log('Form data in res.body', req.body);

    const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    const json = await data.json();
    console.log('data from fetch', json);
    res.json(json);
  });

await databaseInitialize(dbSettings);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

