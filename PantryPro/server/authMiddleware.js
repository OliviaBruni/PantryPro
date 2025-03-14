import { auth } from "./firebaseAdmin.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; // Attach user data to request
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
