const db = require("../config/db");
const { findCatalougeByName } = require("../models/catalougesModal");

const getAllCatalouges = async (req, res) => {
  try {
    const catalouges = await db.query("SELECT * FROM catalouges");
    res.status(200).json(catalouges.rows);
  } catch (error) {
    console.error("Error fetching catalouges:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getCatalougeById = async (req, res) => {
  const id = req.query.id;
  try {
    const catalouge = await db.query("SELECT * FROM catalouges WHERE id = $1", [id]);
    if (catalouge.rows.length === 0) {
      return res.status(404).json({ error: "Catalouge not found" });
    }
    res.status(200).json(catalouge.rows[0]);
  } catch (error) {
    console.error("Error fetching catalouge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const createCatalouge = async (req, res) => {
  const { name } = req.body;
  try {
    const existingCatalouge = await findCatalougeByName(name);
    if (existingCatalouge) {
      return res.status(400).json({ error: "Catalouge already exists" });
    }
    const newCatalouge = await db.query(
      "INSERT INTO catalouges (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(200).json(newCatalouge.rows[0]);
  } catch (error) {
    console.error("Error creating catalouge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const updateCatalouge = async (req, res) => {
  const { name, id } = req.body;
  try {
    const updatedCatalouge = await db.query(
      "UPDATE catalouges SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (updatedCatalouge.rows.length === 0) {
      return res.status(404).json({ error: "Catalouge not found" });
    }
    res.status(200).json(updatedCatalouge.rows[0]);
  } catch (error) {
    console.error("Error updating catalouge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const deleteCatalouge = async (req, res) => {
  const { id } = req.body;
  try {
    const deletedCatalouge = await db.query(
      "DELETE FROM catalouges WHERE id = $1 RETURNING *",
      [id]
    );
    if (deletedCatalouge.rows.length === 0) {
      return res.status(404).json({ error: "Catalouge not found" });
    }
    res.status(200).json(deletedCatalouge.rows[0]);
  } catch (error) {
    console.error("Error deleting catalouge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const addProductsUnderCatalouge = async (req, res) => {
  const { id, productIds } = req.body;
  try {
    const result = await db.query(
      'SELECT products FROM catalouges WHERE id = $1',
      [id]
    );
    const existingIds = result.rows[0].products || [];
    
    // 2. Merge and deduplicate
    const updatedIds = Array.from(new Set([...existingIds, ...productIds]));
    
    // 3. Save back to DB
    const updatedCatalouge = await db.query(
      'UPDATE catalouges SET products = $1 WHERE id = $2 ReTURNING *',
      [updatedIds, id]
    );
    if (updatedCatalouge.rows.length === 0) {
      return res.status(404).json({ error: "Catalouge not found" });
    }
    res.status(200).json(updatedCatalouge.rows[0]);
  } catch (error) {
    console.error("Error adding product to catalouge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getProductsByCatalogueId = async (req, res) => {
  try {
    const { catalogueId, name = '' } = req.query;

    if (!catalogueId) {
      return res.status(400).json({ error: 'catalogueId is required' });
    }

    // Step 1: Get product IDs from the catalogue
    const catalogueResult = await db.query(
      `SELECT products FROM catalouges WHERE id = $1`,
      [catalogueId]
    );

    if (catalogueResult.rows.length === 0) {
      return res.status(404).json({ error: 'Catalogue not found' });
    }

    const productIds = catalogueResult.rows[0].products;

    if (!productIds || productIds.length === 0) {
      return res.status(200).json({}); // No products
    }

    // Step 2: Build query to fetch products by ID and name
    const values = [productIds];
    let whereClause = `WHERE id = ANY($1::int[])`;

    if (name) {
      values.push(`%${name}%`);
      whereClause += ` AND name ILIKE $${values.length}`;
    }

    const productQuery = `
      SELECT * FROM products
      ${whereClause}
      ORDER BY category, id DESC
    `;

    const productsResult = await db.query(productQuery, values);

    // Step 3: Group by category
    const groupedMap = new Map();

productsResult.rows.forEach(product => {
  const category = product.category || 'Uncategorized';
  if (!groupedMap.has(category)) {
    groupedMap.set(category, []);
  }
  groupedMap.get(category).push(product);
});

const groupedArray = Array.from(groupedMap.entries()).map(([name, products]) => ({
  name,
  products
}));

    res.status(200).json(groupedArray);
  } catch (error) {
    console.error("Error fetching products by catalogue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  getAllCatalouges,
  getCatalougeById,
  createCatalouge,
  updateCatalouge,
  deleteCatalouge,
  addProductsUnderCatalouge,
  getProductsByCatalogueId
}