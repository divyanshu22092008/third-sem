//Perform CRUD operations on files using fs module 
const fs = require('fs');

// Create a new file
fs.writeFile('example.txt', 'Hello, World!', (err) => {
    if (err) throw err;
    console.log('File created');
});
