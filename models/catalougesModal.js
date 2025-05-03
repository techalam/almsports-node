
const db = require("../config/db");

exports.findCatalougeByName = async (name) => {
  const result = await db.query(`SELECT * FROM catalouges WHERE name = $1`, [name]);
  return result.rows[0];
};
