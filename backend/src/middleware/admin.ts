export const adminOnly = (req: any, res: any, next: any) => {
  const role = req.user.role;

  if (role !== "ADMIN" && role !== "LIBRARIAN") {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};
