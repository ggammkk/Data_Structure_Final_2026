const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");


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

app.get("/api/quiz/:topic", (req, res) => {
    const topic = req.params.topic;

    execFile(
        path.join(__dirname, "quiz", "quiz_program.exe"),
        [topic],
        { cwd: path.join(__dirname, "quiz") },
        (error, stdout, stderr) => {
            if (error) {
                return res.status(500).json({
                    error: "C++ quiz failed",
                    details: stdout || stderr || error.message
                });
            }

            res.json(JSON.parse(stdout));
        }
    );
});

app.get("/api/quiz-topics", (req, res) => {
    const quizPath = path.join(__dirname, "..", "data", "quiz.json");

    fs.readFile(quizPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                error: "Could not read quiz.json",
                details: err.message
            });
        }

        const quizData = JSON.parse(data);
        res.json(Object.keys(quizData));
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});