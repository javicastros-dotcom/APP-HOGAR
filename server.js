const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Base de datos SQLite (archivo real en disco) ----------
// En Render, DB_PATH debe apuntar dentro del disco persistente (ej: /var/data/database.sqlite)
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    checked INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    assignee TEXT NOT NULL,
    priority INTEGER NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ================= LISTA DE LA COMPRA =================

app.get('/api/items', (req, res) => {
  const items = db.prepare('SELECT * FROM items ORDER BY created_at ASC').all();
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ error: 'Texto requerido' });

  const info = db.prepare(
    'INSERT INTO items (text, checked, created_at) VALUES (?, 0, ?)'
  ).run(text, Date.now());

  res.json({ id: info.lastInsertRowid });
});

app.patch('/api/items/:id', (req, res) => {
  db.prepare('UPDATE items SET checked = ? WHERE id = ?')
    .run(req.body.checked ? 1 : 0, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/items/:id', (req, res) => {
  db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.post('/api/items/clear-checked', (req, res) => {
  db.prepare('DELETE FROM items WHERE checked = 1').run();
  res.json({ ok: true });
});

// ================= TAREAS =================

app.get('/api/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const text = (req.body.text || '').trim();
  const { assignee, priority } = req.body;
  if (!text) return res.status(400).json({ error: 'Texto requerido' });

  const info = db.prepare(
    'INSERT INTO tasks (text, assignee, priority, completed, created_at) VALUES (?, ?, ?, 0, ?)'
  ).run(text, assignee, priority, Date.now());

  res.json({ id: info.lastInsertRowid });
});

app.patch('/api/tasks/:id', (req, res) => {
  db.prepare('UPDATE tasks SET completed = ? WHERE id = ?')
    .run(req.body.completed ? 1 : 0, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/tasks/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`Base de datos en: ${DB_PATH}`);
});
