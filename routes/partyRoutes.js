const express = require('express');
const router = express.Router();
const {
    getParties,
    getPartyById,
    createParty,
    updateParty,
    deleteParty,
} = require('../controllers/partyController');

router.route('/').get(getParties).post(createParty);
router.route('/:id').get(getPartyById).put(updateParty).delete(deleteParty);

module.exports = router;
