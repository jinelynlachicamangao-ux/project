/* =========================================================
   SHARED SIDEBAR JAVASCRIPT
   3D PROJECT MANAGEMENT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SIDEBAR CONTAINER
    ===================================================== */

    const sidebarContainer = document.getElementById("sidebar-container");

    if (!sidebarContainer) {
        console.error("❌ #sidebar-container was not found.");
        return;
    }


    /* =====================================================
       LOAD SIDEBAR
    ===================================================== */

    const sidebarPath = "sidebar.html";

    fetch(sidebarPath)

        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "HTTP " + response.status +
                    " - sidebar.html could not be loaded."
                );
            }

            return response.text();
        })

        .then(function (html) {

            sidebarContainer.innerHTML = html;

            console.log("✅ Sidebar HTML loaded successfully.");

            initializeSidebar();
        })

        .catch(function (error) {

            console.error("❌ Sidebar loading error:", error);

            sidebarContainer.innerHTML = `
                <div style="
                    color: white;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                ">
                    Sidebar failed to load.<br>
                    Please open this project using Live Server.
                </div>
            `;
        });


    /* =====================================================
       INITIALIZE SIDEBAR
    ===================================================== */

    function initializeSidebar() {

        const sidebar = document.getElementById("sidebar");

        if (!sidebar) {
            console.error("❌ #sidebar was not found inside sidebar.html.");
            return;
        }


        /* =================================================
           MOBILE OVERLAY
        ================================================= */

        let overlay = document.querySelector(".sidebar-overlay");

        if (!overlay) {
            overlay = document.createElement("div");
            overlay.className = "sidebar-overlay";
            document.body.appendChild(overlay);
        }


        /* =================================================
           MOBILE HAMBURGER BUTTON (outside the sidebar)
           This is the button that opens the sidebar on phones.
        ================================================= */

        let mobileBtn = document.getElementById("mobileMenuBtn");

        if (!mobileBtn) {
            mobileBtn = document.createElement("button");
            mobileBtn.id = "mobileMenuBtn";
            mobileBtn.className = "mobile-menu-btn";
            mobileBtn.type = "button";
            mobileBtn.setAttribute("aria-label", "Open menu");
            mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            document.body.appendChild(mobileBtn);
        }

        mobileBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            sidebar.classList.add("mobile-open");
            overlay.classList.add("show");
        });


        /* =================================================
           MENU TOGGLE + LOGO
        ================================================= */

        const menuToggle = document.getElementById("menuToggle");
        const sidebarLogo = document.getElementById("sidebarLogo");


        /* =================================================
           REMEMBER SIDEBAR STATE

           true  = minimized
           false = normal
        ================================================= */

        const sidebarCollapsed =
            localStorage.getItem("sidebarCollapsed") === "true";

        /* Restore the previous sidebar state when changing pages. */

        if (sidebarCollapsed && window.innerWidth > 800) {
            document.body.classList.add("sidebar-collapsed");
        }


        /* =================================================
           UPDATE MENU BUTTON
        ================================================= */

        function updateMenuButton() {

            if (!menuToggle) {
                return;
            }

            const collapsed =
                document.body.classList.contains("sidebar-collapsed");

            const label = collapsed ? "Expand sidebar" : "Collapse sidebar";

            menuToggle.setAttribute("aria-label", label);
            menuToggle.setAttribute("title", label);
        }

        updateMenuButton();


        /* =================================================
           MENU TOGGLE

           Desktop: minimizes the sidebar.
           Use the logo to expand it again.
        ================================================= */

        if (menuToggle) {

            menuToggle.addEventListener("click", function (event) {

                event.stopPropagation();

                /* MOBILE */

                if (window.innerWidth <= 800) {
                    sidebar.classList.add("mobile-open");
                    overlay.classList.add("show");
                    return;
                }

                /* DESKTOP */

                document.body.classList.add("sidebar-collapsed");

                localStorage.setItem("sidebarCollapsed", "true");

                updateMenuButton();
            });
        }


        /* =================================================
           LOGO CLICK (desktop): ALWAYS EXPANDS SIDEBAR
        ================================================= */

        if (sidebarLogo) {

            sidebarLogo.addEventListener("click", function (event) {

                event.stopPropagation();

                if (window.innerWidth > 800) {

                    document.body.classList.remove("sidebar-collapsed");

                    localStorage.setItem("sidebarCollapsed", "false");

                    updateMenuButton();
                }
            });
        }


        /* =================================================
           CLOSE BUTTON (MOBILE ONLY)
        ================================================= */

        const sidebarClose = document.getElementById("sidebarClose");

        if (sidebarClose) {
            sidebarClose.addEventListener("click", closeMobileSidebar);
        }


        /* =================================================
           OVERLAY CLICK
        ================================================= */

        overlay.addEventListener("click", closeMobileSidebar);


        /* =================================================
           CLICK OUTSIDE SIDEBAR (MOBILE ONLY)
        ================================================= */

        document.addEventListener("click", function (event) {

            if (window.innerWidth > 800) {
                return;
            }

            const clickedInsideSidebar = sidebar.contains(event.target);

            const clickedMenu =
                (menuToggle && menuToggle.contains(event.target)) ||
                mobileBtn.contains(event.target);

            if (!clickedInsideSidebar && !clickedMenu) {
                closeMobileSidebar();
            }
        });


        /* =================================================
           ACTIVE PAGE
        ================================================= */

        setActivePage();


        /* =================================================
           MOBILE NAVIGATION

           Clicking a link closes the mobile sidebar.
           It does NOT change the desktop collapsed state.
        ================================================= */

        const navItems = sidebar.querySelectorAll(".nav-item");

        navItems.forEach(function (item) {

            item.addEventListener("click", function () {

                if (window.innerWidth <= 800) {
                    closeMobileSidebar();
                }
            });
        });


        /* =================================================
           WINDOW RESIZE
        ================================================= */

        window.addEventListener("resize", function () {

            if (window.innerWidth > 800) {

                closeMobileSidebar();

                /* Restore saved desktop state. */

                const savedState =
                    localStorage.getItem("sidebarCollapsed") === "true";

                if (savedState) {
                    document.body.classList.add("sidebar-collapsed");
                } else {
                    document.body.classList.remove("sidebar-collapsed");
                }

                updateMenuButton();
            }
        });


        /* =================================================
           CLOSE MOBILE SIDEBAR
        ================================================= */

        function closeMobileSidebar() {
            sidebar.classList.remove("mobile-open");
            overlay.classList.remove("show");
        }


        /* =================================================
           DETERMINE CURRENT PAGE
        ================================================= */

        function setActivePage() {

            const currentPage =
                window.location.pathname
                    .split("/")
                    .pop()
                    .toLowerCase();

            const links = sidebar.querySelectorAll(".nav-item[data-page]");

            links.forEach(function (link) {

                const page = link.getAttribute("data-page").toLowerCase();

                if (page === currentPage) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });
        }

    }

});