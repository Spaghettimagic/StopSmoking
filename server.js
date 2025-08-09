const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

async function readData(){
  try {
    const txt = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(txt);
  } catch (e) {
    return [];
  }
}

async function writeData(data){
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/data', async (req, res) => {
  const data = await readData();
  res.json(data);
});

app.post('/api/data', async (req, res) => {
  const data = Array.isArray(req.body) ? req.body : [];
  await writeData(data);
  res.json({status: 'ok'});
});

app.post('/api/add', async (req, res) => {
  const rec = req.body;
  if(!rec || !rec.timestamp){
    return res.status(400).json({error: 'invalid'});
  }
  const data = await readData();
  data.push(rec);
  await writeData(data);
  res.json({status: 'ok'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
