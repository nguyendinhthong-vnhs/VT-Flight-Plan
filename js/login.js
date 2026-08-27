(function () {
    "use strict";
    const LOGIN_CONFIG = {
        // Mock account - CHỈ DÙNG TRONG GIAI ĐOẠN TEST
        username: "admin",
        password: "admin123",
        // LocalStorage keys
        storage: {
            session: "vt_fpl_session",
            remember: "vt_fpl_remember_login"
        }
    };
    let loginScreen;
    let loginForm;
    let usernameInput;
    let passwordInput;
    let rememberInput;
    let errorBox;
    let errorText;
    let submitButton;
    let submitIcon;
    let submitText;
    let togglePasswordButton;
    let togglePasswordIcon;
    let settingsButton;
    function initLogin() {
        loginScreen = document.getElementById("loginScreen");
        loginForm = document.getElementById("loginForm");
        usernameInput = document.getElementById("loginUsername");
        passwordInput = document.getElementById("loginPassword");
        rememberInput = document.getElementById("rememberLogin");
        errorBox = document.getElementById("loginError");
        errorText = document.getElementById("loginErrorText");
        submitButton = document.getElementById("loginSubmitBtn");
        submitIcon = document.getElementById("loginSubmitIcon");
        submitText = document.getElementById("loginSubmitText");
        togglePasswordButton = document.getElementById("togglePasswordBtn");
        togglePasswordIcon = document.getElementById("togglePasswordIcon");
        settingsButton = document.getElementById("loginSettingsBtn");
        if (!loginScreen || !loginForm) {
            console.error(
                "[Login] Không tìm thấy Login Screen."
            );
            return;
        }
        loginForm.addEventListener(
            "submit",
            handleLogin
        );
        if (togglePasswordButton) {
            togglePasswordButton.addEventListener(
                "click",
                togglePasswordVisibility
            );
        }
        if (settingsButton) {
            settingsButton.addEventListener(
                "click",
                openLoginSettings
            );
        }
        if (usernameInput) {
            usernameInput.addEventListener(
                "keydown",
                function (event) {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        passwordInput?.focus();
                    }
                }
            );
        }
        if (usernameInput) {
            usernameInput.addEventListener(
                "input",
                clearLoginError
            );
        }
        if (passwordInput) {
            passwordInput.addEventListener(
                "input",
                clearLoginError
            );
        }
        checkExistingSession();
    }
    function showLoginScreen() {
        if (!loginScreen) return;
        loginScreen.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
        setTimeout(function () {
            usernameInput?.focus();
        }, 100);
    }
    function hideLoginScreen() {
        if (!loginScreen) return;
        loginScreen.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
    }
    function handleLogin(event) {
        event.preventDefault();
        clearLoginError();
        const username =
            usernameInput.value.trim();
        const password =
            passwordInput.value;
        if (!username) {
            showLoginError(
                "Vui lòng nhập tài khoản."
            );
            usernameInput.focus();
            return;
        }
        if (!password) {
            showLoginError(
                "Vui lòng nhập mật khẩu."
            );
            passwordInput.focus();
            return;
        }
        setLoginLoading(true);
        setTimeout(function () {
            const authenticated =
                username === LOGIN_CONFIG.username &&
                password === LOGIN_CONFIG.password;
            if (!authenticated) {
                setLoginLoading(false);
                showLoginError(
                    "Tài khoản hoặc mật khẩu không đúng."
                );
                passwordInput.select();
                return;
            }
            const session = {
                authenticated: true,
                username: username,
                role: "admin",
                loginTime: new Date().toISOString()
            };
            saveSession(session);
            if (!rememberInput.checked) {
                localStorage.removeItem(
                    LOGIN_CONFIG.storage.remember
                );
            }
            setLoginLoading(false);
            loginScreen.style.transition =
                "opacity 250ms ease";
            loginScreen.style.opacity = "0";
            setTimeout(function () {
                hideLoginScreen();
                loginScreen.style.opacity = "1";
                if (typeof showToast === "function") {
                    showToast(
                        "Đăng nhập thành công.",
                        "success"
                    );
                }                
                document.dispatchEvent(
                    new CustomEvent(
                        "fpl:login",
                        {
                            detail: session
                        }
                    )
                );
            }, 250);
        }, 500);
    }
    function saveSession(session) {
        try {
            sessionStorage.setItem(
                LOGIN_CONFIG.storage.session,
                JSON.stringify(session)
            );
            if (rememberInput?.checked) {
                localStorage.setItem(
                    LOGIN_CONFIG.storage.remember,
                    JSON.stringify({
                        username: session.username
                    })
                );
            }
        } catch (error) {
            console.error(
                "[Login] Không thể lưu session:",
                error
            );
        }
    }
    function checkExistingSession() {
        try {
            const currentSession =
                sessionStorage.getItem(
                    LOGIN_CONFIG.storage.session
                );
            if (currentSession) {
                const session =
                    JSON.parse(currentSession);
                if (session.authenticated) {
                    hideLoginScreen();
                    return;
                }
            }
            const remembered =
                localStorage.getItem(
                    LOGIN_CONFIG.storage.remember
                );
            if (remembered) {
                const data =
                    JSON.parse(remembered);
                if (data.username) {
                    usernameInput.value =
                        data.username;
                    rememberInput.checked =
                        true;
                }
            }
            showLoginScreen();
        } catch (error) {
            console.error(
                "[Login] Lỗi kiểm tra session:",
                error
            );
            showLoginScreen();
        }
    }
    function togglePasswordVisibility() {
        if (!passwordInput) return;
        const isPassword =
            passwordInput.type === "password";
        passwordInput.type =
            isPassword
                ? "text"
                : "password";
        if (togglePasswordIcon) {
            togglePasswordIcon.className =
                isPassword
                    ? "fa-solid fa-eye-slash"
                    : "fa-solid fa-eye";
        }
    }
    function showLoginError(message) {
        if (!errorBox || !errorText) return;
        errorText.textContent = message;
        errorBox.classList.remove("hidden");
    }
    function clearLoginError() {
        if (!errorBox) return;
        errorBox.classList.add("hidden");
    }
    function setLoginLoading(isLoading) {
        if (!submitButton) return;
        submitButton.disabled =
            isLoading;
        if (isLoading) {
            submitButton.classList.add(
                "opacity-70",
                "cursor-not-allowed"
            );
            submitIcon.className =
                "fa-solid fa-spinner fa-spin";
            submitText.textContent =
                "ĐANG ĐĂNG NHẬP...";
        } else {
            submitButton.classList.remove(
                "opacity-70",
                "cursor-not-allowed"
            );
            submitIcon.className =
                "fa-solid fa-right-to-bracket";
            submitText.textContent =
                "ĐĂNG NHẬP";
        }
    }
    function openLoginSettings() {
        if (typeof showToast === "function") {
            showToast(
                "Settings sẽ được triển khai ở bước tiếp theo.",
                "info"
            );
        } else {
            console.info(
                "[Login] Settings chưa được triển khai."
            );
        }
    }
    window.LoginSystem = {
        login: handleLogin,        
        show: showLoginScreen,
        hide: hideLoginScreen,
        isAuthenticated: function () {
            try {
                const session =
                    sessionStorage.getItem(
                        LOGIN_CONFIG.storage.session
                    );
                if (!session) return false;
                const data =
                    JSON.parse(session);
                return data.authenticated === true;
            } catch (error) {
                return false;
            }
        },
        getCurrentUser: function () {
            try {
                const session =
                    sessionStorage.getItem(
                        LOGIN_CONFIG.storage.session
                    );
                if (!session) return null;
                return JSON.parse(session);
            } catch (error) {
                return null;
            }
        }
    };
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initLogin
        );
    } else {
        initLogin();
    }
})();