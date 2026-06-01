const db = require('../db');

/**
 * Creates standard CRUD routes for a given table.
 * @param {import('express').Router} router
 * @param {string} path - URL path prefix
 * @param {string} table - SQLite table name
 */
function createCrudRoutes(router, urlPath, table) {
  // GET all
  router.get(urlPath, (req, res) => {
    try {
      const rows = db.prepare(`SELECT * FROM ${table} ORDER BY id DESC`).all();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET one
  router.get(`${urlPath}/:id`, (req, res) => {
    try {
      const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id);
      if (!row) return res.status(404).json({ error: 'Not found' });
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST create
  router.post(urlPath, (req, res) => {
    try {
      const keys = Object.keys(req.body);
      const values = Object.values(req.body);
      if (keys.length === 0) return res.status(400).json({ error: 'No data provided' });
      const placeholders = keys.map(() => '?').join(', ');
      const stmt = db.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`);
      const result = stmt.run(...values);
      const created = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(result.lastInsertRowid);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT update
  router.put(`${urlPath}/:id`, (req, res) => {
    try {
      const keys = Object.keys(req.body);
      const values = Object.values(req.body);
      if (keys.length === 0) return res.status(400).json({ error: 'No data provided' });
      const setClause = keys.map(k => `${k} = ?`).join(', ');
      db.prepare(`UPDATE ${table} SET ${setClause} WHERE id = ?`).run(...values, req.params.id);
      const updated = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.params.id);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE
  router.delete(`${urlPath}/:id`, (req, res) => {
    try {
      const result = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(req.params.id);
      if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}

module.exports = { createCrudRoutes };
