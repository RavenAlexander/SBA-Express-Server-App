"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const express = require("express");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json()); //middleware
//DEFINE THE TEMPLATE ENGINE (will come back to this)
app.engine("ejs", () => {
});
//SPECIFY THE VIEWS DIRECTORY
app.set("views", "./views");
//REGISTER THE TEMPLATE ENGINE
app.set("view engine", "ejs");
//sample api
let users = [
    { id: 1,
        name: 'Simon'
    },
    { id: 2,
        name: 'Brett'
    },
    { id: 1,
        name: 'Joe'
    }
];
//ROUTES
app.get("/", (req, res) => {
    res.render("index");
});
//CREATE
app.post('/users', (req, res) => {
    const newUser = {
        name: req.body.name,
        id: Date.now()
    };
    users.push(newUser);
    res.json(newUser);
});
//READ
app.get('/users', (req, res) => {
    res.json(users);
});
//UPDATE 
app.put('/users', (req, res) => {
    const { id, name } = req.body;
    users = users.map((user) => {
        if (user.id === id) {
            user.name = name;
        }
        return user;
    });
    res.json(users);
});
//DELETE
app.delete('/users', (req, res) => {
    const { id } = req.body;
    users = users.filter((user) => user.id !== id);
    res.json(users);
});
//START
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});
//# sourceMappingURL=index.js.map