/**************************************
 *  Account Model
 *  Unit 4, Process Registration Activity
 **************************************/

const pool = require("../database/")
const bcrypt = require("bcryptjs")

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
        
        const hashedPassword = await bcrypt.hash(account_password, 10)
        
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword])
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Return account data using email address
* ******************************* */
async function getAccountByEmail(account_email) {
    try {
        const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1"
        const result = await pool.query(sql, [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

module.exports = { registerAccount, getAccountByEmail }