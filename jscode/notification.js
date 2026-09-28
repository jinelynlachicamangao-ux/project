document.addEventListener("DOMContentLoaded", function () {

    const STORAGE_KEY = "3dProjectNotifications";

    const notificationList = document.getElementById("notificationList");
    const markAllBtn = document.getElementById("markAllBtn");


    const defaultNotifications = [
        { id: 1, icon: "fa-solid fa-circle-check", text: "<strong>Maria</strong> completed <strong>Login Page</strong>", time: "2 hours ago", unread: true },
        { id: 2, icon: "fa-solid fa-database", text: "<strong>John</strong> updated <strong>Database Design</strong>", time: "5 hours ago", unread: true },
        { id: 3, icon: "fa-solid fa-list-check", text: "<strong>Anna</strong> added a new task <strong>User Interface</strong>", time: "Yesterday", unread: false },
        { id: 4, icon: "fa-solid fa-clock", text: "<strong>3 tasks</strong> are overdue and need attention", time: "2 days ago", unread: false }
    ];


    let notifications =
        JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!notifications) {
        notifications = defaultNotifications;
        save();
    }


    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }


    function render() {

        notificationList.innerHTML = "";

        if (notifications.length === 0) {

            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.textContent = "You're all caught up. No notifications.";
            notificationList.appendChild(empty);

            return;

        }

        notifications.forEach(function (item) {

            notificationList.appendChild(createItem(item));

        });

    }


    function createItem(item) {

        const el = document.createElement("div");
        el.className = "notification-item" + (item.unread ? " unread" : "");
        el.dataset.id = item.id;

        el.addEventListener("click", function () {

            if (item.unread) {

                item.unread = false;
                save();
                render();

            }

        });


        const icon = document.createElement("div");
        icon.className = "notification-icon";
        icon.innerHTML = `<i class="${item.icon}"></i>`;


        const body = document.createElement("div");
        body.className = "notification-body";

        const text = document.createElement("div");
        text.className = "notification-text";
        text.innerHTML = item.text;

        const time = document.createElement("div");
        time.className = "notification-time";
        time.textContent = item.time;

        body.appendChild(text);
        body.appendChild(time);


        const dismiss = document.createElement("button");
        dismiss.type = "button";
        dismiss.className = "dismiss-btn";
        dismiss.title = "Dismiss";
        dismiss.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        dismiss.addEventListener("click", function (event) {

            event.stopPropagation();

            notifications = notifications.filter(function (n) {
                return n.id !== item.id;
            });

            save();
            render();

        });


        el.appendChild(icon);
        el.appendChild(body);

        if (item.unread) {

            const dot = document.createElement("span");
            dot.className = "unread-dot";
            el.appendChild(dot);

        }

        el.appendChild(dismiss);

        return el;

    }


    markAllBtn.addEventListener("click", function () {

        notifications.forEach(function (item) {
            item.unread = false;
        });

        save();
        render();

    });


    render();

});