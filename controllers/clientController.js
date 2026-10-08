const express = require("express");
const router = express.Router();

// Shared data store or database query layer
let products = [
	{ id: 1, name: "Laptop", price: 999 },
	{ id: 2, name: "Phone", price: 699 },
	{ id: 3, name: "Earpods", price: 299 },
];

// Public Home
router.get("/", (req, res) => {
	res.render("client/index", { title: "Home", products });
});

// Auth Views & Actions
router.get("/login", (req, res) => {
	res.render("client/login", { title: "Login", error: null });
});

router.post("/login", (req, res) => {
	const { email, password } = req.body;
	if (email === "user@example.com" && password === "secret123") {
		req.session.user = { id: 2, name: "Alex", role: "customer", email };
		return res.redirect("/");
	}
	res.render("/client/login", {
		title: "Login",
		error: "Invalid email or password",
	});
});

router.get("/register", (req, res) => {
	res.render("client/register", { title: "Register", errors: [] });
});

router.post("/register", (req, res) => {
	const { username, email, password } = req.body;
	let errors = [];
	if (!username || !email || !password)
		errors.push("Please fill in all fields.");

	if (errors.length > 0) {
		return res.render("client/register", { title: "Register", errors });
	}
	res.redirect("/login");
});

router.get("/logout", (req, res) => {
	req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
