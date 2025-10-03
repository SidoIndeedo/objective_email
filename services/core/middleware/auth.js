// const jwt = require("jsonwebtoken");
// const catchAsync = require("../utils/catchAsync");



// exports.jwtMolestor = catchAsync( async(req, res, next) => {
//     const authHeadfreaky = req.headers.authorization;

//     if(!authHeadfreaky || !authHeadfreaky.startsWith('Bearer ')){
//         return res.status(401).json({
//             status: "error",
//             error: "invalid authorization token, don't be freaky!!!!!"
//         })
//     }

//     const headerToken = authHeadfreaky.split(' ')[1];
    
//     const decoded = jwt.verify(headerToken, process.env.JWT_SECRET)
    
//     req.user = decoded;
//     next();
// })

const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");

exports.jwtMolestor = catchAsync(async (req, res, next) => {
  const token = req.cookies.token; // <--- read cookie
  if (!token) {
    return res.status(401).json({
      status: "error",
      error: "No token provided"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "error",
      error: "Invalid or expired token"
    });
  }
});
