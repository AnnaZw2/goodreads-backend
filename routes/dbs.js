
const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Shelf = require("../models/shelf");

// Delete one
router.delete("/:id", async (req, res) => {
  try {
    switch (req.params.id) {
      case 'books':
        await Book.collection.drop();
        res.json({ message: "Deleted books collection" });
        break;
      case 'shelves':
        await Shelf.collection.drop();
        res.json({ message: "Deleted shelves collection" });
        break;
      default:
        res.status(404).json({ message: 'collection not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;


// let cmd = `mongodump --forceTableScan --out=${backupDirPath} --uri=${process.env.MONGODB_URI}`;

// const dbAutoBackUp = () => {
//   let filePath = backupDirPath + `/db-back-up-schedule/companies.bson`;
//   exec(cmd, (error, stdout, stderr) => {
//     console.log([cmd, error, backupDirPath]);
//     storeFileOnAzure(filePath);
//   });
// };

// https://stackoverflow.com/questions/42218214/how-to-backup-a-mongodb-collection-using-express-js-and-node-js
