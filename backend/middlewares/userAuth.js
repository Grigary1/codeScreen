import jwt from 'jsonwebtoken'


const userAuth = (req, res, next) => {
const JWT_SECRET = process.env.JWT_SECRET;
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token: ID missing",
      });
    }

    req.id = decoded.id;
    req.role=decoded.role;
    next(); 
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }
};

export default userAuth;
