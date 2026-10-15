document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

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

    const taskTitle =
        document.getElementById("taskTitle");

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

    const board =
        document.getElementById("board");


    /* =====================================================
       TASK STORAGE
    ===================================================== */

    let tasks =
        JSON.parse(
            localStorage.getItem("3dProjectTasks")
        ) || [];


    /* =====================================================
       OPEN MODAL
    ===================================================== */

    function openModal() {

        taskModal.classList.add("show");

        taskModal.setAttribute(
            "aria-hidden",
            "false"
        );

        taskTitle.textContent =
            "Create a task";

        taskForm.reset();

        taskTitleInput.focus();

    }


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeModal() {

        taskModal.classList.remove("show");

        taskModal.setAttribute(
            "aria-hidden",
            "true"
        );

        taskForm.reset();

    }


    /* =====================================================
       ADD BUTTON
    ===================================================== */

    addBtn.addEventListener(
        "click",
        openModal
    );


    cancelBtn.addEventListener(
        "click",
        closeModal
    );


    closeModalBtn.addEventListener(
        "click",
        closeModal
    );


    /* =====================================================
       CLICK OUTSIDE MODAL
    ===================================================== */

    taskModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === taskModal
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                taskModal.classList.contains("show")
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       SAVE TASK
    ===================================================== */

    taskForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const title =
                taskTitleInput.value.trim();

            const description =
                taskDescInput.value.trim();

            const status =
                taskStatusInput.value;


            if (!title) {
                return;
            }


            const task = {

                id:
                    Date.now(),

                title:
                    title,

                description:
                    description,

                status:
                    status

            };


            tasks.push(task);


            saveTasks();

            renderTasks();

            closeModal();

        }
    );


    /* =====================================================
       SAVE TO LOCAL STORAGE
    ===================================================== */

    function saveTasks() {

        localStorage.setItem(
            "3dProjectTasks",
            JSON.stringify(tasks)
        );

    }


    /* =====================================================
       RENDER TASKS
    ===================================================== */

    function renderTasks() {

        todoList.innerHTML = "";

        doingList.innerHTML = "";

        doneList.innerHTML = "";


        const lists = {

            todo:
                todoList,

            doing:
                doingList,

            done:
                doneList

        };


        tasks.forEach(function (task) {

            const card =
                createTaskCard(task);

            lists[task.status].appendChild(card);

        });


        updateCounts();

    }


    /* =====================================================
       CREATE TASK CARD
    ===================================================== */

    function createTaskCard(task) {

        const card =
            document.createElement("article");

        card.className =
            "task-card";


        card.draggable = true;

        card.dataset.id =
            task.id;


        const title =
            document.createElement("h3");

        title.className =
            "task-card-title";

        title.textContent =
            task.title;


        const description =
            document.createElement("p");

        description.className =
            "task-card-description";

        description.textContent =
            task.description ||
            "No description";


        const footer =
            document.createElement("div");

        footer.className =
            "task-card-footer";


        const status =
            document.createElement("span");

        status.className =
            "task-status-label " +
            task.status;


        if (task.status === "todo") {

            status.textContent =
                "TO DO";

        } else if (task.status === "doing") {

            status.textContent =
                "IN PROGRESS";

        } else {

            status.textContent =
                "DONE";

        }


        const deleteButton =
            document.createElement("button");

        deleteButton.type =
            "button";

        deleteButton.className =
            "delete-task";

        deleteButton.title =
            "Delete task";

        deleteButton.innerHTML =
            '<i class="fa-solid fa-trash"></i>';


        deleteButton.addEventListener(
            "click",
            function () {

                deleteTask(task.id);

            }
        );


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

        tasks =
            tasks.filter(function (task) {

                return task.id !== id;

            });


        saveTasks();

        renderTasks();

    }


    /* =====================================================
       UPDATE COUNTS
    ===================================================== */

    function updateCounts() {

        const todoCount =
            tasks.filter(
                task => task.status === "todo"
            ).length;


        const doingCount =
            tasks.filter(
                task => task.status === "doing"
            ).length;


        const doneCount =
            tasks.filter(
                task => task.status === "done"
            ).length;


        document.querySelector(
            '[data-count="todo"]'
        ).textContent =
            todoCount;


        document.querySelector(
            '[data-count="doing"]'
        ).textContent =
            doingCount;


        document.querySelector(
            '[data-count="done"]'
        ).textContent =
            doneCount;

    }


    /* =================================================
       TASK DRAG AND DROP
    ================================================== */

    board.addEventListener("dragstart", function (event) {

        const card = event.target.closest(".task-card");

        if (!card) return;

        card.classList.add("dragging");

    });


    board.addEventListener("dragend", function (event) {

        const card = event.target.closest(".task-card");

        if (!card) return;

        card.classList.remove("dragging");

    });


    board.addEventListener("dragover", function (event) {

        const cardsContainer =
            event.target.closest(".cards");

        if (!cardsContainer) return;

        event.preventDefault();

        const column =
            cardsContainer.closest(".column");

        if (column) {

            column.classList.add("drag-over");

        }

    });


    board.addEventListener("dragleave", function (event) {

        const column =
            event.target.closest(".column");

        if (!column) return;

        if (!column.contains(event.relatedTarget)) {

            column.classList.remove("drag-over");

        }

    });


    board.addEventListener("drop", function (event) {

        const cardsContainer =
            event.target.closest(".cards");

        if (!cardsContainer) return;

        event.preventDefault();

        const card =
            document.querySelector(".task-card.dragging");

        if (!card) return;

        const column =
            cardsContainer.closest(".column");

        if (!column) return;

        const newStatus =
            column.dataset.status;

        const taskId =
            Number(card.dataset.id);

        const task =
            tasks.find(function (item) {

                return Number(item.id) === taskId;

            });

        if (task) {

            task.status = newStatus;

            saveTasks();

            renderTasks();

        }

        column.classList.remove("drag-over");

    });


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    renderTasks();

});