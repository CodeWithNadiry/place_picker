import fs from 'node:fs/promises';
import express from 'express';

const app = express();

/* ===================== MIDDLEWARE ===================== */

// serve images folder
app.use(express.static('images'));

// parse JSON body
app.use(express.json());

// CORS (must be BEFORE routes)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

/* ===================== ROUTES ===================== */

app.get('/places', async (req, res) => {
  try {
    const fileContent = await fs.readFile('./data/places.json', 'utf-8');
    const places = JSON.parse(fileContent);

    res.status(200).json({ places });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load places' });
  }
});

app.get('/user-places', async (req, res) => {
  try {
    const fileContent = await fs.readFile('./data/user-places.json', 'utf-8');
    const places = JSON.parse(fileContent);

    res.status(200).json({ places });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load user places' });
  }
});

app.put('/user-places', async (req, res) => {
  try {
    const { places } = req.body;

    if (!places) {
      return res.status(400).json({ message: 'Places data missing' });
    }

    await fs.writeFile(
      './data/user-places.json',
      JSON.stringify(places, null, 2)
    );

    res.status(200).json({ message: 'User places updated!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user places' });
  }
});

/* ===================== 404 HANDLER ===================== */

app.use((req, res) => {
  res.status(404).json({ message: '404 - Not Found' });
});

/* ===================== SERVER ===================== */

app.listen(1050, () => {
  console.log('✅ Server running on http://localhost:1050');
});
