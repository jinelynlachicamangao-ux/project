/* =========================================================
   SHARED USER HELPER  (3D Project Management)
   Single source of truth: localStorage key "3dUserSettings"
   (the same key settings.js already uses)
   Load this file BEFORE dashboard.js / profile.js.
========================================================= */

(function () {

    var KEY = "3dUserSettings";

    function read() {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || {};
        } catch (e) {
            return {};
        }
    }

    function write(data) {
        try {
            localStorage.setItem(KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            return false;   /* storage full (e.g. very large image) */
        }
    }

    function cap(text) {
        return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
    }

    function splitName(full) {
        var parts = (full || "").trim().split(/\s+/).filter(Boolean);
        return {
            first: parts[0] || "",
            last: parts.length > 1 ? parts[parts.length - 1] : ""
        };
    }

    function nameFromEmail(email) {
        var local = (email || "").split("@")[0];
        return local
            .replace(/[0-9]+/g, "")
            .split(/[._\-+]+/)
            .filter(Boolean)
            .map(cap)
            .join(" ");
    }

    /* ---------- read the current user ---------- */

    function get() {

        var s = read();
        var first = "";
        var last = "";

        if (s.firstName && s.lastName &&
            (s.firstName + " " + s.lastName) === s.name) {
            first = s.firstName;
            last = s.lastName;
        } else {
            var sp = splitName(s.name);
            first = sp.first;
            last = sp.last;
        }

        if (!first && !last && s.email) {
            var fromEmail = splitName(nameFromEmail(s.email));
            first = fromEmail.first;
            last = fromEmail.last;
        }

        var fullName = [first, last].filter(Boolean).join(" ");

        var initials = (first.charAt(0) + last.charAt(0)).toUpperCase();

        if (!initials) {
            initials = s.email ? s.email.charAt(0).toUpperCase() : "?";
        }

        return {
            first: first,
            last: last,
            fullName: fullName || "Guest",
            displayName: s.displayName || first || "there",
            initials: initials,
            email: s.email || "",
            jobTitle: s.jobTitle || "",
            phone: s.phone || "",
            timezone: s.timezone || "Asia/Manila",
            gender: s.gender || "",
            dob: s.dob || "",
            bio: s.bio || "",
            joinedAt: s.joinedAt || "",
            photo: s.avatarDataUrl || "",
            cover: s.coverDataUrl || ""
        };
    }

    /* ---------- create a brand-new account profile ---------- */

    function register(data) {

        var first = (data.firstName || "").trim();
        var last = (data.lastName || "").trim();

        var dob = "";
        var match = (data.birthday || "")
            .trim()
            .match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

        if (match) {
            dob = match[3] + "-" +
                match[1].padStart(2, "0") + "-" +
                match[2].padStart(2, "0");
        }

        write({
            firstName: first,
            lastName: last,
            name: [first, last].filter(Boolean).join(" "),
            displayName: first,
            email: (data.email || "").trim(),
            jobTitle: "",
            phone: "",
            timezone: "Asia/Manila",
            gender: "",
            dob: dob,
            bio: "",
            joinedAt: new Date().toISOString(),
            avatarDataUrl: "",
            coverDataUrl: "",
            emailNotifications: true,
            deadlineReminders: true,
            weeklySummary: false
        });
    }

    /* ---------- login: keep the profile if it is the same email ---------- */

    function signIn(email) {

        var s = read();
        email = (email || "").trim();

        if (s.email && s.email.toLowerCase() === email.toLowerCase()) {
            return;
        }

        var sp = splitName(nameFromEmail(email));

        register({
            firstName: sp.first,
            lastName: sp.last,
            email: email
        });
    }

    /* ---------- update fields ---------- */

    function update(patch) {

        var s = Object.assign({}, read(), patch);

        if (patch.firstName !== undefined || patch.lastName !== undefined) {
            s.name = [s.firstName, s.lastName].filter(Boolean).join(" ");
        }

        if (!s.joinedAt) {
            s.joinedAt = new Date().toISOString();
        }

        return write(s);
    }

    /* ---------- show initials (or uploaded photo) inside an element ---------- */

    function renderAvatar(el, user) {

        if (!el) return;

        user = user || get();

        if (user.photo) {
            el.textContent = "";
            el.style.backgroundImage = "url(" + user.photo + ")";
            el.style.backgroundSize = "cover";
            el.style.backgroundPosition = "center";
        } else {
            el.textContent = user.initials;
            el.style.backgroundImage = "";
        }
    }

    window.ThreeDUser = {
        get: get,
        update: update,
        register: register,
        signIn: signIn,
        renderAvatar: renderAvatar
    };

})();