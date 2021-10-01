const express = require("express");
const router = express.Router();
const db = require("../db");

//Create invoice table
router.get("/createinvoicetable", (req, res) => {
    let sql =
        "CREATE TABLE invoices(invoiceId int AUTO_INCREMENT,buyerName varchar(50),buyerContactNumber varchar(12),date varchar(120),emailid varchar(50),primary key (invoiceId),storeId int,paid boolean)";
    db.query(sql, (err, result) => {
        if (!err)
            return res.send({ success: true, msg: "invoice TABLE CERATED..." });
        else
            return res.send({
                success: false,
                msg: "could not create table",
                err: err,
            });
    });
});

//ADD INVOICE to a store
router.post("/addinvoice", (req, res) => {
    let { buyerContactNumber, buyerName, emailId, storeId, paid } = req.body;
    let invoice = {
        buyerContactNumber,
        buyerName,
        emailId,
        storeId,
        date: new Date(),
        paid,
    };
    let sql = "INSERT INTO invoices SET ?";
    let query = db.query(sql, invoice, (err, result) => {
        if (!err) return res.send("invoice added...");
        else
            return res.send({
                success: false,
                msg: "could not add invoice",
                err: err,
            });
    });
});

//GET ALL invoices of the store
router.get("/getinvoices/:storeId", (req, res) => {
    let sql = `SELECT * FROM invoices WHERE storeId=${req.params.storeId}`;
    db.query(sql, (err, results) => {
        if (!err)
            return res.send({
                success: true,
                msg: "Fetched all invoices of store...",
                data: results,
            });
        else
            return res.send({
                success: false,
                msg: "could not get all stores",
            });
    });
});

//GET Invoice and total amount
router.post("/getinvoice/:invoiceId", (req, res) => {
    let sql = `SELECT * FROM invoices WHERE (storeId=${req.body.storeId} AND invoiceId=${req.params.invoiceId})`;
    db.query(sql, (err, results) => {
        if (!err) {
            let bill = 0;
            let sql2 = `SELECT SUM(totalAmt) AS "Total Bill" FROM items WHERE (invoiceId=${req.params.invoiceId} AND storeId=${req.body.storeId})`;
            db.query(sql2, (err, total_bill) => {
                if (!err)
                    return res.send({
                        success: true,
                        msg: "Fetched invoice of store...",
                        bill: total_bill,
                        data: results[0], //Mentioned if paid or not in this object
                    });
                else
                    return res.send({
                        success: false,
                        msg: "could not get invoice",
                    });
            });
        } else
            return res.send({
                success: false,
                msg: "could not get invoice",
            });
    });
});

//Shop Keeper can set invoice as paid=true
router.post("/updatepaymentstatus/:invoiceId", (req, res) => {
    let sql = `UPDATE invoices SET paid=${true} WHERE (invoiceId=${
        req.params.invoiceId
    } AND storeId=${req.body.storeId})`;
    db.query(sql, (err, results) => {
        if (!err)
            return res.send({
                success: true,
                msg: "Updated payment status...",
            });
        else
            return res.send({
                success: false,
                msg: "could not update payment status",
            });
    });
});

module.exports = router;
