/**************************************
 * Account Model
 * Unit 4, Process Registration Activity
 * Task 5: Update Functions
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
*  Register new account
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

/* *****************************
* Return account data using account ID
* Task 5 - Model Function 1
* ******************************* */
async function getAccountById(account_id) {
    try {
        const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1"
        const result = await pool.query(sql, [account_id])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching ID found")
    }
}

/* *****************************
* Update account information
* Task 5 - Model Function 2
* ******************************* */
async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
    try {
        const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
        const result = await pool.query(sql, [
            account_firstname,
            account_lastname,
            account_email,
            account_id
        ])
        return result.rowCount
    } catch (error) {
        console.error("model error: " + error)
        return error
    }
}

/* *****************************
* Update account password
* Task 5 - Model Function 3
* ******************************* */
async function updatePassword(account_password, account_id) {
    try {
        const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        const result = await pool.query(sql, [
            account_password, // This should be the HASHED password
            account_id
        ])
        return result.rowCount
    } catch (error) {
        console.error("model error: " + error)
        return error
    }
}


module.exports = {
    registerAccount,
    getAccountByEmail,
    getAccountById, // Added for Task 5
    updateAccount, // Added for Task 5
    updatePassword // Added for Task 5
}