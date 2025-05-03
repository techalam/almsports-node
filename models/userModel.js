
const db = require("../config/db");

exports.findUserByEmail = async (email) => {
  const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0];
};
