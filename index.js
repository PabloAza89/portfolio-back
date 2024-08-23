const server = require('./src/app.js');
const port = process.env.PORT || 3000

// process.env.PORT || 3000; FOR GLITCH
// process.env.PORT || 3001; FOR LOCALHOST

server.listen(port, () => console.log(`OK! LISTENING AT PORT ${port} :)`)) // eslint-disable-line no-console