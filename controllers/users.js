const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc        Get all users
// @route       GET /api/v1/users
// @access      Private
exports.getUsers = asyncHandler(async (req, res, next) => {
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
  query = User.find(JSON.parse(queryStr), {
    __v: 0,
    resetPasswordToken: 0,
    resetPasswordExpire: 0,
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
  const total = await User.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const users = await query;

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
    .json({ success: true, count: users.length, pagination, data: users });
});

// @desc        Get single user
// @route       GET /api/v1/users/:id
// @access      Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 401));
  }
  res.status(200).json({ success: true, data: user });
});

// @desc        Update user by Id
// @route       PUT /api/v1/users/:id
// @access      Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});

// @desc        Create user
// @route       POST /api/v1/users
// @access      Private
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// @desc        Delete user by Id
// @route       POST /api/v1/users/:id
// @access      Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, data: {} });
});
