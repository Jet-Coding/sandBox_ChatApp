const express = require("express");
const router = express.Router();

// Middleware: Admin Protection
function isAdmin(req, res, next) {
	if (req.session.admin && req.session.admin.role === "admin") {
		return next();
	}
	res.status(403).send("Access Denied: Admins Only");
}

// Quick Dev Login
router.get("../login-admin", (req, res) => {
	req.session.admin = { id: 1, name: "Sandbox", role: "admin" };
	res.redirect("/dashboard");
});

// Admin Dashboard
router.get("/", isAdmin, (req, res) => {
	res.render("../admin/dashboard", {
		title: "Admin Dashboard",
	});
});

// Users Dashboard
router.get("/users", isAdmin, (req, res) => {
	res.render("../admin/users", {
		title: "Admin Dashboard",
	});
});

module.exports = router;
