const app = require('../server/server.js');
const connectDB = require('../server/config/db.js');

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
