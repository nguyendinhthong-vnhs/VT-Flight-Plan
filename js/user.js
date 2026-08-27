// ============================================================
// USER ACCOUNT MENU
// VUNG TAU FLIGHT PLAN MANAGEMENT
// ============================================================


// ============================================================
// ELEMENTS
// ============================================================

function getUserMenuPopup() {
    return document.getElementById("userMenuPopup");
}


// ============================================================
// TOGGLE USER MENU
// ============================================================

function toggleUserMenu(event) {

    event.stopPropagation();

    const popup =
        getUserMenuPopup();

    if (!popup) return;

    const isHidden =
        popup.classList.contains("hidden");

    if (isHidden) {

        openUserMenu();

    } else {

        closeUserMenu();

    }

}


// ============================================================
// OPEN
// ============================================================

function openUserMenu() {

    const popup =
        getUserMenuPopup();

    if (!popup) return;

    popup.classList.remove("hidden");

}


// ============================================================
// CLOSE
// ============================================================

function closeUserMenu() {

    const popup =
        getUserMenuPopup();

    if (!popup) return;

    popup.classList.add("hidden");

}


// ============================================================
// CLICK OUTSIDE
// ============================================================

document.addEventListener("click", function(event) {

    const wrapper =
        document.getElementById("userMenuWrapper");

    const popup =
        document.getElementById("userMenuPopup");

    if (!wrapper || !popup) return;

    if (!wrapper.contains(event.target)) {

        closeUserMenu();

    }

});


// ============================================================
// ESC KEY
// ============================================================

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeUserMenu();

    }

});


// ============================================================
// SET USERNAME
// ============================================================

function setHeaderUsername(username) {

    username =
        username || "User";


    const headerUsername =
        document.getElementById("headerUsername");

    const popupUsername =
        document.getElementById("popupUsername");


    if (headerUsername) {

        headerUsername.textContent =
            username;

    }


    if (popupUsername) {

        popupUsername.textContent =
            username;

    }

}


// ============================================================
// USER INFO
// ============================================================

function openUserInfo() {

    closeUserMenu();

    console.log("Open user information");

    // Tạm thời
    // Sau này mở User Information Modal

}


// ============================================================
// CHANGE PASSWORD
// ============================================================

function openChangePassword() {

    closeUserMenu();

    console.log("Open change password");

    // Tạm thời
    // Sau này mở Change Password Modal

}
function logoutUser() {

    closeUserMenu();


    // --------------------------------------------------------
    // 1. Reset form hiện tại
    // --------------------------------------------------------

    if (typeof resetForm === "function") {

        try {

            resetForm();

        } catch (error) {

            console.warn(
                "Không thể reset form:",
                error
            );

        }

    }


    // --------------------------------------------------------
    // 2. XÓA SESSION ĐĂNG NHẬP
    // --------------------------------------------------------

    sessionStorage.removeItem(
        "vt_fpl_session"
    );


    // --------------------------------------------------------
    // 3. Xóa thông tin user cũ nếu có
    // --------------------------------------------------------

    localStorage.removeItem(
        "currentUser"
    );

    sessionStorage.removeItem(
        "currentUser"
    );


    // --------------------------------------------------------
    // 4. Reload toàn bộ application
    // --------------------------------------------------------

    window.location.reload();

}
// ============================================================
// PUBLIC API
// ============================================================

window.toggleUserMenu =
    toggleUserMenu;

window.openUserMenu =
    openUserMenu;

window.closeUserMenu =
    closeUserMenu;

window.setHeaderUsername =
    setHeaderUsername;

window.openUserInfo =
    openUserInfo;

window.openChangePassword =
    openChangePassword;

window.logoutUser =
    logoutUser;