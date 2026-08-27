        function escapeJsString(str) {
            return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
        }
        window.addEventListener("load", function() {
            const screen = document.getElementById("startupScreen");
            const icon = document.getElementById("startupIcon");
            const title = document.getElementById("startupTitle");
            const subtitle = document.getElementById("startupSubtitle");
            const progress = document.getElementById("startupProgress");
            const progressBar = document.getElementById("startupProgressBar");
            const loading = document.getElementById("startupLoading");
            // Hiện icon
            setTimeout(() => {
                icon.classList.add("startup-show");
            }, 200);
            // Hiện tên phần mềm
            setTimeout(() => {
                title.classList.add("startup-show");
            }, 500);
            // Hiện dòng mô tả
            setTimeout(() => {
                subtitle.classList.add("startup-show");
            }, 750);
            // Hiện thanh loading
            setTimeout(() => {
                progress.classList.add("startup-show");
                loading.classList.add("startup-show");
            }, 1000);
            // Chạy thanh loading
            let percent = 0;
            const loadingInterval = setInterval(() => {
                percent += Math.random() * 10;
                if (percent >= 100) {
                    percent = 100;
                    clearInterval(loadingInterval);
                }
                progressBar.style.width = percent + "%";
            }, 100);
            // Sau khoảng 2 giây → biến mất
            setTimeout(() => {
                screen.classList.add("fade-out");
                // Xóa splash screen khỏi giao diện
                setTimeout(() => {
                    screen.remove();
                }, 1000);
            }, 3000);
        });