const express = require("express");

const Store = require("./routes/store");
const Invoice = require("./routes/invoice");
const Item = require("./routes/item");

const db = require("./db");

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MYSQL connected");
    }
});

const app = express();
app.use(express.json({ extended: false }));

// Creating DB
app.get("/createdb", (req, res) => {
    let sql = "CREATE DATABASE invoicedb";
    db.query(sql, (err, result) => {
        if (!err) return res.send({ success: true, msg: "DB CERATED..." });
        else return res.send({ success: false, msg: "cannot create db" });
    });
});

// Routes
app.use("/store", Store);
app.use("/invoice", Invoice);
app.use("/item", Item);

app.listen(5000, () => {
    console.log("Server runing on port 5000");
});
