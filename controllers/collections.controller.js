const db = require("../config/db");
const { findCollectionByName } = require("../models/collectionModal");

const getAllCollections = async (req, res) => {
  try {
    const collections = await db.query("SELECT * FROM collections");
    res.status(200).json(collections.rows);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getCollectionById = async (req, res) => {
  const id = req.query.id;
  try {
    const collection = await db.query("SELECT * FROM collections WHERE id = $1", [id]);
    if (collection.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }
    res.status(200).json(collection.rows[0]);
  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const createCollection = async (req, res) => {
  const { name } = req.body;
  try {
    const existingCollection = await findCollectionByName(name);
    if (existingCollection) {
      return res.status(400).json({ error: "Collection already exists" });
    }
    const newCollection = await db.query(
      "INSERT INTO collections (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(200).json(newCollection.rows[0]);
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const updateCollection = async (req, res) => {
  const { name, id } = req.body;
  try {
    const updatedCollection = await db.query(
      "UPDATE collections SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (updatedCollection.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }
    res.status(200).json(updatedCollection.rows[0]);
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
const deleteCollection = async (req, res) => {
  const { id } = req.body;
  try {
    const deletedCollection = await db.query(
      "DELETE FROM collections WHERE id = $1 RETURNING *",
      [id]
    );
    if (deletedCollection.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found" });
    }
    res.status(204).send("deleted successfully");
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
}