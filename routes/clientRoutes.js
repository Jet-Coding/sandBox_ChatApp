const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/auth");

// GET / - Render client chat workspace with dynamic users list
router.get("/", verifyToken, (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Fetch registered users for the workspace sidebar
        const stmt = db.prepare("SELECT id, username, email FROM users WHERE id != ? ORDER BY username ASC");
        const usersList = stmt.all(currentUserId);

        return res.render("client/index", {
            title: "SandBox Chat Workspace",
            user: req.user,
            usersList: usersList
        });
    } catch (error) {
        console.error("Error loading chat workspace:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Optional authentication middleware
const optionalAuth = (req, res, next) => {
    const token = req.cookies?.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
            
            // Query DB to verify user exists
            const stmt = db.prepare("SELECT id, username, email, role FROM users WHERE id = ?");
            const dbUser = stmt.get(decoded.id);

            req.user = dbUser || null;
        } catch (err) {
            req.user = null;
        }
    } else {
        req.user = null;
    }
    next();
};

module.exports = router;