document.addEventListener("DOMContentLoaded", function () {

    const STORAGE_KEY = "3dUserSettings";

    const settingsForm = document.getElementById("settingsForm");
    const saveStatus = document.getElementById("saveStatus");
    const viewProfileBtn = document.getElementById("viewProfileBtn");

    const emailInput = document.getElementById("emailInput");
    const nameInput = document.getElementById("nameInput");
    const displayNameInput = document.getElementById("displayNameInput");
    const jobTitleInput = document.getElementById("jobTitleInput");
    const phoneInput = document.getElementById("phoneInput");
    const timezoneInput = document.getElementById("timezoneInput");
    const genderInput = document.getElementById("genderInput");
    const dobInput = document.getElementById("dobInput");

    const emailToggle = document.getElementById("emailToggle");
    const reminderToggle = document.getElementById("reminderToggle");
    const summaryToggle = document.getElementById("summaryToggle");

    const currentPasswordInput = document.getElementById("currentPasswordInput");
    const newPasswordInput = document.getElementById("newPasswordInput");
    const confirmPasswordInput = document.getElementById("confirmPasswordInput");
    const passwordMessage = document.getElementById("passwordMessage");

    const themeOptions = document.querySelectorAll(".theme-option");
    const deleteAccountBtn = document.getElementById("deleteAccountBtn");

    const avatarInput = document.getElementById("avatarInput");
    const avatarPreview = document.getElementById("avatarPreview");
    const removeAvatarBtn = document.getElementById("removeAvatarBtn");

    const coverInput = document.getElementById("coverInput");
    const coverPreview = document.getElementById("coverPreview");
    const removeCoverBtn = document.getElementById("removeCoverBtn");

    const navLinks = document.querySelectorAll(".settings-nav .nav-link");
    const sections = document.querySelectorAll(".settings-card[id]");


    /* =====================================================
       THEME PICKER
       (relies on window.ThreeDTheme from theme.js)
    ===================================================== */

    function highlightActiveTheme() {

        const current =
            window.ThreeDTheme ? window.ThreeDTheme.get() : "dark";

        themeOptions.forEach(function (option) {

            option.classList.toggle(
                "active",
                option.dataset.themeValue === current
            );

        });

    }

    themeOptions.forEach(function (option) {

        option.addEventListener("click", function () {

            const value = option.dataset.themeValue;

            if (window.ThreeDTheme) {

                window.ThreeDTheme.set(value);

            }

            highlightActiveTheme();

        });

    });

    highlightActiveTheme();


    /* =====================================================
       SUB-NAV: smooth scroll + scroll-spy
    ===================================================== */

    navLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            const target = document.getElementById(link.dataset.target);

            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }

        });

    });

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(function (entries) {

            entries.forEach(function (entry) {

                if (!entry.isIntersecting) return;

                navLinks.forEach(function (link) {

                    link.classList.toggle(
                        "active",
                        link.dataset.target === entry.target.id
                    );

                });

            });

        }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });

        sections.forEach(function (section) {
            observer.observe(section);
        });

    }


    /* =====================================================
       PHOTO / COVER UPLOAD
    ===================================================== */

    function readFileAsDataUrl(file, callback) {

        const reader = new FileReader();

        reader.onload = function () {
            callback(reader.result);
        };

        reader.readAsDataURL(file);

    }

    function setPreviewImage(previewEl, dataUrl) {

        if (dataUrl) {
            previewEl.style.backgroundImage = "url(" + dataUrl + ")";
            previewEl.classList.add("has-image");
        } else {
            previewEl.style.backgroundImage = "";
            previewEl.classList.remove("has-image");
        }

    }

    avatarInput.addEventListener("change", function () {

        const file = avatarInput.files[0];
        if (!file) return;

        readFileAsDataUrl(file, function (dataUrl) {
            settings.avatarDataUrl = dataUrl;
            setPreviewImage(avatarPreview, dataUrl);
        });

    });

    removeAvatarBtn.addEventListener("click", function () {

        settings.avatarDataUrl = "";
        avatarInput.value = "";
        setPreviewImage(avatarPreview, "");

    });

    coverInput.addEventListener("change", function () {

        const file = coverInput.files[0];
        if (!file) return;

        readFileAsDataUrl(file, function (dataUrl) {
            settings.coverDataUrl = dataUrl;
            setPreviewImage(coverPreview, dataUrl);
        });

    });

    removeCoverBtn.addEventListener("click", function () {

        settings.coverDataUrl = "";
        coverInput.value = "";
        setPreviewImage(coverPreview, "");

    });


    /* =====================================================
       PROFILE / NOTIFICATION SETTINGS
    ===================================================== */

    const defaultSettings = {
        name: "",
        displayName: "",
        email: "",
        jobTitle: "",
        phone: "",
        timezone: "Asia/Manila",
        gender: "",
        dob: "",
        avatarDataUrl: "",
        coverDataUrl: "",
        emailNotifications: true,
        deadlineReminders: true,
        weeklySummary: false
    };


    let settings =
        Object.assign({}, defaultSettings, JSON.parse(localStorage.getItem(STORAGE_KEY)) || {});


    function applyToForm() {

        nameInput.value = settings.name;
        displayNameInput.value = settings.displayName;
        emailInput.value = settings.email;
        jobTitleInput.value = settings.jobTitle;
        phoneInput.value = settings.phone;
        timezoneInput.value = settings.timezone || defaultSettings.timezone;
        genderInput.value = settings.gender;
        dobInput.value = settings.dob;

        emailToggle.checked = settings.emailNotifications;
        reminderToggle.checked = settings.deadlineReminders;
        summaryToggle.checked = settings.weeklySummary;

        setPreviewImage(avatarPreview, settings.avatarDataUrl);
        setPreviewImage(coverPreview, settings.coverDataUrl);

    }


    settingsForm.addEventListener("submit", function (event) {

        event.preventDefault();


        /* Validate password fields only if the user is trying to change it */

        const wantsPasswordChange =
            currentPasswordInput.value ||
            newPasswordInput.value ||
            confirmPasswordInput.value;

        if (wantsPasswordChange) {

            if (!currentPasswordInput.value) {

                showPasswordMessage("Enter your current password.", "error");
                return;

            }

            if (newPasswordInput.value.length < 8) {

                showPasswordMessage("New password must be at least 8 characters.", "error");
                return;

            }

            if (newPasswordInput.value !== confirmPasswordInput.value) {

                showPasswordMessage("New passwords do not match.", "error");
                return;

            }

            showPasswordMessage("Password updated.", "success");

            currentPasswordInput.value = "";
            newPasswordInput.value = "";
            confirmPasswordInput.value = "";

        }


        settings = Object.assign({}, settings, {
            name: nameInput.value.trim(),
            displayName: displayNameInput.value.trim(),
            jobTitle: jobTitleInput.value.trim(),
            phone: phoneInput.value.trim(),
            timezone: timezoneInput.value,
            gender: genderInput.value,
            dob: dobInput.value,
            emailNotifications: emailToggle.checked,
            deadlineReminders: reminderToggle.checked,
            weeklySummary: summaryToggle.checked
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

        saveStatus.classList.add("show");

        setTimeout(function () {
            saveStatus.classList.remove("show");
        }, 2000);

    });

    if (viewProfileBtn) {

        viewProfileBtn.addEventListener("click", function () {
            window.location.href = "../Profile.html";
        });

    }


    function showPasswordMessage(text, type) {

        passwordMessage.textContent = text;
        passwordMessage.className = "field-message " + type;

    }


    /* =====================================================
       DANGER ZONE
    ===================================================== */

    deleteAccountBtn.addEventListener("click", function () {

        const confirmed = window.confirm(
            "This will permanently delete your account and all project data. This cannot be undone. Continue?"
        );

        if (!confirmed) {
            return;
        }

        // Clear all locally-stored app data.
        // Adjust this list if you add real authentication/back-end storage later.

        localStorage.clear();

        window.location.href = "../Homapage.html";

    });


    applyToForm();

});