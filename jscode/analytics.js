document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const progressList =
        document.getElementById("progressList");


    /* =====================================================
       PROGRESS DATA
       Edit or extend this array to add more acts
    ===================================================== */

    const progressData = [

        { label: "Act 1", value: 70 },
        { label: "Act 2", value: 10 },
        { label: "Act 3", value: 50 },
        { label: "Act 4", value: 20 }

    ];


    /* =====================================================
       RENDER PROGRESS ROWS
    ===================================================== */

    function renderProgress() {

        progressList.innerHTML = "";

        progressData.forEach(function (item) {

            progressList.appendChild(
                createProgressRow(item)
            );

        });


        /* Animate fills in after render */

        requestAnimationFrame(function () {

            const fills =
                progressList.querySelectorAll(".progress-fill");

            fills.forEach(function (fill) {

                fill.style.width =
                    fill.dataset.value + "%";

            });

        });

    }


    /* =====================================================
       CREATE PROGRESS ROW
    ===================================================== */

    function createProgressRow(item) {

        const row =
            document.createElement("div");

        row.className = "progress-row";


        const header =
            document.createElement("div");

        header.className = "progress-row-header";


        const label =
            document.createElement("strong");

        label.textContent = item.label;


        const value =
            document.createElement("span");

        value.textContent = item.value + "%";


        header.appendChild(label);
        header.appendChild(value);


        const bar =
            document.createElement("div");

        bar.className = "progress-bar";


        const fill =
            document.createElement("div");

        fill.className = "progress-fill";

        fill.dataset.value = item.value;


        bar.appendChild(fill);


        row.appendChild(header);
        row.appendChild(bar);


        return row;

    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    renderProgress();

});