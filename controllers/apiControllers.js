async function fetchMerakiData(apiUrl) {
  const fetch = await import('node-fetch');
  const apiKey = process.env.MERAKI_API_KEY;

  const headers = {
    'X-Cisco-Meraki-API-Key': apiKey
  };

  const response = await fetch.default(apiUrl, { headers });
  if (!response.ok) {
    throw new Error('La solicitud no fue exitosa.');
  }

  return response.json();
}

module.exports = {
  async getOrganizations(req, res) {
    try {
      const apiUrl = 'https://api.meraki.com/api/v1/organizations';
      const data = await fetchMerakiData(apiUrl);
      res.json(data);
    } catch (error) {
      console.error('Error al obtener las organizaciones:', error.message);
      res.status(500).json({ error: 'Error al obtener las organizaciones' });
    }
  },

  async getOrganizationNetworks(req, res) {
    try {
      const fetch = await import('node-fetch');
      const apiKey = process.env.MERAKI_API_KEY;
      const orgId = req.params.orgId;
      const apiUrl = `https://dashboard.meraki.com/api/v1/organizations/${orgId}/networks?perPage=2000`;

      const headers = {
        'X-Cisco-Meraki-API-Key': apiKey
      };

      const response = await fetch.default(apiUrl, { headers });
      if (!response.ok) {
        throw new Error('La solicitud no fue exitosa.');
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error al obtener las redes:', error.message);
      res.status(500).json({ error: 'Error al obtener las redes' });
    }
  },

  async getOrganizationAllDevices(req, res) {
    try {
      const fetch = await import('node-fetch');
      const apiKey = process.env.MERAKI_API_KEY;
      const orgId = req.params.orgId;
      const apiUrl = `https://api.meraki.com/api/v1/organizations/${orgId}/devices`;

      const headers = {
        'X-Cisco-Meraki-API-Key': apiKey
      };

      const response = await fetch.default(apiUrl, { headers });
      if (!response.ok) {
        throw new Error('La solicitud no fue exitosa.');
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error al obtener los dispositivos:', error.message);
      res.status(500).json({ error: 'Error al obtener los dispositivos' });
    }
  },

  async getOrganizationDevices(req, res) {
    try {
      const apiKey = process.env.MERAKI_API_KEY;
      const orgId = req.params.orgId;
      const macId = req.query.mac;
      const apiUrl = `https://api.meraki.com/api/v1/organizations/${orgId}/devices?mac=${macId}`;

      const headers = {
        'X-Cisco-Meraki-API-Key': apiKey
      };

      const response = await fetch(apiUrl, { headers });
      if (!response.ok) {
        throw new Error('La solicitud no fue exitosa.');
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error al obtener los dispositivos:', error.message);
      res.status(500).json({ error: 'Error al obtener los dispositivos' });
    }
  },

  async searchClients(req, res) {
    try {
      const apiKey = process.env.MERAKI_API_KEY;
      const orgId = req.params.orgId;
      const macId = req.query.mac;
      const apiUrl = `https://api.meraki.com/api/v1/organizations/${orgId}/clients/search?mac=${macId}&perPage=5&timespan=2678400`;

      const headers = {
        'X-Cisco-Meraki-API-Key': apiKey
      };

      const response = await fetch(apiUrl, { headers });
      if (!response.ok) {
        throw new Error('La solicitud no fue exitosa.');
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error al obtener los dispositivos:', error.message);
      res.status(500).json({ error: 'Error al obtener los dispositivos' });
    }
  }

  /*
  async searchClients(req, res) {
    try {
      const apiKey = process.env.MERAKI_API_KEY;
      const orgId = req.params.orgId;
      const macId = req.query.mac;
      const apiUrl = `https://api.meraki.com/api/v1/organizations/${orgId}/clients/search?mac=${macId}`;
  
      const headers = {
        'X-Cisco-Meraki-API-Key': apiKey
      };
  
      let allClients = []; // Lista para almacenar todos los clientes
      let page = 0; // Número de página inicial
      let totalPages = 1; // Inicializar el número total de páginas en 1
  
      while (page < totalPages) {
        const response = await fetch(`${apiUrl}&perPage=5&page=${page}`, { headers });
        if (!response.ok) {
          throw new Error('La solicitud no fue exitosa.');
        }
  
        const data = await response.json();
        console.log(data); // Agregar esta línea para imprimir la respuesta de la API
  
        if (data.records && Array.isArray(data.records)) {
          allClients.push(...data.records); // Agregar los clientes de la página actual a la lista general
          totalPages = Math.ceil(data.total / 5); // Calcular el número total de páginas
          page++; // Incrementar el número de página para la siguiente iteración
        } else {
          throw new Error('La estructura de la respuesta no es válida.');
        }
      }
  
      res.json(allClients);
      console.log(allClients);
    } catch (error) {
      console.error('Error al obtener los dispositivos:', error.message);
      res.status(500).json({ error: 'Error al obtener los dispositivos' });
    }
  }
  */

  /*
  respaldo:

  async searchClients(req, res) {
  try {
    const apiKey = process.env.MERAKI_API_KEY;
    const orgId = req.params.orgId;
    const macId = req.query.mac;
    const apiUrl = `https://api.meraki.com/api/v1/organizations/${orgId}/clients/search?mac=${macId}`;

    const headers = {
      'X-Cisco-Meraki-API-Key': apiKey
    };

    let allClients = []; // Lista para almacenar todos los clientes
    let page = 0; // Número de página inicial
    let totalPages = 1; // Inicializar el número total de páginas en 1

    while (page < totalPages) {
      const response = await fetch(`${apiUrl}&perPage=5&page=${page}`, { headers });
      if (!response.ok) {
        throw new Error('La solicitud no fue exitosa.');
      }

      const data = await response.json();
      console.log(data); // Agregar esta línea para imprimir la respuesta de la API

      if (data.records && Array.isArray(data.records)) {
        allClients.push(...data.records); // Agregar los clientes de la página actual a la lista general
        totalPages = Math.ceil(data.total / 5); // Calcular el número total de páginas
        page++; // Incrementar el número de página para la siguiente iteración
      } else {
        throw new Error('La estructura de la respuesta no es válida.');
      }
    }

    res.json(allClients);
    console.log(allClients);
  } catch (error) {
    console.error('Error al obtener los dispositivos:', error.message);
    res.status(500).json({ error: 'Error al obtener los dispositivos' });
  }
}

  */
};