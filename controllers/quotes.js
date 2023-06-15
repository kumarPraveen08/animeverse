const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Quote = require("../models/Quotes");

// @desc        Get all quotes
// @route       GET /api/v1/animechan
// @access      Public
exports.getQuotes = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  let reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and remove them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Finding resource
  query = Quote.find(JSON.parse(queryStr), {
    _id: 0,
    createdAt: 0,
    updatedAt: 0,
    __v: 0,
  });

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //   Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Quote.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const quotes = await query;

  //   Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res
    .status(200)
    .json({ success: true, count: quotes.length, pagination, data: quotes });
});

// @desc        Get single quote
// @route       GET /api/v1/animechan/:id
// @access      Public
exports.getQuote = asyncHandler(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id, {
    createdAt: 0,
    updatedAt: 0,
    __v: 0,
  });
  if (!quote)
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  res.status(200).json({ success: true, data: quote });
});

// @desc        Create new quote
// @route       POST /api/v1/animechan
// @access      Private
exports.createQuote = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const quote = await Quote.create(req.body);
  res.status(201).json({ success: true, data: quote });
});

// @desc        Update quote
// @route       PUT /api/v1/animechan/:id
// @access      Private
exports.updateQuote = asyncHandler(async (req, res, next) => {
  let quote = await Quote.findById(req.params.id);

  if (!quote)
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );

  // Make sure user is quote owner
  if (quote.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this quote`,
        401
      )
    );
  }

  quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: quote });
});

// @desc        Delete quote
// @route       DELETE /api/v1/animechan/:id
// @access      Private
exports.deleteQuote = asyncHandler(async (req, res, next) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote)
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );

  // Make sure user is quote owner
  if (quote.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this quote`,
        401
      )
    );
  }

  await Quote.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});

// @desc        Get single random quote
// @route       GET /api/v1/animechan/random/:true
// @access      Public
exports.randomQuote = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ success: false });
  }

  // Checking limit query
  let limit = req.query.limit || 1;
  if (limit > 20) limit = 1;

  // Finding resources
  let quotes = Quote.find({}, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 });

  // Assigning startIndex and endIndex
  let t = (await Quote.countDocuments()) - limit;
  let r = Math.floor(Math.random() * t);

  // Pagination
  quotes = quotes.skip(r).limit(limit);

  // Getting resources
  quotes = await quotes;

  res.status(200).json({ success: true, data: quotes });
});
