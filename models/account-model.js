/**************************************
 *  Account Model
 *  Unit 4, Process Registration Activity
 **************************************/

const pool = require("../database/")

/**
 * Register new account in the database
 * @param {string} account_firstname
 * @param {string} account_lastname
 * @param {string} account_email
 * @param {string} account_password
 * @returns {Promise(Object|String)} Registration result or error message
 */
/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   Get account by email
* *************************** */
async function getAccountByEmail(account_email) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const result = await pool.query(sql, [account_email])
        return result.rows[0]
    } catch (error) {
        console.error("getAccountByEmail error:", error)
        throw error
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

module.exports = { registerAccount, getAccountByEmail }