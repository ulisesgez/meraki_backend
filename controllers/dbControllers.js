const db = require('../db');

const getOrganizations = async (req, res) => {
  try {
    const client = await db.pool.connect();
    const result = await client.query('SELECT * FROM organizations');
    const organizations = result.rows;
    client.release();

    res.json(organizations);
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
};

module.exports = {
  getOrganizations,
};