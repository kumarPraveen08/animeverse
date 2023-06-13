const express = require("express");
const router = express.Router();
const {
  getQuote,
  getQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
  randomQuote,
} = require("../controllers/quotes");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(getQuotes)
  .post(protect, authorize("publisher", "admin"), createQuote);
router
  .route("/:id")
  .get(getQuote)
  .put(protect, authorize("publisher", "admin"), updateQuote)
  .delete(protect, authorize("publisher", "admin"), deleteQuote);
router.route("/random/:id").get(randomQuote);

module.exports = router;
