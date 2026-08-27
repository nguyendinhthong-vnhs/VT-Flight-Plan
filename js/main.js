        // Load custom fleet from local storage or default
        let aircraftData = JSON.parse(localStorage.getItem('icaoAircraftData')) || defaultAircraftData;
        // Khai báo biến cờ
        let isEETManuallyEdited = false;
        // Gán sự kiện khi người dùng gõ/sửa ô EET
        document.getElementById("eet").addEventListener("input", function() {
            isEETManuallyEdited = true; // Bật cờ đánh dấu đã sửa tay
            const autoEetBadge = document.getElementById("autoEetBadge");
            if (autoEetBadge) autoEetBadge.classList.add("hidden");
        });
        // Reset cờ về false khi chọn lại Sân bay đi hoặc Sân bay đến
        document.getElementById("dep").addEventListener("change", () => {
            isEETManuallyEdited = false;
        });
        document.getElementById("dest").addEventListener("change", () => {
            isEETManuallyEdited = false;
        });
        
        
        
        
        let plans = JSON.parse(localStorage.getItem("icaoPlans")) || [];
        let confirmResolver = null;
        // INITIALIZATION
        window.onload = function() {
            populateDataLists();
            setupEventListeners();
            setCurrentTimeUTC();
            updateLivePreview();
            renderPlans();
            updateSavedCount();
            renderPointTable(waypointDatabase);
            renderPointTable2(waypointDatabase2);
        };
        
        
        // HÀM XỬ LÝ HIỂN THỊ CHO BẢNG TRÊN BÊN TRÁI
        // 13. Hàm vẽ bảng tra cứu tọa độ bên trái trên (Hiển thị đầy đủ Latitude & Longitude dạng Độ, Phút)
        function renderPointTable(data) {
            const tbody = document.getElementById('pointTableBody');
            if (!tbody) return;
            tbody.innerHTML = '';
            for (const [code, info] of Object.entries(data)) {
                let row = document.createElement('tr');
                // 2.Xử lý chuyển đổi lat/lon số sang định dạng Độ, Phút
                let latDisplay = "";
                let lonDisplay = "";
                if (typeof info.lat === 'number' && typeof info.lon === 'number') {
                    latDisplay = formatCoordinate(info.lat, true);
                    lonDisplay = formatCoordinate(info.lon, false);
                } else if (typeof info.lat === 'string') {
                    // Phòng hờ nếu còn sót dữ liệu dạng chuỗi cũ
                    latDisplay = info.lat;
                    lonDisplay = info.lon || "";
                }
                row.innerHTML = `
                <td class="px-3 py-2 text-xs font-bold text-white">${code}</td>
                <td class="px-3 py-2 text-xs text-slate-300">${info.name || ''}</td>
                <td class="px-3 py-2 text-xs text-brand-300 font-mono">
                    <div>Lat: ${latDisplay}</div>
                    <div>Lon: ${lonDisplay}</div>
                </td>
                <td class="px-3 py-2 text-xs text-right">
                    <button onclick="addPointToRoute('${code}')" class="px-2 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded text-[10px] transition">
                        Add
                    </button>
                </td>
            `;
                tbody.appendChild(row);
            }
        }
        // 14. Hàm tìm kiếm điểm theo thời gian thực khi gõ phím
        function filterPoints() {
            const keyword = document.getElementById('searchPointInput').value.toUpperCase().trim();
            const typeFilterElem = document.getElementById('typeFilter');
            const selectedType = typeFilterElem ? typeFilterElem.value.toUpperCase().trim() : "";
            let filtered = {};
            for (const [code, info] of Object.entries(waypointDatabase)) {
                const nameStr = info.name ? info.name.toUpperCase() : "";
                const matchesKeyword = code.toUpperCase().includes(keyword) || nameStr.includes(keyword);
                const infoType = info.type ? info.type.toUpperCase().trim() : "";
                const matchesType = (selectedType === "" || selectedType === "ALL" || infoType === selectedType);
                if (matchesKeyword && matchesType) {
                    filtered[code] = info;
                }
            }
            renderPointTable(filtered);
        }
        // 15A. HÀM XỬ LÝ HIỂN THỊ CHO BẢNG DƯỚI BÊN TRÁI
        // 15A.1.Hàm điều khiển nút Add
        let selectedPointForAdd = "";

        function openPointAddMenu(pointName, button) {
            selectedPointForAdd = pointName;
            const menu = document.getElementById("pointAddMenu");
            if (!menu) return;
            menu.classList.remove("hidden");
            const rect = button.getBoundingClientRect();
            menu.style.left = rect.left + "px";
            menu.style.top = (rect.bottom + 5) + "px";
        }
        // 15A.2.Hàm chọn tính năng item 15 hay 18
        function selectPointDestination(destination) {
            const menu1 = document.getElementById("pointAddMenu");
            // Nếu chọn Item 15
            if (destination === "item15") {
                if (menu1) {
                    menu1.classList.add("hidden");
                }
                addPointToRoute(selectedPointForAdd);
                return;
            }
            // Nếu chọn Item 18
            if (destination === "item18") {
                const menu2 = document.getElementById("item18PointMenu");
                if (!menu1 || !menu2) return;
                // 1. LẤY VỊ TRÍ BẢNG CẤP 1 TRƯỚC
                const rect = menu1.getBoundingClientRect();
                // 2. ĐẶT BẢNG CẤP 2 NGAY TẠI VỊ TRÍ BẢNG CẤP 1
                menu2.style.left = `${rect.left}px`;
                menu2.style.top = `${rect.top}px`;
                // 3. HIỆN BẢNG CẤP 2
                menu2.classList.remove("hidden");
                // 4. SAU CÙNG MỚI ĐÓNG BẢNG CẤP 1
                menu1.classList.add("hidden");
            }
        }
        // 15A.3.Click ra ngoài thì đóng cả menu cấp 1 và cấp 2
        document.addEventListener("click", function(event) {
            const menu1 = document.getElementById("pointAddMenu");
            const menu2 = document.getElementById("item18PointMenu");
            // Nếu click vào nút ADD thì không đóng menu
            if (event.target.closest('button[onclick^="openPointAddMenu"]')) {
                return;
            }
            // Nếu click bên trong menu cấp 1 → không đóng
            if (menu1 && menu1.contains(event.target)) {
                return;
            }
            // Nếu click bên trong menu cấp 2 → không đóng
            if (menu2 && menu2.contains(event.target)) {
                return;
            }
            // Nếu click ra ngoài → đóng cả hai menu
            if (menu1) {
                menu1.classList.add("hidden");
            }
            if (menu2) {
                menu2.classList.add("hidden");
            }
        });
        // 15A.4.Hàm mở bảng item 18
        function selectItem18PointType(fieldType) {
            const menu =
                document.getElementById("item18PointMenu");
            if (menu) {
                menu.classList.add("hidden");
            }
            addPointToItem18(
                selectedPointForAdd,
                fieldType
            );
        }
        // 15. Hàm vẽ bảng tra cứu tọa độ bên trái trên (Hiển thị đầy đủ Latitude & Longitude dạng Độ, Phút)
        function renderPointTable2(data) {
            const tbody = document.getElementById('pointTableBody2'); // Hoặc id của tbody trong bảng
            if (!tbody) return;
            tbody.innerHTML = '';
            for (const [code, info] of Object.entries(data)) {
                let row = document.createElement('tr');
                // 15.1.Xử lý chuyển đổi lat/lon số sang định dạng Độ, Phút
                let latDisplay = "";
                let lonDisplay = "";
                if (typeof info.lat === 'number' && typeof info.lon === 'number') {
                    latDisplay = formatCoordinate(info.lat, true);
                    lonDisplay = formatCoordinate(info.lon, false);
                } else if (typeof info.lat === 'string') {
                    // Phòng hờ nếu còn sót dữ liệu dạng chuỗi cũ
                    latDisplay = info.lat;
                    lonDisplay = info.lon || "";
                }
                row.innerHTML = `
                <td class="px-3 py-2 text-xs font-bold text-white">${code}</td>
                <td class="px-3 py-2 text-xs text-slate-300">${info.name || ''}</td>
                <td class="px-3 py-2 text-xs text-brand-300 font-mono">
                    <div>Lat: ${latDisplay}</div>
                    <div>Lon: ${lonDisplay}</div>
                </td>
                <td class="px-3 py-2 text-xs text-right">
                   <button onclick="openPointAddMenu('${code}', this)" class="px-2 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded text-[10px] transition"> 
                   Add
                </button>
                </td>
            `;
                tbody.appendChild(row);
            }
        }
        // 16. Hàm tìm kiếm điểm theo thời gian thực khi gõ phím
        function filterPoints2() {
            const keyword = document.getElementById('searchPointInput2').value.toUpperCase().trim();
            const typeFilterElem = document.getElementById('typeFilter2');
            const selectedType = typeFilterElem ? typeFilterElem.value.toUpperCase().trim() : "";
            let filtered = {};
            for (const [code, info] of Object.entries(waypointDatabase2)) {
                const nameStr = info.name ? info.name.toUpperCase() : "";
                const matchesKeyword = code.toUpperCase().includes(keyword) || nameStr.includes(keyword);
                const infoType = info.type ? info.type.toUpperCase().trim() : "";
                const matchesType = (selectedType === "" || selectedType === "ALL" || infoType === selectedType);
                if (matchesKeyword && matchesType) {
                    filtered[code] = info;
                }
            }
            renderPointTable2(filtered);
        }
        // 17. Hàm tối ưu việc thêm điểm vào trường Route (Item 15)
        function addPointToRoute(pointName) {
            const routeInput =
                document.getElementById('route') ||
                document.querySelector('textarea#route') ||
                document.querySelector('input[name="route"]');
            if (routeInput) {
                let currentVal = routeInput.value.trim();
                // XÁC ĐỊNH GIÁ TRỊ CẦN THÊM
                // 17.1. Ưu tiên waypointDatabase
                let pointToAdd = pointName;
                // 17.2. Kiểm tra waypointDatabase trước
                if (waypointDatabase[pointName]) {
                    pointToAdd = pointName;
                }
                // 17.3. Nếu không có trong waypointDatabase
                else if (waypointDatabase2[pointName]) {
                    const info = waypointDatabase2[pointName];
                    // Có tọa độ hợp lệ
                    if (
                        typeof info.lat === "number" &&
                        typeof info.lon === "number"
                    ) {
                        // CHUYỂN VĨ ĐỘ
                        const latAbs = Math.abs(info.lat);
                        const latDeg = Math.floor(latAbs);
                        const latMin =
                            Math.floor((latAbs - latDeg) * 60);
                        const latDir =
                            info.lat >= 0 ? "N" : "S";
                        // CHUYỂN KINH ĐỘ
                        const lonAbs = Math.abs(info.lon);
                        const lonDeg = Math.floor(lonAbs);
                        const lonMin =
                            Math.floor((lonAbs - lonDeg) * 60);
                        const lonDir =
                            info.lon >= 0 ? "E" : "W";
                        const latStr =
                            String(latDeg).padStart(2, "0") +
                            String(latMin).padStart(2, "0") +
                            latDir;
                        const lonStr =
                            String(lonDeg).padStart(3, "0") +
                            String(lonMin).padStart(2, "0") +
                            lonDir;
                        pointToAdd = latStr + lonStr;
                    }
                }
                let textToAdd = "";
                if (currentVal === "") {
                    textToAdd = `DCT ${pointToAdd}`;
                } else if (
                    currentVal.endsWith("DCT") ||
                    currentVal.endsWith("dct")
                ) {
                    textToAdd = `${pointToAdd}`;
                } else {
                    textToAdd = `DCT ${pointToAdd}`;
                }
                // 17.4. Đưa vào ô route
                if (currentVal === "") {
                    routeInput.value = textToAdd;
                } else {
                    routeInput.value =
                        currentVal + " " + textToAdd;
                }
                // 17.5. Kích hoạt cập nhật
                routeInput.dispatchEvent(
                    new Event('input')
                );
            } else {
                alert("Không tìm thấy ô nhập trường Route trên giao diện!");
            }
        }
        // 18. Hàm cập nhật giao diện
        function updateRouteDistanceUI() {
            // Lấy giá trị từ các trường trên form FPL
            const dep = document.getElementById('depAirport') ? document.getElementById('depAirport').value : "VVVT";
            const dest = document.getElementById('destAirport') ? document.getElementById('destAirport').value : "VVTS";
            const route = document.getElementById('route') ? document.getElementById('route').value : "";
            // Tính toán khoảng cách
            let result = calculateTotalRouteDistance(dep, route, dest);
            // Hiển thị kết quả ra thẻ hiển thị trên giao diện (Ví dụ: id="distanceDisplay")
            const distanceElement = document.getElementById('distanceDisplay');
            if (distanceElement) {
                distanceElement.innerText = `${result.total} NM`;
            }
            // In ra console để kiểm tra chi tiết từng chặng
            console.log("Chi tiết các chặng:", result.segments);
        }
        // 18a. HÀM XỬ LÝ HIỂN THỊ VIỆC THÊM VÀO ITEM18
        // 18.1 Hàm tạo tọa độ
        function getPointCoordinate(pointName) {
            if (waypointDatabase[pointName]) {
                return pointName;
            }
            if (waypointDatabase2[pointName]) {
                const info = waypointDatabase2[pointName];
                if (
                    typeof info.lat === "number" &&
                    typeof info.lon === "number"
                ) {
                    const latAbs = Math.abs(info.lat);
                    const latDeg = Math.floor(latAbs);
                    const latMin = Math.floor((latAbs - latDeg) * 60);
                    const latDir = info.lat >= 0 ? "N" : "S";
                    const lonAbs = Math.abs(info.lon);
                    const lonDeg = Math.floor(lonAbs);
                    const lonMin = Math.floor((lonAbs - lonDeg) * 60);
                    const lonDir = info.lon >= 0 ? "E" : "W";
                    const latStr =
                        String(latDeg).padStart(2, "0") +
                        String(latMin).padStart(2, "0") +
                        latDir;
                    const lonStr =
                        String(lonDeg).padStart(3, "0") +
                        String(lonMin).padStart(2, "0") +
                        lonDir;
                    return latStr + lonStr;
                }
            }
            return pointName;
        }
        // 18.2 Hàm tạo điểm thêm vào trường 18
        function addPointToItem18(pointName, fieldType) {
            const coordinate = getPointCoordinate(pointName);
            const item18Select =
                document.getElementById("item18Select");
            if (!item18Select) return;
            // Chọn DEP / DEST / ALTN trong select Item 18
            item18Select.value = fieldType + "/";
            // Cuộn màn hình tới Item 18
            item18Select.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            // Tạo dòng Item 18
            addItem18Field(
                fieldType + "/",
                coordinate + " " + pointName
            );
        }
        // 18.B Hàm thêm vào chức năng
        function selectItem18Destination(fieldType) {
            const menu =
                document.getElementById("item18AddMenu");
            if (menu) {
                menu.classList.add("hidden");
            }
            addPointToItem18(
                selectedPointForAdd,
                fieldType
            );
        }
        // 19. Gắn sự kiện lắng nghe tự động cập nhật
        ['route', 'depAirport', 'destAirport'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', updateRouteDistanceUI);
                el.addEventListener('change', updateRouteDistanceUI);
            }
        });
        // 20. Tạo định dạng ICAO
        function getFormData() {
            // Item 18 text construction
            const item18Inputs = document.querySelectorAll(".item18Input");
            let item18Text = "";
            item18Inputs.forEach(input => {
                if (input.value.trim()) {
                    item18Text += `${input.dataset.prefix}${input.value.trim().toUpperCase()} `;
                }
            });
            return {
                callsign: document.getElementById("callsign").value.trim().toUpperCase() || "8406",
                rules: document.getElementById("rules").value,
                flightType: document.getElementById("flightType").value,
                aircraftNumber: document.getElementById("aircraftNumber").value,
                aircraftType: document.getElementById("aircraftType").value || "MI8",
                wakeCat: document.getElementById("wakeCat").value,
                equipment: document.getElementById("equipment").value.trim().toUpperCase() || "S/C",
                dep: document.getElementById("dep").value.trim().toUpperCase() || "VVVT",
                time: document.getElementById("time").value.trim() || "0300",
                speed: formatSpeed(),
                level: formatLevel(),
                route: document.getElementById("route").value.trim().toUpperCase() || "DCT",
                dest: document.getElementById("dest").value.trim().toUpperCase() || "VVTS",
                eet: document.getElementById("eet").value.trim() || "0035",
                altn1: document.getElementById("altn1").value.trim().toUpperCase(),
                altn2: document.getElementById("altn2").value.trim().toUpperCase(),
                other: item18Text.trim() || "NAV/RNVD1E2A1 DOF/260806 REG/VN8406",
                // Supplementary
                eEet: document.getElementById("item19E").value.trim(),
                pob: document.getElementById("item19P").value.trim(),
                pic: document.getElementById("item19C").value.trim(),
                color: document.getElementById("item19A").value.trim(),
                createdDate: new Date().toISOString().split("T")[0],
                createdAt: Date.now()
            };
        }

        function generateICAOString(plan) {
            let item9 = (plan.aircraftNumber === "1" || !plan.aircraftNumber) ?
                `${plan.aircraftType}/${plan.wakeCat}` :
                `${plan.aircraftNumber}${plan.aircraftType}/${plan.wakeCat}`;
            let item16 = `${plan.dest}${plan.eet}`;
            if (plan.altn1) item16 += ` ${plan.altn1}`;
            if (plan.altn2) item16 += ` ${plan.altn2}`;
            return `(FPL-${plan.callsign}-${plan.rules}${plan.flightType}
-${item9}
-${plan.equipment}
-${plan.dep}${plan.time}
-${plan.speed}${plan.level} ${plan.route}
-${item16}
-${plan.other})`;
        }
        // 21. Hàm tạo AFTN
        function generateAFTNString(plan) {
            const addrs = document.getElementById("aftnAddresses").value.trim().toUpperCase() || "VVTSZPZX";
            const fplText = generateICAOString(plan);
            return `FF ${addrs}\n${new Date().toISOString().slice(2,10).replace(/-/g,'')} VVTSZDZX\n\n${fplText}`;
        }
        // 22. Hàm update AFTN
        function updateLivePreview() {
            const plan = getFormData();
            const icaoStr = generateICAOString(plan);
            const aftnStr = generateAFTNString(plan);
            document.getElementById("liveIcaoPreview").textContent = icaoStr;
            document.getElementById("liveAftnPreview").textContent = aftnStr;
        }
        // 23. UI TAB & PANEL SWITCHING
        function switchRightTab(tab) {
            const previewTab = document.getElementById("tabContentPreview");
            const aftnTab = document.getElementById("tabContentAftn");
            const savedTab = document.getElementById("tabContentSaved");
            const btnPreview = document.getElementById("tabBtnPreview");
            const btnAftn = document.getElementById("tabBtnAftn");
            const btnSaved = document.getElementById("tabBtnSaved");
            [previewTab, aftnTab, savedTab].forEach(t => t.classList.add("hidden"));
            [btnPreview, btnAftn, btnSaved].forEach(b => {
                b.className = "flex-1 py-2 text-xs font-bold rounded-xl transition-all text-slate-400 hover:bg-slate-700/50 flex items-center justify-center gap-1.5";
            });
            if (tab === 'preview') {
                previewTab.classList.remove("hidden");
                btnPreview.className = "flex-1 py-2 text-xs font-bold rounded-xl transition-all bg-brand-600 text-white shadow-md flex items-center justify-center gap-1.5";
            } else if (tab === 'aftn') {
                aftnTab.classList.remove("hidden");
                btnAftn.className = "flex-1 py-2 text-xs font-bold rounded-xl transition-all bg-amber-600 text-white shadow-md flex items-center justify-center gap-1.5";
            } else if (tab === 'saved') {
                savedTab.classList.remove("hidden");
                btnSaved.className = "flex-1 py-2 text-xs font-bold rounded-xl transition-all bg-brand-600 text-white shadow-md flex items-center justify-center gap-1.5";
                renderPlans();
            }
        }
        // 24. Hàm hiển thị item 19
        function toggleItem19() {
            const content = document.getElementById("item19Content");
            const icon = document.getElementById("item19ToggleIcon");
            if (content.classList.contains("hidden")) {
                content.classList.remove("hidden");
                icon.innerHTML = 'Thu gọn <i class="fa-solid fa-chevron-up"></i>';
            } else {
                content.classList.add("hidden");
                icon.innerHTML = 'Mở rộng <i class="fa-solid fa-chevron-down"></i>';
            }
        }
        // SAVING & STORAGE
        // 25. Hàm lưu kế hoạch bay
        function savePlan() {
            const plan = getFormData();
            plans.push(plan);
            localStorage.setItem("icaoPlans", JSON.stringify(plans));
            renderPlans();
            updateSavedCount();
            showToast("Đã lưu thành công Kế Hoạch Bay!", "success");
        }
        // 26. Hàm cập nhật tự động lưu
        function updateSavedCount() {
            document.getElementById("savedCount").textContent = plans.length;
        }
        // 27. Hàm render ra FPL
        function renderPlans() {
            const container = document.getElementById("savedPlansList");
            const keyword = document.getElementById("searchBox").value.trim().toUpperCase();
            const selectedDate = document.getElementById("dateFilter").value;
            const sortOrder = document.getElementById("sortOrder").value;
            container.innerHTML = "";
            let filtered = [...plans];
            if (keyword) {
                filtered = filtered.filter(p => p.callsign.includes(keyword) || p.dep.includes(keyword) || p.dest.includes(keyword));
            }
            if (selectedDate) {
                filtered = filtered.filter(p => p.createdDate === selectedDate);
            }
            filtered.sort((a, b) => sortOrder === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8 text-slate-500 text-xs">
                        <i class="fa-solid fa-folder-open text-2xl mb-2 opacity-50"></i>
                        <div>Không tìm thấy kế hoạch bay nào</div>
                    </div>`;
                return;
            }
            filtered.forEach(plan => {
                const originalIndex = plans.indexOf(plan);
                const icaoStr = generateICAOString(plan);
                const card = document.createElement("div");
                card.className = "bg-slate-900 border border-slate-700 hover:border-brand-500/50 rounded-xl p-3 space-y-2 transition-all shadow-md";
                card.innerHTML = `
                    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-sm text-brand-400 font-mono">${plan.callsign}</span>
                            <span class="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">${plan.aircraftType}</span>
                        </div>
                        <span class="text-[10px] text-slate-500">${plan.createdDate}</span>
                    </div>
                    <div class="flex items-center justify-between text-xs text-slate-300">
                        <div class="font-bold text-white">${plan.dep} <i class="fa-solid fa-arrow-right text-[10px] text-brand-400"></i> ${plan.dest}</div>
                        <div class="font-mono text-slate-400">${plan.speed} / ${plan.level}</div>
                    </div>
                    <div class="bg-slate-950 p-2 rounded-lg font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-24 overflow-y-auto border border-slate-800">
${icaoStr}
                    </div>
                    <div class="flex gap-2 pt-1">
                        <button onclick="loadPlanToEditor(${originalIndex})" class="flex-1 py-1 text-[11px] bg-brand-600/20 hover:bg-brand-600/40 text-brand-400 border border-brand-500/30 rounded-lg transition-colors font-semibold">
                            <i class="fa-solid fa-pen-to-square"></i> Nạp Lại
                        </button>
                        <button onclick="copyToClipboard('${escapeJsString(icaoStr)}')" class="flex-1 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors">
                            <i class="fa-solid fa-copy"></i> Copy
                        </button>
                        <button onclick="deletePlan(${originalIndex})" class="px-2 py-1 text-[11px] bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 rounded-lg transition-colors">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
        }
        // 28. Hàm load kế hoạch bay để chỉnh sửa
        function loadPlanToEditor(index) {
            const plan = plans[index];
            if (!plan) return;
            document.getElementById("callsign").value = plan.callsign;
            document.getElementById("rules").value = plan.rules;
            document.getElementById("flightType").value = plan.flightType;
            document.getElementById("aircraftNumber").value = plan.aircraftNumber || 1;
            document.getElementById("aircraftType").value = plan.aircraftType;
            document.getElementById("wakeCat").value = plan.wakeCat;
            document.getElementById("equipment").value = plan.equipment;
            document.getElementById("dep").value = plan.dep;
            document.getElementById("time").value = plan.time;
            document.getElementById("route").value = plan.route;
            document.getElementById("dest").value = plan.dest;
            document.getElementById("eet").value = plan.eet;
            document.getElementById("altn1").value = plan.altn1 || "";
            document.getElementById("altn2").value = plan.altn2 || "";
            // Reset Item 18 Container
            document.getElementById("item18Container").innerHTML = "";
            if (plan.other) {
                const parts = plan.other.split(" ");
                parts.forEach(part => {
                    const match = part.match(/^([A-Z0-9]+\/)(.*)$/);
                    if (match) {
                        addItem18Field(match[1], match[2]);
                    }
                });
            }
            switchRightTab('preview');
            updateLivePreview();
            showToast(`Đã nạp FPL ${plan.callsign} vào bộ soạn thảo!`, "info");
        }
        // 29. Chức năng xóa FPL
        async function deletePlan(index) {
            const confirmed = await customConfirm("Xóa Kế Hoạch Bay", `Bạn có chắc chắn muốn xóa FPL của chuyến bay ${plans[index]?.callsign}?`);
            if (confirmed) {
                plans.splice(index, 1);
                localStorage.setItem("icaoPlans", JSON.stringify(plans));
                renderPlans();
                updateSavedCount();
                showToast("Đã xóa kế hoạch bay!", "warning");
            }
        }
        // 30. Chức năng reset form về trắng
        function resetForm() {
            document.getElementById("callsign").value = "8406";
            document.getElementById("aircraftType").value = "MI8";
            document.getElementById("dep").value = "VVVT";
            document.getElementById("dest").value = "VVTS";
            document.getElementById("route").value = "DCT";
            document.getElementById("altn1").value = "";
            document.getElementById("altn2").value = "";
            document.getElementById("item18Container").innerHTML = "";
            setCurrentTimeUTC();
            updateLivePreview();
            showToast("Đã làm mới form soạn thảo!", "info");
        }

        // 31. Hàm copy và tạo ra TXT
        function copyToClipboard(text) {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast("Đã sao chép vào bộ nhớ tạm!", "success");
                }).catch(() => fallbackCopy(text));
            } else {
                fallbackCopy(text);
            }
        }
        // 32.Hàm tạo ra bản sao
        function fallbackCopy(text) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showToast("Đã sao chép vào bộ nhớ tạm!", "success");
            } catch (err) {
                showToast("Không thể sao chép tự động", "error");
            }
            document.body.removeChild(textArea);
        }
        
        // 31. Hàm Copy FPL và Gọi Popup
        function copyCurrentPreview() {
            const previewElement = document.getElementById('liveIcaoPreview');
            if (!previewElement) {
                alert("Không tìm thấy nội dung FPL để copy!");
                return;
            }
            const fplText = previewElement.innerText || previewElement.textContent;
            // Sử dụng textarea tạm để copy
            const tempTextArea = document.createElement("textarea");
            tempTextArea.value = fplText;
            tempTextArea.style.position = "fixed";
            tempTextArea.style.opacity = "0";
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            try {
                // Thực hiện lệnh copy
                document.execCommand('copy');
                // COPY THÀNH CÔNG -> GỌI POPUP CỦA BẠN LÊN!
                openFplConfirmModal();
            } catch (err) {
                console.error("Lỗi khi sao chép: ", err);
                alert("Không thể sao chép tự động do trình duyệt chặn quyền.");
            }
            // Dọn dẹp thẻ tạm
            document.body.removeChild(tempTextArea);
        }
        // 32. Mở Popup FPL
        function openFplConfirmModal() {
            const modal = document.getElementById('fplConfirmModal');
            if (modal) {
                modal.classList.remove('hidden');
                // Hiệu ứng mở
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    const modalBox = modal.querySelector('.bg-slate-800');
                    if (modalBox) {
                        modalBox.classList.remove('scale-95');
                        modalBox.classList.add('scale-100');
                    }
                }, 10);
            }
        }
        // 33. Đóng Popup FPL
        function closeFplConfirmModal() {
            const modal = document.getElementById('fplConfirmModal');
            if (!modal) return;
            modal.classList.add('hidden');
        }

        // 34. Nút "Chỉ Copy, Không Gửi"
        function Closepopup() {
            // Đóng Popup FPL
            closeFplConfirmModal();
        }
        // 35. Nút "Mở trang gửi FPL"
        function confirmAndSendFPL() {
            // Đóng Popup FPL
            closeFplConfirmModal();
            // Mở AVIWEB
            window.open(
                'https://aviweb.vnaic.vn/AviWeb/#!fplf',
                '_blank'
            );
        }
        // 36. Hàm tải xuống FPL
        function downloadCurrentFpl() {
            const plan = getFormData();
            const text = generateICAOString(plan);
            const blob = new Blob([text], {
                type: "text/plain;charset=utf-8"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `FPL_${plan.callsign}_${plan.dep}_${plan.dest}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            showToast("Đã tải xuống tập tin FPL!", "success");
        }
        // 37. Hàm show kế hoạch bay ra
        function showToast(message, type = "info") {
            const container = document.getElementById("toastContainer");
            const toast = document.createElement("div");
            const colors = {
                success: "bg-emerald-600 text-white border-emerald-500",
                error: "bg-red-600 text-white border-red-500",
                warning: "bg-amber-600 text-white border-amber-500",
                info: "bg-brand-600 text-white border-brand-500"
            };
            const icons = {
                success: "fa-circle-check",
                error: "fa-circle-exclamation",
                warning: "fa-triangle-exclamation",
                info: "fa-circle-info"
            };
            toast.className = `pointer-events-auto px-4 py-2.5 rounded-xl border shadow-xl flex items-center gap-2 text-xs font-semibold transition-all transform translate-y-2 opacity-0 ${colors[type]}`;
            toast.innerHTML = `<i class="fa-solid ${icons[type]} text-sm"></i><span>${message}</span>`;
            container.appendChild(toast);
            setTimeout(() => {
                toast.classList.remove("translate-y-2", "opacity-0");
            }, 10);
            setTimeout(() => {
                toast.classList.add("opacity-0", "translate-y-2");
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
        // 38. Custom Confirm Dialog
        function customConfirm(title, message) {
            return new Promise((resolve) => {
                document.getElementById("confirmTitle").textContent = title;
                document.getElementById("confirmMessage").textContent = message;
                const modal = document.getElementById("confirmModal");
                modal.classList.remove("hidden");

                const okBtn = document.getElementById("confirmOkBtn");
                confirmResolver = resolve;

                okBtn.onclick = function() {
                    closeConfirmModal(true);
                };
            });
        }

        function closeConfirmModal(result) {
            document.getElementById("confirmModal").classList.add("hidden");
            if (confirmResolver) confirmResolver(result);
        }
        
        // 39. Mẫu và Đội bay
        function openPresetsModal() {
            const container = document.getElementById("presetsList");
            container.innerHTML = "";
            presetRoutes.forEach(preset => {
                const card = document.createElement("div");
                card.className = "bg-slate-900 border border-slate-700 hover:border-brand-500 p-3 rounded-xl cursor-pointer transition-all space-y-1";
                card.onclick = () => applyPreset(preset);
                card.innerHTML = `
                    <div class="font-bold text-xs text-brand-400">${preset.title}</div>
                    <div class="text-[11px] text-slate-300 font-mono">${preset.dep} → ${preset.dest} | ${preset.speed} KT | ${preset.level}</div>
                `;
                container.appendChild(card);
            });
            document.getElementById("presetsModal").classList.remove("hidden");
        }

        function closePresetsModal() {
            document.getElementById("presetsModal").classList.add("hidden");
        }

        function applyPreset(preset) {
            document.getElementById("dep").value = preset.dep;
            document.getElementById("dest").value = preset.dest;
            document.getElementById("route").value = preset.route;
            document.getElementById("speedValue").value = preset.speed;
            document.getElementById("levelValue").value = preset.level;
            if (preset.altn1) document.getElementById("altn1").value = preset.altn1;
            if (preset.item18) {
                const parts = preset.item18.split(" ");
                parts.forEach(p => {
                    const match = p.match(/^([A-Z0-9]+\/)(.*)$/);
                    if (match) addItem18Field(match[1], match[2]);
                });
            }
            closePresetsModal();
            calculateEET();
            updateLivePreview();
            showToast(`Đã áp dụng mẫu đường bay ${preset.dep}-${preset.dest}`, "success");
        }

        function openFleetModal() {
            renderFleetList();
            document.getElementById("fleetModal").classList.remove("hidden");
        }

        function closeFleetModal() {
            document.getElementById("fleetModal").classList.add("hidden");
        }

        function renderFleetList() {
            const container = document.getElementById("fleetListContainer");
            container.innerHTML = "";
            Object.keys(aircraftData).forEach(reg => {
                const row = document.createElement("div");
                row.className = "flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-700 text-xs";
                row.innerHTML = `
                    <span class="font-bold text-white font-mono">${reg}</span>
                    <span class="text-slate-400 font-mono">${aircraftData[reg]}</span>
                    <button onclick="removeAircraft('${reg}')" class="text-red-400 hover:text-red-300"><i class="fa-solid fa-trash-can"></i></button>
                `;
                container.appendChild(row);
            });
        }
        // 40. Chức năng thêm máy bay mới
        function addCustomAircraft() {
            const reg = document.getElementById("newReg").value.trim().toUpperCase();
            const type = document.getElementById("newType").value.trim().toUpperCase();
            if (!reg || !type) {
                showToast("Vui lòng điền đầy đủ số hiệu và loại tàu bay!", "warning");
                return;
            }
            aircraftData[reg] = type;
            localStorage.setItem("icaoAircraftData", JSON.stringify(aircraftData));
            populateDataLists();
            renderFleetList();
            document.getElementById("newReg").value = "";
            document.getElementById("newType").value = "";
            showToast(`Đã thêm tàu bay ${reg} (${type}) vào cơ sở dữ liệu!`, "success");
        }
        // 41. Chức năng xóa máy bay
        function removeAircraft(reg) {
            delete aircraftData[reg];
            localStorage.setItem("icaoAircraftData", JSON.stringify(aircraftData));
            populateDataLists();
            renderFleetList();
            showToast(`Đã xóa tàu bay ${reg}`, "info");
        }
        // 42. Xuất dữ liệu
        function exportAllData() {
            const data = {
                plans: plans,
                fleet: aircraftData
            };
            const jsonStr = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonStr], {
                type: "application/json"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ICAO_FPL_Backup_${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast("Đã xuất file sao lưu dữ liệu!", "success");
        }
        // 43. Nhập dữ liệu
        function importData(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const imported = JSON.parse(e.target.result);
                    if (imported.plans) {
                        plans = imported.plans;
                        localStorage.setItem("icaoPlans", JSON.stringify(plans));
                    }
                    if (imported.fleet) {
                        aircraftData = imported.fleet;
                        localStorage.setItem("icaoAircraftData", JSON.stringify(aircraftData));
                    }
                    populateDataLists();
                    renderPlans();
                    updateSavedCount();
                    showToast("Nhập dữ liệu thành công!", "success");
                } catch (err) {
                    showToast("Tệp tin JSON không hợp lệ!", "error");
                }
            };
            reader.readAsText(file);
        }
       
        function clearField(fieldId) {
            const field = document.getElementById(fieldId);
            if (!field) return;
            field.value = '';
            field.focus();
            field.dispatchEvent(new Event('input', {
                bubbles: true
            }));
            field.dispatchEvent(new Event('change', {
                bubbles: true
            }));
        }
