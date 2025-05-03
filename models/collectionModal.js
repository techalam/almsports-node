
const db = require("../config/db");

exports.findCollectionByName = async (name) => {
  const result = await db.query(`SELECT * FROM collections WHERE name = $1`, [name]);
  return result.rows[0];
};
