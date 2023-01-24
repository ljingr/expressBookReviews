const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username&&password) {
        if (!doesExist(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registered."});
        } else {
            return res.status(404).json({message:"User already existed!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
        const book = await JSON.stringify(books,null,4);
        res.send(book);
        console.log(res);
        return res.status(300).json({message: "The books available in the shop:"});
    } catch (error) {
        console.error(error);
    } 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const book = await books[req.params.isbn];
        res.send(book);
        console.log(res);
        return res.status(300).json({message: "The book detail is:"});

    } catch (error) {
        console.error(error);
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    let author = req.params.author
    let keylist = [] 
    for (let key in books) {
        if (books[key]["author"] === author) {
            keylist.push(key)
        }
    }
    if (keylist) {
        res.send(books[keylist[0]])
    } else {
        res.send("No such book.")
    }
      
    return res.status(300).json({message: "The book detail is:"});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    let title = req.params.title
    
    for (let key in books) {
        if (books[key]["title"] === title) {
            res.send(books[key])
        }
    }
    res.send("No such book.")
    return res.status(300).json({message: "The book detail is:"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    res.send(books[req.params.isbn]["reviews"])
    return res.status(300).json({message: "The book review is:"});
});

module.exports.general = public_users;
