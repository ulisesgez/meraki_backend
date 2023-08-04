const pool = require('../db');

async function insertMerakiOrganizations(req, res) {
  try {
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;
  
    const apiKey = process.env.MERAKI_API_KEY;
    const apiUrl = 'https://api.meraki.com/api/v1/organizations';
  
    const headers = {
      'X-Cisco-Meraki-API-Key': apiKey
    };
    const response = await fetch(apiUrl, { headers });
    if (!response.ok) {
      throw new Error('Error to get data from the API.');
    }
  
    const organizations = await response.json();
  
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      await client.query('DELETE FROM organizations');
  
      const insertQuery = 'INSERT INTO organizations (id, name, url) VALUES ($1, $2, $3)';
      for (const organization of organizations) {
        await client.query(insertQuery, [organization.id, organization.name, organization.url]);
      }
  
      await client.query('COMMIT');
      res.json({ message: 'Data correctly inserted into the database.' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('General Error:', error.message);
    res.status(500).json({ error: 'An error occurred while inserting the data.' });
  }
}

async function insertMerakiNetworks(req, res) {
  try {
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;
  
    const apiKey = process.env.MERAKI_API_KEY;
    const apiUrl = 'https://dashboard.meraki.com/api/v1/organizations/1002375/networks?perPage=2000';
  
    const headers = {
      'X-Cisco-Meraki-API-Key': apiKey
    };
    const response = await fetch(apiUrl, { headers });
    if (!response.ok) {
      throw new Error('Error to get data from the API.');
    }
  
    const networks = await response.json();
  
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      await client.query('DELETE FROM networks');
  
      const insertQuery = 'INSERT INTO networks (id, "organizationId", name, "productTypes", "timeZone", tags, "enrollmentString", url, notes, "isBoundToConfigTemplate") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
      for (const network of networks) {
        await client.query(insertQuery, [network.id, network.organizationId, network.name, network.productTypes, network.timeZone, network.tags, network.enrollmentString, network.url, network.notes, network.isBoundToConfigTemplate]);
      }
  
      await client.query('COMMIT');
      res.json({ message: 'Data correctly inserted into the database.' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('General Error:', error.message);
    res.status(500).json({ error: 'An error occurred while inserting the data.' });
  }
}

async function insertMerakiDevices(req, res) {
  async function getDevicesFromApi(startingAfter = null) {
    const apiKey = process.env.MERAKI_API_KEY;
    const perPage = 1000;
  
    let apiUrl = `https://dashboard.meraki.com/api/v1/organizations/1002375/devices?perPage=${perPage}`;
    if (startingAfter) {
      apiUrl += `&startingAfter=${startingAfter}`;
    }
  
    const headers = {
      'X-Cisco-Meraki-API-Key': apiKey
    };
  
    const response = await fetch(apiUrl, { headers });
    if (!response.ok) {
      throw new Error('Error to get data from the API.');
    }
  
    return await response.json();
  }

  try {

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query('DELETE FROM devices');

      let startingAfter = null;
      let totalDevices = 0;

      do {
        const devicesPage = await getDevicesFromApi(startingAfter);
        const numDevices = devicesPage.length;
        totalDevices += numDevices;

        const insertQuery = 'INSERT INTO devices (serial, name, mac, "networkId", "productType", model, address, lat, lng, notes, tags, "lanIp", "configurationUpdatedAt", firmware, url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
        for (const device of devicesPage) {
          await client.query(insertQuery, [device.serial, device.name, device.mac, device.networkId, device.productType, device.model, device.address, device.lat, device.lng, device.notes, device.tags, device.lanIp, device.configurationUpdatedAt, device.firmware, device.url]);
        }

        // Actualizar el token "startingAfter" para la siguiente página
        if (numDevices === 1000) {
          startingAfter = devicesPage[numDevices - 1].serial;
        } else {
          startingAfter = null;
        }
      } while (startingAfter);

      await client.query('COMMIT');
      res.json({ message: `Data correctly inserted into the database. Total devices: ${totalDevices}` });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('General Error:', error.message);
    res.status(500).json({ error: 'An error occurred while inserting the data.' });
  }
}

module.exports = {
  insertMerakiOrganizations,
  insertMerakiNetworks,
  insertMerakiDevices
};