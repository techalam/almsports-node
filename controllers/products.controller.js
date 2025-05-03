const db = require("../config/db");

const getAllCategories = async (req, res) => {
  try {
    const categories = await db.query("SELECT * FROM collections");
    res.status(200).json(categories.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getAllProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const { name = '', category } = req.query;

    const values = [`%${name}%`];
    let whereClause = `WHERE name ILIKE $1`;

    if (category) {
      values.push(category);
      whereClause += ` AND category = $${values.length}`;
    }

    // Total count query
    const countQuery = `SELECT COUNT(*) FROM products ${whereClause}`;
    const countResult = await db.query(countQuery, values);
    const totalProducts = countResult.rows[0].count;

    // Paginated products query
    values.push(limit, offset);
    const query = `SELECT * FROM products ${whereClause} ORDER BY id DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;
    const products = await db.query(query, values);

    res.setHeader('x-total-count', totalProducts);
    res.status(200).json(products.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const getProductById = async (req, res) => {
  const id = req.query.id;
  try {
    const product = await db.query("SELECT * FROM products WHERE id = $1", [id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const createProduct = async (req, res) => {
  const { name, price, description, category, images } = req.body;
  try {
    const newProduct = await db.query(
      "INSERT INTO products (name, price, description, category, images) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, price, description, category, images]
    );
    res.status(200).json(newProduct.rows[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const updateProduct = async (req, res) => {
  const { name, price, description, imageUrl, id } = req.body;
  try {
    const updatedProduct = await db.query(
      "UPDATE products SET name = $1, price = $2, description = $3, image_url = $4 WHERE id = $5 RETURNING *",
      [name, price, description, imageUrl, id]
    );
    if (updatedProduct.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(updatedProduct.rows[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
const deleteProduct = async (req, res) => {
  const { id } = req.body;
  try {
    const deletedProduct = await db.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    if (deletedProduct.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(deletedProduct.rows[0]);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories
}