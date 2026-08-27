// 1.Hàm lấy danh sách tàu bay
        function populateDataLists() {
            // Aircraft datalist
            const aircraftList = document.getElementById("aircraftList");
            aircraftList.innerHTML = "";
            Object.keys(aircraftData).forEach(reg => {
                const option = document.createElement("option");
                option.value = reg;
                option.textContent = `${reg} (${aircraftData[reg]})`;
                aircraftList.appendChild(option);
            });
            // Airport datalist
            const airportList = document.getElementById("airportList");
            airportList.innerHTML = "";
            airports.forEach(ap => {
                const option = document.createElement("option");
                option.value = ap.split(" - ")[0];
                option.textContent = ap;
                airportList.appendChild(option);
            });
        }
        // 2.Hàm tạo event để lấy giá trị tính EET
        function setupEventListeners() {
            // Auto fill aircraft type
            document.getElementById("callsign").addEventListener("input", function() {
                const reg = this.value.trim().toUpperCase();
                document.getElementById("aircraftType").value = aircraftData[reg] || "";
                updateLivePreview();
            });
            // Inputs auto trigger EET calculation & preview update
            const inputsToListen = ["callsign", "rules", "flightType", "aircraftNumber", "wakeCat", "equipment", "dep", "time", "speedUnit", "speedValue", "levelUnit", "levelValue", "route", "dest", "eet", "altn1", "altn2"];
            inputsToListen.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener("input", () => {
                        calculateEET();
                        updateLivePreview();
                    });
                    el.addEventListener("change", () => {
                        calculateEET();
                        updateLivePreview();
                    });
                }
            });
        }
        // 3.Hàm đặt thời gian dự kiến khởi hành
        function setCurrentTimeUTC() {
            const now = new Date();
            const hh = String(now.getUTCHours()).padStart(2, '0');
            const mm = String(now.getUTCMinutes()).padStart(2, '0');
            document.getElementById("time").value = hh + mm;
            updateLivePreview();
        }
        // 4.Hàm tạo các trường con trong item 18
        function addItem18Field(prefilledPrefix = "", prefilledValue = "") {
            const selectEl = document.getElementById("item18Select");
            const selected = prefilledPrefix || selectEl.value;
            if (!selected) return;
            const container = document.getElementById("item18Container");
            const row = document.createElement("div");
            row.className = "flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700 item18-row transition-all";
            const label = document.createElement("span");
            label.className = "text-xs font-mono font-bold text-brand-400 min-w-[50px]";
            label.textContent = selected;
            const input = document.createElement("input");
            input.type = "text";
            input.className = "item18Input flex-1 bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-xs text-white uppercase font-mono focus:outline-none focus:border-brand-500";
            input.dataset.prefix = selected;
            // 4.1 Hàm tự động điền trường 18 REG, DOF, OPR
            if (!prefilledValue) {
                if (selected === "REG/") {
                    const reg = document.getElementById("callsign").value.trim();
                    input.value = reg ? (reg.startsWith("VN") ? reg : "VN" + reg) : "";
                } else if (selected === "DOF/") {
                    const today = new Date();
                    const yy = String(today.getUTCFullYear()).slice(-2);
                    const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
                    const dd = String(today.getUTCDate()).padStart(2, '0');
                    input.value = `${yy}${mm}${dd}`;
                } else if (selected === "OPR/") {
                    input.value = "VIETNAM HELICOPTER SOUTHERN COMPANY";
                }
            } else {
                input.value = prefilledValue;
            }
            input.addEventListener("input", updateLivePreview);
            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "text-slate-400 hover:text-red-400 px-2 py-1 text-xs transition-colors";
            removeBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            removeBtn.onclick = function() {
                row.remove();
                updateLivePreview();
            };
            row.appendChild(label);
            row.appendChild(input);
            row.appendChild(removeBtn);
            container.appendChild(row);
            if (!prefilledPrefix) selectEl.value = "";
            updateLivePreview();
        }