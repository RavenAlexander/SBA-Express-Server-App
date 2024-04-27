const express = require("express");
const app = express();
const port = 3000;

//REQUIRE THE FILE SYSTEM MODULE
const fs = require('fs');

//DEFINE THE TEMPLATE ENGINE
app.engine("ejs", (filePath, options, callback) => {
    fs.readFile(filePath, (err, content) => {
        if (err) return callback(err);

        
    });
});

//SPECIFY THE VIEWS DIRECTORY
app.set("views", "./views");

//REGISTER THE TEMPLATE ENGINE
app.set("view engine", "ejs");

app.get("/", (req, res) => {

    res.render("index");
});




app.listen(port, ()=> {
    console.log(`Server is listening on port: ${port}`);
})