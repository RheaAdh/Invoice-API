const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/createstoretable", (req, res) => {
    let sql =
        "CREATE TABLE stores(storeId int AUTO_INCREMENT,name varchar(50),address varchar(200),contactNumber varchar(12),emailId varchar(50),primary key (storeId))";
    db.query(sql, (err, result) => {
        if (!err)
            return res.send({ success: true, data: "store TABLE CREATED..." });
        else return res.send({ success: false, msg: "could not create table" });
    });
});

router.post("/addstore", (req, res) => {
    let { name, address, contactNumber, emailId } = req.body;
    let store = { name, address, contactNumber, emailId };
    let sql = "INSERT INTO stores SET ?";
    let query = db.query(sql, store, (err, result) => {
        if (!err) return res.send("store added...");
        else return res.send({ success: false, msg: "could not add store" });
    });
});

//GET ALL STORES
router.get("/getstores", (req, res) => {
    let sql = "SELECT * FROM stores";
    db.query(sql, (err, results) => {
        if (!err)
            return res.send({
                success: true,
                msg: "Fetched all stores...",
                data: results,
            });
        else
            return res.send({
                success: false,
                msg: "could not get all stores",
            });
    });
});

//GET STORE BY STOREID
router.get("/getstore/:storeId", (req, res) => {
    let sql = `SELECT * FROM stores WHERE storeId=${req.params.storeId}`;
    db.query(sql, (err, results) => {
        if (!err)
            return res.send({
                success: true,
                msg: "Fetched store...",
                data: results,
            });
        else
            return res.send({
                success: false,
                msg: "could not get store",
                err:err
            });
    });
});

module.exports = router;
