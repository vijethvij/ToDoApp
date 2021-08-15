const express = require("express");

const app = express();
app.use(express.json());
const path = require("path");
const db = require("./db");
const collection = "todolist";



app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./index.html"));
});

app.get("/logic.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./logic.js"));
});

app.get("/getTodos", (req, res) => {
    db.getDB()
        .collection(collection)
        .find({})
        .toArray((err, documents) => {
            if (err) {
                console.log(err);
            } else {
                res.json(documents);
            }
        });
});

app.put("/:id", (req, res) => {
    const todoID = req.params.id;
    console.log(req.body);
    const userInput = req.body;
    db.getDB()
        .collection(collection)
        .findOneAndUpdate(
            { _id: db.getPrimaryKey(todoID) },
            { $set: { todo: userInput.todo } },
            { returnOriginal: false },
            (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json(results);
                }
            }
        );
});

app.post("/add", (req, res) => {
    const todoThing = req.body;
    db.getDB()
        .collection(collection)
        .insertOne(todoThing, (err, results) => {
            if (err) {
                console.log(err);
                const error = new Error("Failer to insert data");
                error.status = 400;
                next(error);
            } else {
                res.json({ result: results, document: results.ops[0], msg: "Successfully inserted todo", error : null});
            }
        });
});

app.delete("/del", (req, res) => {
    const todoID = req.body.id;
    console.log(req.body);
    db.getDB()
        .collection(collection)
        .findOneAndDelete({ _id: db.getPrimaryKey(todoID) }, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                res.json(results);
            }
        });
});

db.connect((err) => {
    if (err) {
        console.log("Unable to connect db");
    } 
    else {
        app.listen(3000, () => {
            console.log("DB Connected! Listening at port 3000");
        });
    }
});
