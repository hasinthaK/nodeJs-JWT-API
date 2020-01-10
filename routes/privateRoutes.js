const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('From Private Route!');
});


module.exports = router; 