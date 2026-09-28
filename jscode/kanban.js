document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PROJECT FROM URL
    ===================================================== */

    const urlParams =
        new URLSearchParams(window.location.search);

    const projectName =
        urlParams.get("project") || "Project";


    document.getElementById("projectTitle").textContent =
        projectName;

    document.title =
        `${projectName} - Kanban - 3D Project Management`;


    /* =====================================================
       STORAGE KEY (unique per project)
    ===================================================== */

    const STORAGE_KEY =
        "3dProjectKanban_" + projectName;

    const MEMBERS_STORAGE_KEY =
        "3dProjectMembers_" + projectName;


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const returnBtn =
        document.getElementById("returnBtn");

    const addBtn =
        document.getElementById("addBtn");

    const taskModal =
        document.getElementById("taskModal");

    const taskForm =
        document.getElementById("taskForm");

    const cancelBtn =
        document.getElementById("cancelBtn");

    const closeModalBtn =
        document.getElementById("closeModalBtn");

    const taskTitleLabel =
        document.getElementById("taskTitleLabel");

    const taskTitleInput =
        document.getElementById("taskTitleInput");

    const taskDescInput =
        document.getElementById("taskDescInput");

    const taskStatusInput =
        document.getElementById("taskStatusInput");

    const todoList =
        document.getElementById("todoList");

    const doingList =
        document.getElementById("doingList");

    const doneList =
        document.getElementById("doneList");

    const membersRow =
        document.getElementById("membersRow");

    const inviteBtn =
        document.getElementById("inviteBtn");

    const inviteModal =
        document.getElementById("inviteModal");

    const inviteForm =
        document.getElementById("inviteForm");

    const cancelInviteBtn =
        document.getElementById("cancelInviteBtn");

    const closeInviteModalBtn =
        document.getElementById("closeInviteModalBtn");

    const inviteEmailInput =
        document.getElementById("inviteEmailInput");

    const inviteRoleInput =
        document.getElementById("inviteRoleInput");


    /* =====================================================
       RETURN TO PROJECTS
    ===================================================== */

    returnBtn.addEventListener("click", function () {

        window.location.href = "Project.html";

    });


    /* =====================================================
       TASK STORAGE
    ===================================================== */

    const defaultTasks = [
        { id: 1, title: "Design UI", description: "Create wireframes", status: "todo" },
        { id: 2, title: "Setup Database", description: "Configure database schema", status: "doing" },
        { id: 3, title: "Review Code", description: "Code review and testing", status: "done" }
    ];


    let tasks =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );


    if (!tasks) {

        tasks = defaultTasks;

        saveTasks();

    }


    /* =====================================================
       SAVE TO LOCAL STORAGE
    ===================================================== */

    function saveTasks() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tasks)
        );

    }


    /* =====================================================
       MEMBER STORAGE
    ===================================================== */

    let members =
        JSON.parse(
            localStorage.getItem(MEMBERS_STORAGE_KEY)
        ) || [];


    function saveMembers() {

        localStorage.setItem(
            MEMBERS_STORAGE_KEY,
            JSON.stringify(members)
        );

    }


    /* =====================================================
       MODAL
    ===================================================== */

    function openModal() {

        taskModal.classList.add("show");

        taskModal.setAttribute("aria-hidden", "false");

        taskTitleLabel.textContent = "Create a task";

        taskForm.reset();

        taskTitleInput.focus();

    }

    function closeModal() {

        taskModal.classList.remove("show");

        taskModal.setAttribute("aria-hidden", "true");

        taskForm.reset();

    }

    addBtn.addEventListener("click", openModal);
    cancelBtn.addEventListener("click", closeModal);
    closeModalBtn.addEventListener("click", closeModal);

    taskModal.addEventListener("click", function (event) {

        if (event.target === taskModal) {

            closeModal();

        }

    });

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape" && taskModal.classList.contains("show")) {

            closeModal();

        }

        if (event.key === "Escape" && inviteModal.classList.contains("show")) {

            closeInviteModal();

        }

    });


    /* =====================================================
       INVITE MODAL
    ===================================================== */

    function openInviteModal() {

        inviteModal.classList.add("show");

        inviteModal.setAttribute("aria-hidden", "false");

        inviteForm.reset();

        inviteEmailInput.focus();

    }

    function closeInviteModal() {

        inviteModal.classList.remove("show");

        inviteModal.setAttribute("aria-hidden", "true");

        inviteForm.reset();

    }

    inviteBtn.addEventListener("click", openInviteModal);
    cancelInviteBtn.addEventListener("click", closeInviteModal);
    closeInviteModalBtn.addEventListener("click", closeInviteModal);

    inviteModal.addEventListener("click", function (event) {

        if (event.target === inviteModal) {

            closeInviteModal();

        }

    });


    /* =====================================================
       SEND INVITE
    ===================================================== */

    inviteForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = inviteEmailInput.value.trim();
        const role = inviteRoleInput.value;

        if (!email) {
            return;
        }

        const alreadyInvited = members.some(function (member) {

            return member.email.toLowerCase() === email.toLowerCase();

        });

        if (alreadyInvited) {

            inviteEmailInput.focus();

            return;

        }

        members.push({
            id: Date.now(),
            email: email,
            role: role
        });

        saveMembers();
        renderMembers();
        closeInviteModal();

    });


    /* =====================================================
       RENDER MEMBERS
    ===================================================== */

    function renderMembers() {

        membersRow.innerHTML = "";

        if (members.length === 0) {

            const empty = document.createElement("span");
            empty.className = "no-members";
            empty.textContent = "No members invited yet.";

            membersRow.appendChild(empty);

            return;

        }

        members.forEach(function (member) {

            membersRow.appendChild(
                createMemberChip(member)
            );

        });

    }


    /* =====================================================
       CREATE MEMBER CHIP
    ===================================================== */

    function createMemberChip(member) {

        const chip = document.createElement("div");
        chip.className = "member-chip";

        const avatar = document.createElement("div");
        avatar.className = "member-avatar";
        avatar.textContent = member.email.charAt(0).toUpperCase();

        const info = document.createElement("div");
        info.className = "member-info";

        const email = document.createElement("span");
        email.className = "member-email";
        email.textContent = member.email;

        const role = document.createElement("span");
        role.className = "member-role";
        role.textContent = member.role;

        info.appendChild(email);
        info.appendChild(role);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-member";
        removeButton.title = "Remove member";
        removeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        removeButton.addEventListener("click", function () {

            removeMember(member.id);

        });

        chip.appendChild(avatar);
        chip.appendChild(info);
        chip.appendChild(removeButton);

        return chip;

    }


    /* =====================================================
       REMOVE MEMBER
    ===================================================== */

    function removeMember(id) {

        members = members.filter(function (member) {

            return member.id !== id;

        });

        saveMembers();
        renderMembers();

    }


    /* =====================================================
       SAVE TASK
    ===================================================== */

    taskForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const title = taskTitleInput.value.trim();
        const description = taskDescInput.value.trim();
        const status = taskStatusInput.value;

        if (!title) {
            return;
        }

        tasks.push({
            id: Date.now(),
            title: title,
            description: description,
            status: status
        });

        saveTasks();
        renderTasks();
        closeModal();

    });


    /* =====================================================
       RENDER TASKS
    ===================================================== */

    function renderTasks() {

        todoList.innerHTML = "";
        doingList.innerHTML = "";
        doneList.innerHTML = "";

        const lists = {
            todo: todoList,
            doing: doingList,
            done: doneList
        };

        tasks.forEach(function (task) {

            lists[task.status].appendChild(
                createTaskCard(task)
            );

        });

        updateCounts();

    }


    /* =====================================================
       CREATE TASK CARD
    ===================================================== */

    function createTaskCard(task) {

        const card = document.createElement("article");
        card.className = "task-card";
        card.dataset.id = task.id;

        const title = document.createElement("h3");
        title.className = "task-card-title";
        title.textContent = task.title;

        const description = document.createElement("p");
        description.className = "task-card-description";
        description.textContent = task.description || "No description";

        const footer = document.createElement("div");
        footer.className = "task-card-footer";

        const status = document.createElement("span");
        status.className = "task-status-label " + task.status;

        if (task.status === "todo") {
            status.textContent = "TO DO";
        } else if (task.status === "doing") {
            status.textContent = "IN PROGRESS";
        } else {
            status.textContent = "DONE";
        }

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-task";
        deleteButton.title = "Delete task";
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        deleteButton.addEventListener("click", function () {

            deleteTask(task.id);

        });

        footer.appendChild(status);
        footer.appendChild(deleteButton);

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(footer);

        return card;

    }


    /* =====================================================
       DELETE TASK
    ===================================================== */

    function deleteTask(id) {

        tasks = tasks.filter(function (task) {

            return task.id !== id;

        });

        saveTasks();
        renderTasks();

    }


    /* =====================================================
       UPDATE COUNTS
    ===================================================== */

    function updateCounts() {

        document.querySelector('[data-count="todo"]').textContent =
            tasks.filter(t => t.status === "todo").length;

        document.querySelector('[data-count="doing"]').textContent =
            tasks.filter(t => t.status === "doing").length;

        document.querySelector('[data-count="done"]').textContent =
            tasks.filter(t => t.status === "done").length;

    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    renderTasks();
    renderMembers();

});