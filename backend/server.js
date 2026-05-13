const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());

app.get("/api/dsa", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "..",
            "data",
            "dsa_nodes.json"
        )
    );
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});