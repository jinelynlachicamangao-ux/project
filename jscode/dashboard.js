document.addEventListener("DOMContentLoaded", function () {

    const profileButton = document.getElementById("profileButton");
    const profileDropdown = document.getElementById("profileDropdown");
    const searchInput = document.getElementById("globalSearch");

    const notifButton = document.getElementById("notifButton");
    const notifDropdown = document.getElementById("notifDropdown");
    const notifList = document.getElementById("notifList");
    const notifDot = document.getElementById("notifDot");
    const notifMarkAll = document.getElementById("notifMarkAll");

    const settingsButton = document.getElementById("settingsButton");
    const viewDeadlinesBtn = document.getElementById("viewDeadlinesBtn");


    /* =====================================================
       USER: initials avatar, name, email
    ===================================================== */

    function applyUser() {

        if (!window.ThreeDUser) return;

        const user = ThreeDUser.get();

        ThreeDUser.renderAvatar(
            document.getElementById("profileAvatar"),
            user
        );

        const welcomeName = document.getElementById("welcomeName");
        const dropdownName = document.getElementById("dropdownName");
        const dropdownEmail = document.getElementById("dropdownEmail");

        if (welcomeName) welcomeName.textContent = user.displayName;
        if (dropdownName) dropdownName.textContent = user.fullName;
        if (dropdownEmail) dropdownEmail.textContent = user.email || "No email set";
    }

    applyUser();


    /* =====================================================
       TODAY'S DATE (updates every day, even if the tab stays open)
    ===================================================== */

    const todayDate = document.getElementById("todayDate");

    function updateDate() {

        if (!todayDate) return;

        todayDate.textContent = new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    }

    function scheduleMidnightUpdate() {

        const now = new Date();

        const nextMidnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            0, 0, 1
        );

        setTimeout(function () {
            updateDate();
            scheduleMidnightUpdate();
        }, nextMidnight - now);
    }

    updateDate();
    scheduleMidnightUpdate();

    document.addEventListener("visibilitychange", function () {
        if (!document.hidden) updateDate();
    });


    /* =====================================================
       NOTIFICATIONS  (same storage key as notification.html)
    ===================================================== */

    const NOTIF_KEY = "3dProjectNotifications";

    const defaultNotifications = [
        { id: 1, icon: "fa-solid fa-circle-check", text: "<strong>Maria</strong> completed <strong>Login Page</strong>", time: "2 hours ago", unread: true },
        { id: 2, icon: "fa-solid fa-database", text: "<strong>John</strong> updated <strong>Database Design</strong>", time: "5 hours ago", unread: true },
        { id: 3, icon: "fa-solid fa-list-check", text: "<strong>Anna</strong> added a new task <strong>User Interface</strong>", time: "Yesterday", unread: false },
        { id: 4, icon: "fa-solid fa-clock", text: "<strong>3 tasks</strong> are overdue and need attention", time: "2 days ago", unread: false }
    ];

    let notifications = null;

    try {
        notifications = JSON.parse(localStorage.getItem(NOTIF_KEY));
    } catch (e) {
        notifications = null;
    }

    if (!Array.isArray(notifications)) {
        notifications = defaultNotifications;
        saveNotifications();
    }

    function saveNotifications() {
        localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
    }

    function renderNotifications() {

        if (!notifList) return;

        notifList.innerHTML = "";

        const unreadCount = notifications.filter(function (n) {
            return n.unread;
        }).length;

        if (notifDot) {
            notifDot.style.display = unreadCount > 0 ? "block" : "none";
        }

        if (notifications.length === 0) {

            const empty = document.createElement("div");
            empty.className = "notif-empty";
            empty.textContent = "You're all caught up.";
            notifList.appendChild(empty);

            return;
        }

        /* Show the 5 most recent in the dropdown */

        notifications.slice(0, 5).forEach(function (item) {

            const row = document.createElement("button");
            row.type = "button";
            row.className = "notif-item" + (item.unread ? " unread" : "");

            const icon = document.createElement("div");
            icon.className = "notif-icon";
            icon.innerHTML = '<i class="' + item.icon + '"></i>';

            const body = document.createElement("div");
            body.className = "notif-body";

            const text = document.createElement("div");
            text.className = "notif-text";
            text.innerHTML = item.text;

            const time = document.createElement("div");
            time.className = "notif-time";
            time.textContent = item.time;

            body.appendChild(text);
            body.appendChild(time);

            row.appendChild(icon);
            row.appendChild(body);

            row.addEventListener("click", function (event) {

                event.stopPropagation();

                if (item.unread) {
                    item.unread = false;
                    saveNotifications();
                    renderNotifications();
                }
            });

            notifList.appendChild(row);
        });
    }

    renderNotifications();

    if (notifMarkAll) {
        notifMarkAll.addEventListener("click", function (event) {

            event.stopPropagation();

            notifications.forEach(function (n) {
                n.unread = false;
            });

            saveNotifications();
            renderNotifications();
        });
    }

    /* keep in sync if notifications change in another tab */

    window.addEventListener("storage", function (event) {

        if (event.key === NOTIF_KEY) {
            try {
                notifications = JSON.parse(event.newValue) || [];
            } catch (e) {
                notifications = [];
            }
            renderNotifications();
        }

        if (event.key === "3dUserSettings") {
            applyUser();
        }
    });


    /* =====================================================
       DROPDOWNS (notifications + profile)
    ===================================================== */

    function closeAllDropdowns() {

        if (notifDropdown) notifDropdown.classList.remove("show");
        if (profileDropdown) profileDropdown.classList.remove("show");

        if (notifButton) notifButton.setAttribute("aria-expanded", "false");
    }

    if (notifButton && notifDropdown) {
        notifButton.addEventListener("click", function (event) {

            event.stopPropagation();

            const willOpen = !notifDropdown.classList.contains("show");

            closeAllDropdowns();

            if (willOpen) {
                notifDropdown.classList.add("show");
                notifButton.setAttribute("aria-expanded", "true");
            }
        });

        notifDropdown.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }

    if (profileButton && profileDropdown) {
        profileButton.addEventListener("click", function (event) {

            event.stopPropagation();

            const willOpen = !profileDropdown.classList.contains("show");

            closeAllDropdowns();

            if (willOpen) {
                profileDropdown.classList.add("show");
            }
        });

        profileDropdown.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }

    document.addEventListener("click", closeAllDropdowns);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeAllDropdowns();
    });


    /* =====================================================
       SETTINGS BUTTON + VIEW ALL DEADLINES
    ===================================================== */

    if (settingsButton) {
        settingsButton.addEventListener("click", function () {
            window.location.href = "settings.html";
        });
    }

    if (viewDeadlinesBtn) {
        viewDeadlinesBtn.addEventListener("click", function () {
            window.location.href = "calendar.html";
        });
    }


    /* =====================================================
       TASK CHECKBOXES
    ===================================================== */

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


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchInput) {

        const searchableItems = document.querySelectorAll(
            ".task-item, .deadline-item, .activity-item"
        );

        searchInput.addEventListener("input", function () {

            const searchText = searchInput.value.trim().toLowerCase();

            searchableItems.forEach(function (item) {
                item.style.display =
                    item.textContent.toLowerCase().includes(searchText)
                        ? ""
                        : "none";
            });
        });
    }

});