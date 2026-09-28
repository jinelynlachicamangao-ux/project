/* =========================================================
   SHARED SIDEBAR JAVASCRIPT
   3D PROJECT MANAGEMENT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SIDEBAR CONTAINER
    ===================================================== */

    const sidebarContainer =
        document.getElementById("sidebar-container");


    if (!sidebarContainer) {

        console.error(
            "❌ #sidebar-container was not found."
        );

        return;
    }


    /* =====================================================
       LOAD SIDEBAR
       
       sidebar.html is inside the same /pages folder
       as Dashboard.html, mytask.html, etc.
    ===================================================== */

    const sidebarPath = "sidebar.html";


    console.log(
        "Loading sidebar from:",
        sidebarPath
    );


    fetch(sidebarPath)

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status +
                    " - sidebar.html could not be loaded."
                );

            }

            return response.text();

        })


        .then(function (html) {

            sidebarContainer.innerHTML = html;


            console.log(
                "✅ Sidebar HTML loaded successfully."
            );


            initializeSidebar();

        })


        .catch(function (error) {

            console.error(
                "❌ Sidebar loading error:",
                error
            );


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

        const sidebar =
            document.getElementById("sidebar");


        if (!sidebar) {

            console.error(
                "❌ #sidebar was not found inside sidebar.html."
            );

            return;
        }


        console.log(
            "✅ Sidebar initialized."
        );




        let overlay =
            document.querySelector(".sidebar-overlay");


        if (!overlay) {

            overlay =
                document.createElement("div");

            overlay.className =
                "sidebar-overlay";

            document.body.appendChild(
                overlay
            );

        }



 

let menuToggle = document.getElementById("menuToggle");

if (!menuToggle) {

    menuToggle = document.createElement("button");
    menuToggle.id = "menuToggle";
    menuToggle.className = "menu-toggle";
    menuToggle.type = "button";
    menuToggle.setAttribute("aria-label", "Open menu");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';

    document.body.appendChild(menuToggle);
}


/* =================================================
   MENU BUTTON
================================================= */

menuToggle.addEventListener("click", function (event) {
    event.stopPropagation();

    if (window.innerWidth <= 800) {
        sidebar.classList.add("mobile-open");
        overlay.classList.add("show");
    } else {
        document.body.classList.toggle("sidebar-collapsed");
    }
});

        /* =================================================
           CLOSE BUTTON
        ================================================= */

        const sidebarClose =
            document.getElementById(
                "sidebarClose"
            );


        if (sidebarClose) {

            sidebarClose.addEventListener(
                "click",
                function () {

                    closeMobileSidebar();

                }
            );

        }



        /* =================================================
           OVERLAY CLICK
        ================================================= */

        overlay.addEventListener(
            "click",
            function () {

                closeMobileSidebar();

            }
        );



        /* =================================================
           CLICK OUTSIDE SIDEBAR
           MOBILE ONLY
        ================================================= */

        document.addEventListener(
            "click",
            function (event) {

                if (window.innerWidth > 800) {

                    return;
                }


                const clickedInsideSidebar =
                    sidebar.contains(
                        event.target
                    );


                const clickedMenu =
                    menuToggle.contains(
                        event.target
                    );


                if (
                    !clickedInsideSidebar &&
                    !clickedMenu
                ) {

                    closeMobileSidebar();

                }

            }
        );



        /* =================================================
           ACTIVE PAGE
        ================================================= */

        setActivePage();



        /* =================================================
           MOBILE NAVIGATION
        ================================================= */

        const navItems =
            sidebar.querySelectorAll(
                ".nav-item"
            );


        navItems.forEach(
            function (item) {

                item.addEventListener(
                    "click",
                    function () {

                        if (
                            window.innerWidth <= 800
                        ) {

                            closeMobileSidebar();

                        }

                    }
                );

            }
        );



        /* =================================================
           WINDOW RESIZE
        ================================================= */

        window.addEventListener(
            "resize",
            function () {

                if (
                    window.innerWidth > 800
                ) {

                    closeMobileSidebar();

                }

            }
        );



        /* =================================================
           CLOSE MOBILE SIDEBAR
        ================================================= */

        function closeMobileSidebar() {

            sidebar.classList.remove(
                "mobile-open"
            );


            overlay.classList.remove(
                "show"
            );

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


            const links =
                sidebar.querySelectorAll(
                    ".nav-item[data-page]"
                );


            links.forEach(
                function (link) {

                    const page =
                        link
                            .getAttribute(
                                "data-page"
                            )
                            .toLowerCase();


                    if (
                        page === currentPage
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                    else {

                        link.classList.remove(
                            "active"
                        );

                    }

                }
            );

        }

    }

});