const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    const data = await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
    return data.rows
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getInventoryByClassificationId error " + error)
        throw error
    }
}

/* ***************************
 *  Get inventory item by ID
 * ************************** */
async function getInventoryById(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.inv_id = $1`,
            [inv_id]
        )
        return data.rows[0]
    } catch (error) {
        console.error("getInventoryById error " + error)
        throw error
    }
}

/* ***************************
 *  Add a new inventory item
 * ************************** */
async function addInventory({ inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id }) {
    try {
        const sql = `INSERT INTO public.inventory (
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
        const data = await pool.query(sql, [
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        ]);
        return data.rows[0]
    } catch (error) {
        console.error("addInventory error " + error)
        throw error
    }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
        const data = await pool.query(sql, [classification_name])
        return data.rows[0]
    } catch (error) {
        console.error("addClassification error " + error)
        throw error
    }
}

/* ***************************
 * Delete Inventory Item (simple version)
 * ************************** */
async function deleteInventory(inv_id) {
    try {
        const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
        await pool.query(sql, [inv_id])
        return true
    } catch (error) {
        console.error("deleteInventory error ", error)
        throw error
    }
}

/* ***************************
 * Delete Inventory Item (with return data)
 * Unit 5, Delete Activity
 * ************************** */
async function deleteInventoryItem(inv_id) {
    try {
        const sql = "DELETE FROM inventory WHERE inv_id = $1"
        const data = await pool.query(sql, [inv_id])
        return data
    } catch (error) {
        console.error("Delete Inventory Error: " + error)
        throw new Error("Delete Inventory Error")
    }
}

/* ***************************
 *  Update Inventory Data
 *  Unit 5, Update Activity
 * ************************** */
async function updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
) {
    try {
        const sql = `UPDATE public.inventory 
            SET inv_make = $2, 
                inv_model = $3, 
                inv_description = $4, 
                inv_image = $5, 
                inv_thumbnail = $6, 
                inv_price = $7, 
                inv_year = $8, 
                inv_miles = $9, 
                inv_color = $10, 
                classification_id = $11 
            WHERE inv_id = $1 
            RETURNING *`
        
        const data = await pool.query(sql, [
            inv_id,           // $1
            inv_make,         // $2
            inv_model,        // $3
            inv_description,  // $4
            inv_image,        // $5
            inv_thumbnail,    // $6
            inv_price,        // $7
            inv_year,         // $8
            inv_miles,        // $9
            inv_color,        // $10
            classification_id // $11
        ])
        return data.rows[0]
    } catch (error) {
        console.error("updateInventory model error: " + error)
        throw error
    }
}


module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getInventoryById,
    addInventory,
    addClassification,
    updateInventory,
    deleteInventory,
    deleteInventoryItem
}