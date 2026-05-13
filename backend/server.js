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

const { execFile } = require("child_process");

app.get("/api/search", (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: "No search query provided" });
    }

    execFile(
        path.join(__dirname, "search_program.exe"),
        [query],
        { cwd: __dirname },
        (error, stdout, stderr) => {
            if (error) {
                console.error("C++ ERROR:", error);
                console.error("STDOUT:", stdout);
                console.error("STDERR:", stderr);

                return res.status(500).json({
                    error: "C++ search failed",
                    details: stdout || stderr || error.message
                });
            }

            res.json({ answer: stdout });
        }
    );
});