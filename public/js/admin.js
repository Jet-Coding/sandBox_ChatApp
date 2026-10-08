document.addEventListener("DOMContentLoaded", () => {
	const sidebar =
		document.getElementById("sidebar") || document.querySelector(".sidebar");
	const toggleBtn = document.getElementById("sidebar-toggle");

	if (!sidebar || !toggleBtn) return;

	// 1. Restore saved collapse state from localStorage
	const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
	if (isCollapsed) {
		sidebar.classList.add("collapsed");
	}

	// 2. Toggle full sidebar on click
	toggleBtn.addEventListener("click", () => {
		sidebar.classList.toggle("collapsed");

		// Save preference across page refreshes/navigation
		const collapsedState = sidebar.classList.contains("collapsed");
		localStorage.setItem("sidebar-collapsed", collapsedState);
	});
});
