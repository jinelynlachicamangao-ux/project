document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const profileButton = document.getElementById("profileButton");
    const profileDropdown = document.getElementById("profileDropdown");
    const searchInput = document.getElementById("globalSearch");

    // Open the sidebar as a drawer on small screens and collapse it on larger screens.
    if (menuButton && sidebar) {
        menuButton.addEventListener("click", function () {
            if (window.innerWidth <= 800) {
                sidebar.classList.toggle("mobile-open");
            } else {
                document.body.classList.toggle("sidebar-collapsed");
            }
        });

        document.addEventListener("click", function (event) {
            const clickedSidebar = sidebar.contains(event.target);
            const clickedMenu = menuButton.contains(event.target);

            if (window.innerWidth <= 800 && !clickedSidebar && !clickedMenu) {
                sidebar.classList.remove("mobile-open");
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 800) {
                sidebar.classList.remove("mobile-open");
            }
        });
    }

    // Highlight the selected sidebar link for in-page links and logout.
    const navigationItems = document.querySelectorAll(".nav-item");

    navigationItems.forEach(function (item) {
        item.addEventListener("click", function () {
            const href = item.getAttribute("href") || "";
            const isLogout = item.classList.contains("logout");

            if (!isLogout && !href.startsWith("#")) {
                return;
            }

            navigationItems.forEach(function (navigationItem) {
                navigationItem.classList.remove("active");
            });

            item.classList.add("active");
        });
    });

    // Open the profile menu and close it when the user clicks elsewhere.
    if (profileButton && profileDropdown) {
        profileButton.addEventListener("click", function (event) {
            event.stopPropagation();
            profileDropdown.classList.toggle("show");
        });

        document.addEventListener("click", function (event) {
            const clickedProfile = profileButton.contains(event.target);
            const clickedDropdown = profileDropdown.contains(event.target);

            if (!clickedProfile && !clickedDropdown) {
                profileDropdown.classList.remove("show");
            }
        });
    }

    // Fade checked tasks and restore them when unchecked.
    const taskCheckboxes = document.querySelectorAll(
        '.task-check input[type="checkbox"]'
    );

    taskCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            const task = checkbox.closest(".task-item");

            if (task) {
                task.style.opacity = checkbox.checked ? "0.55" : "1";
            }
        });
    });

    // Filter task, deadline, and activity items as the user types.
    if (searchInput) {
        const searchableItems = document.querySelectorAll(
            ".task-item, .deadline-item, .activity-item"
        );

        searchInput.addEventListener("input", function () {
            const searchText = searchInput.value.trim().toLowerCase();

            searchableItems.forEach(function (item) {
                const itemText = item.textContent.toLowerCase();
                item.style.display = itemText.includes(searchText) ? "" : "none";
            });
        });
    }

    // Set transitions on dashboard cards when the pointer first enters them.
    const dashboardCards = document.querySelectorAll(
        ".dashboard-card, .stat-card"
    );

    dashboardCards.forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            card.style.transition = "transform 0.2s ease, border-color 0.2s ease";
        });
    });
});