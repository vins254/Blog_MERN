/**
 * MERN Blog API - Server Entry Point
 * Imports the configured Express app and starts the HTTP listener.
 */
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
