

(function () {

    var STORAGE_KEY = "3dThemePreference";
    var root = document.documentElement;
    var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function getStoredPreference() {

        var stored = localStorage.getItem(STORAGE_KEY);

        if (stored === "light" || stored === "dark" || stored === "system") {
            return stored;
        }

        return "system";

    }

    function resolve(preference) {

        if (preference === "system") {
            return mediaQuery.matches ? "dark" : "light";
        }

        return preference;

    }

    function apply(preference) {

        root.setAttribute("data-theme", resolve(preference));
        root.setAttribute("data-theme-preference", preference);

    }

    function set(preference) {

        if (preference !== "light" && preference !== "dark" && preference !== "system") {
            return;
        }

        localStorage.setItem(STORAGE_KEY, preference);
        apply(preference);

    }

    function get() {
        return getStoredPreference();
    }

    function getEffective() {
        return resolve(getStoredPreference());
    }

    /* Apply immediately, before first paint of dependent stylesheets */
    apply(getStoredPreference());

    /* Live-update if the OS theme changes while "system" is selected */
    mediaQuery.addEventListener("change", function () {

        if (getStoredPreference() === "system") {
            apply("system");
        }

    });

    window.ThreeDTheme = {
        get: get,
        set: set,
        getEffective: getEffective
    };

})();