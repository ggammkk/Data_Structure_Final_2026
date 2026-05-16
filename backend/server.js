const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
//line below rachel experiment 
const { execFile, exec } = require("child_process");
app.use(express.json())

//back to main code
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

app.get("/api/practice/:topic", (req, res) => {

    const topic = req.params.topic;

    execFile(
        path.join(__dirname, "practice", "practice_program.exe"),
        [topic],
        { cwd: path.join(__dirname, "practice") },

        (error, stdout, stderr) => {

            if (error) {

                return res.status(500).json({
                    error: "C++ practice failed",
                    details: stdout || stderr || error.message
                });
            }

            res.json(JSON.parse(stdout));
        }
    );
});

app.get("/api/practice-topics", (req, res) => {

    const practicePath =
        path.join(__dirname, "..", "data", "practice.json");

    fs.readFile(practicePath, "utf8", (err, data) => {

        if (err) {

            return res.status(500).json({
                error: "Could not read practice.json"
            });
        }

        const practiceData = JSON.parse(data);

        res.json(Object.keys(practiceData));
    });
});

//below rachel experiment 
const os = require('os');

app.post('/api/run', (req, res) => {
    const { code } = req.body;

    const tmpDir  = os.tmpdir();
    const srcFile = path.join(tmpDir, 'practice_code.cpp');
    const outFile = path.join(tmpDir, 'practice_code.out');

    fs.writeFileSync(srcFile, code);

    // Step 1: compile
    exec(`g++ -o "${outFile}" "${srcFile}"`, (compileErr, _, compileStderr) => {
        if (compileErr) {
            return res.json({ error: compileStderr || compileErr.message });
        }

        // Step 2: run
        exec(`"${outFile}"`, { timeout: 5000 }, (runErr, stdout, runStderr) => {
            if (runErr) {
                return res.json({ error: runStderr || runErr.message });
            }
            res.json({ output: stdout || '(no output)' });

            // cleanup
            fs.unlink(srcFile, () => {});
            fs.unlink(outFile, () => {});
        });
    });
});


//back to main code
app.listen(3000, () => {
    console.log("Server running on port 3000");
});