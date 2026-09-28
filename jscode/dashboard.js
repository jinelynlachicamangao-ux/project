document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SIDEBAR
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    menuToggle.addEventListener("click", function () {

        if (window.innerWidth <= 800) {

            sidebar.classList.toggle("mobile-open");

        } else {

            document.body.classList.toggle("sidebar-collapsed");

        }

    });


    /* =====================================================
       CLOSE MOBILE SIDEBAR WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener("click", function (event) {

        if (window.innerWidth > 800) return;

        const clickedInsideSidebar =
            sidebar.contains(event.target);

        const clickedMenu =
            menuToggle.contains(event.target);

        if (!clickedInsideSidebar && !clickedMenu) {

            sidebar.classList.remove("mobile-open");

        }

    });


    /* =====================================================
       SIDEBAR ACTIVE NAVIGATION
    ===================================================== */

    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(function (item) {

        item.addEventListener("click", function () {

            if (
                !item.classList.contains("logout") &&
                !item.getAttribute("href").startsWith("#")
            ) {
                return;
            }

            navItems.forEach(function (nav) {
                nav.classList.remove("active");
            });

            item.classList.add("active");

        });

    });


    /* =====================================================
       PROFILE DROPDOWN
    ===================================================== */

    const profileButton =
        document.getElementById("profileButton");

    const profileDropdown =
        document.getElementById("profileDropdown");


    profileButton.addEventListener("click", function (event) {

        event.stopPropagation();

        profileDropdown.classList.toggle("show");

    });


    document.addEventListener("click", function (event) {

        if (
            !profileDropdown.contains(event.target) &&
            !profileButton.contains(event.target)
        ) {

            profileDropdown.classList.remove("show");

        }

    });


    /* =====================================================
       TASK CHECKBOXES
    ===================================================== */

    const checkboxes =
        document.querySelectorAll(
            '.task-check input[type="checkbox"]'
        );


    checkboxes.forEach(function (checkbox) {

        checkbox.addEventListener("change", function () {

            const taskItem =
                checkbox.closest(".task-item");

            if (checkbox.checked) {

                taskItem.style.opacity = "0.55";

            } else {

                taskItem.style.opacity = "1";

            }

        });

    });


    /* =====================================================
       SEARCH
    ===================================================== */

    const searchInput =
        document.getElementById("globalSearch");


    const searchableItems =
        document.querySelectorAll(
            ".task-item, .deadline-item, .activity-item"
        );


    searchInput.addEventListener("input", function () {

        const searchValue =
            searchInput.value
                .toLowerCase()
                .trim();


        searchableItems.forEach(function (item) {

            const text =
                item.textContent.toLowerCase();


            if (text.includes(searchValue)) {

                item.style.display = "";

            } else {

                item.style.display = "none";

            }

        });

    });


    /* =====================================================
       CARD HOVER EFFECT
    ===================================================== */

    const cards =
        document.querySelectorAll(
            ".dashboard-card, .stat-card"
        );


    cards.forEach(function (card) {

        card.addEventListener("mouseenter", function () {

            card.style.transition =
                "transform 0.2s ease, border-color 0.2s ease";

        });

    });


    /* =====================================================
       WINDOW RESIZE
    ===================================================== */

    window.addEventListener("resize", function () {

        if (window.innerWidth > 800) {

            sidebar.classList.remove("mobile-open");

        }

    });

});