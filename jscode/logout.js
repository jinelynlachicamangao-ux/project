document.addEventListener("DOMContentLoaded", function () {

    const cancelBtn = document.getElementById("cancelLogoutBtn");
    const confirmBtn = document.getElementById("confirmLogoutBtn");


    cancelBtn.addEventListener("click", function () {

        window.location.href = "Dashboard.html";

    });


    confirmBtn.addEventListener("click", function () {

       
        localStorage.removeItem("3dProjectTasks");

        window.location.href = "../Pages/Homapage.html";

    });

});