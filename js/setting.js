// ============================================================
// SETTINGS SYSTEM
// Vung Tau Flight Plan Management
// ============================================================


// ============================================================
// STORAGE KEY
// ============================================================

const SETTINGS_STORAGE_KEY =
    "vungtau_flightplan_settings";


// ============================================================
// DEFAULT SETTINGS
// ============================================================

const DEFAULT_SETTINGS = {

    general: {
        displayName: "VŨNG TÀU FLIGHT PLAN MANAGEMENT"
    },

    map: {
        type: "draw"
    },

    display: {

    },

    system: {

    }

};


// ============================================================
// SETTINGS STATE
// ============================================================

let appSettings = loadSettings();


// ============================================================
// LOAD SETTINGS
// ============================================================

function loadSettings() {

    try {

        const saved =
            localStorage.getItem(
                SETTINGS_STORAGE_KEY
            );


        if (!saved) {

            return JSON.parse(
                JSON.stringify(DEFAULT_SETTINGS)
            );

        }


        return {

            ...DEFAULT_SETTINGS,

            ...JSON.parse(saved)

        };

    }

    catch (error) {

        console.error(
            "Không thể tải Settings:",
            error
        );


        return JSON.parse(
            JSON.stringify(DEFAULT_SETTINGS)
        );

    }

}


// ============================================================
// OPEN SETTINGS
// ============================================================

function openSettingsModal() {

    const modal =
        document.getElementById(
            "settingsModal"
        );


    if (!modal) {

        console.error(
            "Không tìm thấy settingsModal"
        );

        return;

    }


    modal.classList.remove(
        "hidden"
    );


    modal.classList.add(
        "flex"
    );


    renderSettings();


    switchSettingsTab(
        "general"
    );

}


// ============================================================
// CLOSE SETTINGS
// ============================================================

function closeSettingsModal() {

    const modal =
        document.getElementById(
            "settingsModal"
        );


    if (!modal) return;


    modal.classList.add(
        "hidden"
    );


    modal.classList.remove(
        "flex"
    );

}


// ============================================================
// SWITCH TAB
// ============================================================

function switchSettingsTab(tabName) {

    // Ẩn tất cả content
    document
        .querySelectorAll(
            ".settings-content"
        )
        .forEach(tab => {

            tab.classList.add(
                "hidden"
            );

        });


    // Xóa trạng thái active
    document
        .querySelectorAll(
            ".settings-tab"
        )
        .forEach(button => {

            button.classList.remove(
                "bg-brand-600",
                "text-white"
            );
            button.classList.add(
                "text-slate-400",
                "hover:bg-slate-800"
            );
        });
    const activeContent =
        document.getElementById(
            `settingsTab-${tabName}`
        );
    if (activeContent) {
        activeContent.classList.remove(
            "hidden"
        );
    }
    const activeButton =
        document.querySelector(
            `[data-tab="${tabName}"]`
        );
    if (activeButton) {
        activeButton.classList.add(
            "bg-brand-600",
            "text-white"
        );
        activeButton.classList.remove(
            "text-slate-400",
            "hover:bg-slate-800"
        );
    }
}
function selectMapType(mapType) {
    appSettings.map.type =
        mapType;
    document
        .querySelectorAll(
            ".map-type-option"
        )
        .forEach(button => {
            button.classList.remove(
                "border-brand-500",
                "bg-brand-500/10",
                "text-brand-400"
            );
            button.classList.add(
                "border-slate-700",
                "bg-slate-900",
                "text-slate-300"
            );
        });
    const selected =
        document.querySelector(
            `[data-map="${mapType}"]`
        );
    if (selected) {

        selected.classList.add(
            "border-brand-500",
            "bg-brand-500/10",
            "text-brand-400"
        );


        selected.classList.remove(
            "border-slate-700",
            "bg-slate-900",
            "text-slate-300"
        );

    }


    console.log(
        "Map type selected:",
        mapType
    );

}
function renderSettings() {
    // Display Name
    const displayName =
        document.getElementById(
            "settingDisplayName"
        );
    if (displayName) {
        displayName.value =
            appSettings.general.displayName || "";
    }
    selectMapType(
        appSettings.map.type
    );
}
function saveSettings() {
    const displayName =
        document.getElementById(
            "settingDisplayName"
        );
    if (displayName) {
        appSettings.general.displayName =
            displayName.value.trim();
    }
    try {
        localStorage.setItem(
            SETTINGS_STORAGE_KEY,
            JSON.stringify(appSettings)
        );
        console.log(
            "Settings saved:",
            appSettings
        );
        if (
            typeof showToast === "function"
        ) {
            showToast(
                "Đã lưu cài đặt",
                "success"
            );
        }
        else {
            alert(
                "Đã lưu cài đặt"
            );
        }
    }
    catch (error) {
        console.error(
            "Không thể lưu Settings:",
            error
        );
    }
}
function resetSettings() {
    appSettings =
        JSON.parse(
            JSON.stringify(DEFAULT_SETTINGS)
        );
    renderSettings();
    localStorage.removeItem(
        SETTINGS_STORAGE_KEY
    );
    console.log(
        "Settings reset"
    );
}
window.openSettingsModal =
    openSettingsModal;

window.closeSettingsModal =
    closeSettingsModal;

window.switchSettingsTab =
    switchSettingsTab;

window.selectMapType =
    selectMapType;

window.saveSettings =
    saveSettings;

window.resetSettings =
    resetSettings;

window.Settings = {

    open: openSettingsModal,

    close: closeSettingsModal,

    get: () => appSettings

};