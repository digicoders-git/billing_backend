const express = require('express');
const router = express.Router();
const {
    getGstinDetails,
    getParties,
    getPartyById,
    createParty,
    updateParty,
    deleteParty,
} = require('../controllers/partyController');

router.get('/gstin/:gstin', getGstinDetails);
router.route('/').get(getParties).post(createParty);
router.route('/:id').get(getPartyById).put(updateParty).delete(deleteParty);

module.exports = router;
