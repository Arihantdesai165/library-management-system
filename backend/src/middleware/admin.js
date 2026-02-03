"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
const adminOnly = (req, res, next) => {
    const role = req.user.role;
    if (role !== "ADMIN" && role !== "LIBRARIAN") {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};
exports.adminOnly = adminOnly;
