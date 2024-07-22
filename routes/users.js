var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*
* GET contactList.
*/
router.get('/contactList', function(req, res) {
	//console.log('Request received for /contactList');
	var db = req.db;
	if (!db) {
	  console.error('Database connection is not available.');
	  res.status(500).send({ msg: 'Database connection is not available.' });
	  return;
	}
  
	var collection = db.collection('contactList');
	collection.find({}).toArray(function(err, docs) {
	  if (err) {
		console.error('Error occurred while fetching documents:', err);
		res.status(500).send({ msg: err });
	  } else {
		res.json(docs);
	  }
	});
});

/*
 * POST to addContact.
 */
router.post('/addContact', function(req, res) {
    console.log('Received POST request to /addContact');
    var db = req.db;
    var collection = db.collection('contactList');
    console.log('Inserting contact:', req.body);
    collection.insertOne(req.body, function(err, result) {
        if (err) {
            console.error('Error occurred:', err);
            res.status(500).send({ msg: 'Internal server error.' });
        } else {
            console.log('Contact inserted successfully');
            res.send({ msg: '' });
        }
    });
});

/*
* PUT to updateContact 
*/
const { ObjectId } = require('mongodb'); // 确保引入了 ObjectId

router.put('/updateContact/:id', function (req, res) {
	//console.log("updateContact function is invoked!")
	var db = req.db;
	var collection = db.collection('contactList');
	var contactToUpdate = req.params.id;

    // Convert the contactToUpdate to an ObjectId
    var id;
    try {
        id = ObjectId(contactToUpdate);
    } catch (e) {
        console.error('Invalid ObjectId format:', contactToUpdate);
        res.status(400).send({ msg: 'Invalid ObjectId format.' });
        return;
    }

    // Remove _id from the update object if present
    var updateData = { ...req.body };
    delete updateData._id;
	
	// Log the data being updated
	console.log('Updating contact with id:', id);
	console.log('Update data:', updateData);

  	//TO DO: update the contact record in contactList collection, according to contactToUpdate and data included in the body of the HTTP request 
	collection.updateOne({ _id: id }, { $set: updateData }, function (err, result) {
        if (err) {
            console.error('Error occurred while updating document:', err);
            res.status(500).send({ msg: 'Error occurred while updating document.' });
        } else {
            if (result.matchedCount === 0) {
                console.warn('No document found with id:', id);
                res.status(404).send({ msg: 'No document found with the provided id.' });
            } else {
                console.log('Document updated successfully');
                res.send({ msg: '' });
            }
        }
    });
});
  
/*
* DELETE to delete a contact.
*/
router.delete('/deleteContact/:id', function(req, res) {
	console.log("function deleteContent is invoked!")
	var db = req.db;
	var collection = db.collection('contactList');
    var contactToDelete = req.params.id;

	// Convert the contactToUpdate to an ObjectId
    var id;
    try {
        id = ObjectId(contactToDelete);
    } catch (e) {
        console.error('Invalid ObjectId format:', contactToDelete);
        res.status(400).send({ msg: 'Invalid ObjectId format.' });
        return;
    }

    // Log the id being deleted
    console.log('Deleting contact with id:', id);

    //TO DO: update the contact record in contactList collection,
    //according to contactToUpdate and data included in the body of the HTTP request
    collection.deleteOne({ _id: id }, function(err, result) {
        if (err) {
            console.error('Error occurred while deleting document:', err);
            res.status(500).send({ msg: 'Error occurred while deleting document.' });
        } else {
            if (result.deletedCount === 0) {
                console.warn('No document found with id:', id);
                res.status(404).send({ msg: 'No document found with the provided id.' });
            } else {
                console.log('Document deleted successfully');
                res.send({ msg: '' });
            }
        }
    });
});
	

  
module.exports = router;
