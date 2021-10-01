const express = require("express");
const router = express.Router();
const db = require("../db");

//Create items table
router.get("/createitemstable", (req, res) => {
    let sql =
        "CREATE TABLE items(itemId int AUTO_INCREMENT,itemName varchar(10),quantity int,pricePerQty int,discount int,gst int,totalAmt int,PRIMARY KEY (itemId),invoiceId int,storeId int)";
    db.query(sql, (err, result) => {
        if (!err)
            return res.send({ success: true, msg: "items TABLE CERATED..." });
        else
            return res.send({
                success: false,
                msg: "could not create table",
                err: err,
            });
    });
});

router.post("/additem", (req, res) => {
    let { quantity, invoiceId, itemName, pricePerQty, discount, gst, storeId } =
        req.body;
    //assuming in percentage -> gst and discount
    let discount_item = pricePerQty - (discount / 100) * pricePerQty;
    let Amt = discount_item * quantity;
    let gst_amount = (gst / 100) * Amt;
    let totalAmt = Amt + gst_amount;
    let item = {
        quantity,
        invoiceId,
        pricePerQty,
        discount,
        gst,
        itemName,
        totalAmt,
        storeId,
    };
    let sql = "INSERT INTO items SET ?";
    let query = db.query(sql, item, (err, result) => {
        if (!err) return res.send("item added...");
        else
            return res.send({
                success: false,
                msg: "could not add item",
                err: err,
            });
    });
});

//GET item BY itemID
router.post("/getitem/:itemId", (req, res) => {
    let sql = `SELECT * FROM items WHERE (itemId=${req.params.itemId} AND storeId=${req.body.storeId} AND invoiceId=${req.body.invoiceId})`;

    db.query(sql, (err, results) => {
        if (!err)
            return res.send({
                success: true,
                msg: "got item...",
                data: results,
            });
        else
            return res.send({
                success: false,
                msg: "could not get item",
                err: err,
            });
    });
});

module.exports = router;
