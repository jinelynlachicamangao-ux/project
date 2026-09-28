document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const folderGrid =
        document.getElementById("folderGrid");


    /* =====================================================
       FOLDER STORAGE
    ===================================================== */

    const STORAGE_KEY = "3dProjectFolders";


    const defaultFolders = [
        "Project 1",
        "Project 2",
        "Project 3",
        "Project 4",
        "Project 5",
        "Project 6",
        "Project 7"
    ];


    let folders =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );


    if (!folders) {

        folders = defaultFolders.map(function (name, index) {

            return {
                id: index + 1,
                name: name
            };

        });

        saveFolders();

    }


    /* =====================================================
       SAVE TO LOCAL STORAGE
    ===================================================== */

    function saveFolders() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(folders)
        );

    }


    /* =====================================================
       RENDER FOLDERS
    ===================================================== */

    function renderFolders() {

        folderGrid.innerHTML = "";

        folders.forEach(function (folder) {

            folderGrid.appendChild(
                createFolderCard(folder)
            );

        });

        folderGrid.appendChild(
            createNewFolderCard()
        );

    }


    /* =====================================================
       CREATE FOLDER CARD
    ===================================================== */

    function createFolderCard(folder) {

        const card =
            document.createElement("div");

        card.className = "folder-card";

        card.dataset.id = folder.id;


        card.addEventListener("click", function () {

            openProjectKanban(folder.name);

        });


        const icon =
            document.createElement("div");

        icon.className = "folder-icon";

        icon.innerHTML =
            '<i class="fa-solid fa-folder"></i>';


        const name =
            document.createElement("span");

        name.className = "folder-name";

        name.contentEditable = "true";

        name.textContent = folder.name;


        name.addEventListener("click", function (event) {

            event.stopPropagation();

        });


        name.addEventListener("blur", function () {

            const newName =
                name.textContent.trim() || folder.name;

            name.textContent = newName;

            folder.name = newName;

            saveFolders();

        });


        name.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                name.blur();

            }

        });


        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";

        deleteButton.className = "folder-delete";

        deleteButton.title = "Delete folder";

        deleteButton.innerHTML =
            '<i class="fa-solid fa-trash"></i>';


        deleteButton.addEventListener("click", function (event) {

            event.stopPropagation();

            deleteFolder(folder.id);

        });


        card.appendChild(icon);
        card.appendChild(name);
        card.appendChild(deleteButton);


        return card;

    }


    /* =====================================================
       CREATE "NEW FOLDER" CARD
    ===================================================== */

    function createNewFolderCard() {

        const card =
            document.createElement("div");

        card.className = "folder-card create-card";


        const icon =
            document.createElement("div");

        icon.className = "folder-icon create-icon";

        icon.innerHTML =
            '<i class="fa-solid fa-plus"></i>';


        const label =
            document.createElement("span");

        label.textContent = "Create Folder";


        card.appendChild(icon);
        card.appendChild(label);


        card.addEventListener("click", function () {

            addFolder();

        });


        return card;

    }


    /* =====================================================
       ADD FOLDER
    ===================================================== */

    function addFolder() {

        const newFolder = {

            id: Date.now(),

            name: "New Folder"

        };

        folders.push(newFolder);

        saveFolders();

        renderFolders();


        const cards =
            folderGrid.querySelectorAll(".folder-card");

        const newCard =
            cards[cards.length - 2];

        const nameEl =
            newCard.querySelector(".folder-name");


        if (nameEl) {

            nameEl.focus();

            document.execCommand(
                "selectAll",
                false,
                null
            );

        }

    }


    /* =====================================================
       DELETE FOLDER
    ===================================================== */

    function deleteFolder(id) {

        folders =
            folders.filter(function (folder) {

                return folder.id !== id;

            });

        saveFolders();

        renderFolders();

    }


    /* =====================================================
       OPEN PROJECT KANBAN
    ===================================================== */

    function openProjectKanban(projectName) {

        window.location.href =
            `Kaban.html?project=${encodeURIComponent(projectName)}`;

    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    renderFolders();

});