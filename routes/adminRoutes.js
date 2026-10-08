const express = require("express");
const db = require("../config/db");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

// Middleware array to protect all admin endpoints
const adminAuth = [verifyToken, requireRole("admin")];

// GET /admin/dashboard
router.get("/dashboard", adminAuth, (req, res) => {
	try {
		const totalUsersStmt = db.prepare("SELECT COUNT(*) AS count FROM users");
		const totalAdminsStmt = db.prepare("SELECT COUNT(*) AS count FROM admin");
		const adminListStmt = db.prepare(
			"SELECT id, username, email, role, created_at FROM admin ORDER BY id DESC"
		);

		const totalUsers = totalUsersStmt.get()?.count || 0;
		const totalAdmins = totalAdminsStmt.get()?.count || 0;
		const adminList = adminListStmt.all();

		res.render("admin/dashboard", {
			title: "Admin Dashboard",
			activePage: "dashboard",
			user: req.user,
			stats: {
				totalUsers,
				totalAdmins,
			},
			adminList,
		});
	} catch (error) {
		console.error("Dashboard DB query error:", error);
		res.status(500).render("admin/dashboard", {
			title: "Admin Dashboard",
			activePage: "dashboard",
			user: req.user,
			stats: { totalUsers: 0, totalAdmins: 0 },
			adminList: [],
		});
	}
});

// GET /admin/users - Display Registered Users Table
router.get("/users", adminAuth, (req, res) => {
	try {
		const stmt = db.prepare("SELECT id, username, email, role, created_at FROM users ORDER BY username ASC");
        const usersList = stmt.all();

        return res.render("admin/users", {
            title: "Users List",
            activePage: "users",
            usersList: usersList,
            user: req.user
        });
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).render("admin/users", {
			title: "Users Lists",
			usersList: [],
			error: "Failed to load registered users."
		});
	}
});

// GET /admin/posts/create
router.get("/posts/create", adminAuth, (req, res) => {
	res.render("admin/create-post", {
		title: "Create New Post",
		activePage: "posts", // Added here
		user: req.user,
	});
});

module.exports = router;