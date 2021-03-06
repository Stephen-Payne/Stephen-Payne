// These are our required libraries to make the server work.
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import sqlite3 from 'sqlite3';
import {open} from 'sqlite';

const dbSettings = {
  filename: './tmp/database.db',
  driver: sqlite3.Database,
};

let db;

async function databaseInitialize(dbSettings) {
  try {
    const db = await open(dbSettings);
    await db.exec(`CREATE TABLE IF NOT EXISTS food (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT,
      inspection_date DATE,
      inspection_results TEXT,
      city TEXT,
      state TEXT,
      zip INTEGER,
      owner TEXT,
      type TEXT
    )
    `);

    const data = await foodDataFetcher();
    data.forEach((entry) => {dataInput(entry)});

    const test = await db.get("SELECT * FROM food")
    console.log(test);
  }
  catch(e) {
    console.log("Error")
  }
 
}

async function foodDataFetcher() {
  const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  const json = await data.json();
  return json;
}

async function dataInput(foodData) {
  try {
    const name = foodData.name;
    const category = foodData.category;
    const date = foodData.inspection_date;
    const results = foodData.inspection_results;
    const city = foodData.city;
    const state = foodData.state;
    const zip = foodData.zip;
    const owner = foodData.owner;
    const type = foodData.type;

    await db.exec(`INSERT INTO food (
      name, category, inspection_date, inspection_results, city, state, zip, owner, type)
      VALUES
      ("${name}", "${category}", "${date}", "${results}", "${city}", "${state}", "${zip}", "${owner}", "${type}")
    `)
  }
  catch(e) {
    console.log('Insert Error');
    console.log(e);
  }
}

async function databaseRetriever(db) {
  const result = await db.all(`SELECT category, COUNT(name) FROM food GROUP BY category`);
  return result;
}

await databaseInitialize(dbSettings);

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

app.route('/sql')
  .get((req, res) => {
    console.log('GET request detected');
  })
  .post(async (req, res) => {
    console.log('POST request detected');
    console.log('Form data in res.body', req.body);

    const db = await open(dbSettings);
    const out = await databaseRetriever(db);
    
    console.log('data from fetch', json);
    res.json(out);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

