import jwt from "jsonwebtoken";

export const protect = (roles?: string[]) => {
  return (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json("No token");

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded;

      if (roles && !roles.includes(decoded.role)) {
        return res.status(403).json("Forbidden");
      }

      next();
    } catch {
      res.status(401).json("Invalid token");
    }
  };
};
