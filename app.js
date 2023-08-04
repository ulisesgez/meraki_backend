require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const dbRoute = require('./routes/dbRoute');
const apiRoutes = require('./routes/apiRoutes');
const dbRoutes = require('./routes/dbRoutes');

app.use('/', dbRoute)
app.use('/api', apiRoutes);
app.use('/db', dbRoutes);

app.listen(port, () => {
  console.log(`Server up and running at http://localhost:${port}`);
});