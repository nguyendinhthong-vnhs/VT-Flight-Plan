// 33.Hàm kiểm tra FPL các item
        (function() {
            "use strict";
            // 33.1 Các item kiểm tra
            let fplValidationState = null;
            const ITEM_NAMES = {
                7: "Callsign",
                8: "Quy tắc bay / Loại chuyến bay",
                9: "Tàu bay",
                10: "Trang thiết bị",
                13: "Sân bay khởi hành / EOBT",
                15: "Tốc độ / Mực bay / Route",
                16: "Sân bay đến / EET / ALTN",
                18: "Thông tin khác"
            };
            // 33.2 Các giá trị cần kiểm tra
            function valueOf(id) {
                const el = document.getElementById(id);
                if (!el) return "";
                return String(el.value || "")
                    .trim()
                    .toUpperCase();
            }
            // 33.3 Result Object
            function createResult(
                item,
                status,
                message,
                detail = "",
                targetId = null
            ) {
                return {
                    item,
                    name: ITEM_NAMES[item] || "",
                    status,
                    message,
                    detail,
                    targetId
                };
            }
            function PASS(
                item,
                message,
                detail = ""
            ) {
                return createResult(
                    item,
                    "pass",
                    message,
                    detail
                );
            }
            function WARNING(
                item,
                message,
                detail = "",
                targetId = null
            ) {
                return createResult(
                    item,
                    "warning",
                    message,
                    detail,
                    targetId
                );
            }
            function ERROR(
                item,
                message,
                detail = "",
                targetId = null
            ) {
                return createResult(
                    item,
                    "error",
                    message,
                    detail,
                    targetId
                );
            }
            // 33.4 Các giá trị thay thế
            function isHHMM(value) {
                if (!/^\d{4}$/.test(value)) {
                    return false;
                }
                const hh = Number(value.substring(0, 2));
                const mm = Number(value.substring(2, 4));
                return (
                    hh >= 0 &&
                    hh <= 23 &&
                    mm >= 0 &&
                    mm <= 59
                );
            }
            function isICAO4(value) {
                return /^[A-Z0-9]{4}$/.test(value);
            }
            // Direct Coordinate
            function parseDirectCoordinate(token) {
                const value =
                    String(token || "")
                    .trim()
                    .toUpperCase();
                // Định dạng độ phút giây
                let match = value.match(
                    /^(\d{2})(\d{2})([NS])(\d{3})(\d{2})([EW])$/
                );
                if (match) {
                    let lat =
                        Number(match[1]) +
                        Number(match[2]) / 60;
                    let lon =
                        Number(match[4]) +
                        Number(match[5]) / 60;
                    if (match[3] === "S") {
                        lat = -lat;
                    }
                    if (match[6] === "W") {
                        lon = -lon;
                    }
                    return {
                        lat,
                        lon
                    };
                }
                return null;
            }
            /*6. RESOLVE POINT*/
            function resolvePoint(code) {
                let token =
                    String(code || "")
                    .trim()
                    .toUpperCase();
                if (!token) {
                    return null;
                }
                if (token.includes("/")) {
                    token =
                        token
                        .split("/")[0]
                        .trim();
                }
                /* Ưu tiên dùng resolver hiện tại*/
                try {
                    if (
                        typeof getPointCoordinates ===
                        "function"
                    ) {
                        const point =
                            getPointCoordinates(token);
                        if (
                            point &&
                            Number.isFinite(
                                Number(point.lat)
                            ) &&
                            Number.isFinite(
                                Number(point.lon)
                            )
                        ) {
                            return {
                                code: token,
                                lat: Number(point.lat),
                                lon: Number(point.lon),
                                source: "application"
                            };
                        }
                    }
                } catch (error) {
                    console.warn(
                        "[VALIDATION] getPointCoordinates error:",
                        error
                    );
                }
                /*Airport database*/
                try {
                    if (
                        typeof airportCoordinates !==
                        "undefined" &&
                        airportCoordinates[token]
                    ) {
                        const p =
                            airportCoordinates[token];
                        return {
                            code: token,
                            lat: Number(p.lat),
                            lon: Number(p.lon),
                            source: "airport"
                        };
                    }
                } catch (e) {}
                /*Waypoint database*/
                try {
                    if (
                        typeof waypointDatabase !==
                        "undefined" &&
                        waypointDatabase[token]
                    ) {
                        const p =
                            waypointDatabase[token];
                        return {
                            code: token,
                            lat: Number(p.lat),
                            lon: Number(p.lon),
                            source: "waypointDatabase"
                        };
                    }
                } catch (e) {}               
                try {
                    if (
                        typeof waypointDatabase2 !==
                        "undefined" &&
                        waypointDatabase2[token]
                    ) {
                        const p =
                            waypointDatabase2[token];
                        if (
                            typeof p.lat === "number" &&
                            typeof p.lon === "number"
                        ) {
                            return {
                                code: token,
                                lat: p.lat,
                                lon: p.lon,
                                source: "waypointDatabase2"
                            };
                        }
                    }
                } catch (e) {}
                const direct =
                    parseDirectCoordinate(token);
                if (direct) {
                    return {
                        code: token,
                        ...direct,
                        source: "coordinate"
                    };
                }
                return null;
            }
            function isRouteControlToken(token) {
                const value =
                    String(token || "")
                    .trim()
                    .toUpperCase();
                if (
                    value === "DCT" ||
                    value === "VFR"
                ) {
                    return true;
                }
                /*Speed*/
                if (
                    /^[KNM]\d{3,4}$/.test(value)
                ) {
                    return true;
                }
                /*Level*/
                if (
                    /^(A|F|M|S)\d{2,4}$/.test(value)
                ) {
                    return true;
                }
                if (
                    /^FL\d{2,3}$/.test(value)
                ) {
                    return true;
                }
                /*Airway / route designator*/
                if (
                    /^[A-Z]{1,3}\d{1,4}$/.test(value)
                ) {
                    return true;
                }
                return false;
            }
            function cleanValidationRouteToken(rawToken) {
                let token =
                    String(rawToken || "")
                    .trim()
                    .toUpperCase();
                if (!token) {
                    return "";
                }
                if (
                    typeof cleanRouteToken ===
                    "function"
                ) {
                    try {
                        const cleaned =
                            cleanRouteToken(token);
                        if (!cleaned) {
                            return "";
                        }
                        if (
                            typeof cleaned === "object" &&
                            cleaned.lat !== undefined
                        ) {
                            return cleaned;
                        }
                        token =
                            String(cleaned)
                            .trim()
                            .toUpperCase();
                    } catch (error) {
                        console.warn(
                            "[VALIDATION] cleanRouteToken:",
                            error
                        );
                    }
                }
                if (
                    isRouteControlToken(token)
                ) {
                    return "";
                }
                if (
                    token.includes("/")
                ) {
                    token =
                        token
                        .split("/")[0]
                        .trim();
                }
                return token;
            }
            function analyzeRoute(plan) {
                const route =
                    String(plan.route || "");
                const tokens =
                    route
                    .replace(/\n/g, " ")
                    .split(/\s+/)
                    .filter(Boolean);
                const points = [];
                const unknown = [];
                const depPoint =
                    resolvePoint(plan.dep);
                if (depPoint) {
                    points.push({
                        ...depPoint,
                        role: "DEP"
                    });
                }
                for (
                    const rawToken of tokens
                ) {
                    const cleaned =
                        cleanValidationRouteToken(
                            rawToken
                        );
                    if (!cleaned) {
                        continue;
                    }
                    if (
                        typeof cleaned ===
                        "object" &&
                        cleaned.lat !== undefined
                    ) {
                        points.push({
                            ...cleaned,
                            code: rawToken,
                            role: "WAYPOINT"
                        });
                        continue;
                    }
                    const point =
                        resolvePoint(cleaned);
                    if (point) {
                        points.push({
                            ...point,
                            code: cleaned,
                            role: "WAYPOINT"
                        });
                    } else {
                        unknown.push(cleaned);
                    }
                }
                const destPoint =
                    resolvePoint(plan.dest);
                if (destPoint) {
                    points.push({
                        ...destPoint,
                        role: "DEST"
                    });
                }
                return {
                    points,
                    unknown: [...new Set(unknown)],
                    depFound:
                        !!depPoint,
                    destFound:
                        !!destPoint
                };
            }
            function validateItem7(plan) {
                if (!plan.callsign) {
                    return ERROR(
                        7,
                        "Chưa nhập Callsign.",
                        "",
                        "callsign"
                    );
                }
                if (
                    !/^[A-Z0-9]+$/.test(
                        plan.callsign
                    )
                ) {
                    return ERROR(
                        7,
                        "Callsign chứa ký tự không hợp lệ.",
                        "Chỉ cho phép A-Z và 0-9.",
                        "callsign"
                    );
                }
                return PASS(
                    7,
                    "Callsign hợp lệ.",
                    plan.callsign
                );
            }
            function validateItem8(plan) {
                const validRules = [
                    "I",
                    "V",
                    "Y",
                    "Z"
                ];
                const validTypes = [
                    "S",
                    "N",
                    "G",
                    "M",
                    "X"
                ];
                if (
                    !validRules.includes(
                        plan.rules
                    )
                ) {
                    return ERROR(
                        8,
                        "Flight Rules không hợp lệ.",
                        `Giá trị: ${plan.rules}`,
                        "rules"
                    );
                }
                if (
                    !validTypes.includes(
                        plan.flightType
                    )
                ) {
                    return ERROR(
                        8,
                        "Type of Flight không hợp lệ.",
                        `Giá trị: ${plan.flightType}`,
                        "flightType"
                    );
                }
                return PASS(
                    8,
                    "Flight Rules / Type hợp lệ.",
                    `${plan.rules}${plan.flightType}`
                );
            }
            function validateItem9(plan) {
                const number =
                    String(
                        plan.aircraftNumber || ""
                    ).trim();
                const type =
                    String(
                        plan.aircraftType || ""
                    ).trim()
                    .toUpperCase();
                const wake =
                    String(
                        plan.wakeCat || ""
                    ).trim()
                    .toUpperCase();
                if (
                    !number ||
                    !/^\d+$/.test(number) ||
                    Number(number) < 1
                ) {
                    return ERROR(
                        9,
                        "Số lượng tàu bay không hợp lệ.",
                        "Phải là số nguyên lớn hơn 0.",
                        "aircraftNumber"
                    );
                }
                if (!type) {
                    return ERROR(
                        9,
                        "Chưa có Aircraft Type.",
                        "",
                        "aircraftType"
                    );
                }
                if (
                    ![
                        "L",
                        "M",
                        "H",
                        "J"
                    ].includes(wake)
                ) {
                    return ERROR(
                        9,
                        "Wake Turbulence Category không hợp lệ.",
                        "Giá trị: L / M / H / J.",
                        "wakeCat"
                    );}
                if (
                    typeof aircraftData !==
                    "undefined" &&
                    aircraftData &&
                    Object.keys(aircraftData).length
                ) {
                    const exists =
                        Object.values(
                            aircraftData
                        )
                        .map(
                            value =>
                            String(value)
                            .toUpperCase()
                        )
                        .includes(type);
                    if (!exists) {
                        return WARNING(
                            9,
                            "Aircraft Type chưa có trong database.",
                            `Type: ${type}`,
                            "aircraftType"
                        );
                    }
                }
                return PASS(
                    9,
                    "Thông tin tàu bay hợp lệ.",
                    `${number}${type}/${wake}`
                );
            }
            function validateItem10(plan) {
                if (!plan.equipment) {
                    return ERROR(
                        10,
                        "Chưa nhập Equipment.",
                        "",
                        "equipment"
                    );
                }
                if (
                    !/^[A-Z0-9/]+$/.test(
                        plan.equipment
                    )
                ) {
                    return ERROR(
                        10,
                        "Equipment chứa ký tự không hợp lệ.",
                        plan.equipment,
                        "equipment"
                    );}
                return PASS(
                    10,
                    "Equipment hợp lệ.",
                    plan.equipment
                );}
function validateItem13(plan) {
    const results = [];
    if (!plan.dep) {
        results.push(
            ERROR(
                13,
                "Chưa nhập DEP.",
                "",
                "dep"
            ));
    } else if (
        !isICAO4(plan.dep)
    ) {
        results.push(
            ERROR(
                13,
                "DEP không có dạng 4 ký tự.",
                `Giá trị: ${plan.dep}`,
                "dep"
            ));
    } else if (
        plan.dep === "ZZZZ"
    ) {
        results.push(
            WARNING(
                13,
                "DEP = ZZZZ.",
                "Không có tọa độ DEP để hiển thị trên bản đồ.",
                "dep"
            ));
    } else if (
        !resolvePoint(plan.dep)
    ) {
        results.push(
            ERROR(
                13,
                "Không tìm thấy tọa độ DEP.",
                `Không xác định được: ${plan.dep}`,
                "dep"
            ));}
    if (!plan.time) {
        results.push(
            ERROR(
                13,
                "Chưa nhập EOBT.",
                "",
                "time"
            ));
    } else if (
        !isHHMM(plan.time)
    ) {
        results.push(
            ERROR(
                13,
                "EOBT không đúng dạng HHMM.",
                `Giá trị: ${plan.time}`,
                "time"
            ));
    }
    if (results.some(r => r.type === "ERROR")) {
        return results;}
    if (plan.dep === "ZZZZ") {
        results.push(
            PASS(
                13,
                "DEP = ZZZZ và EOBT hợp lệ.",
                `${plan.dep}${plan.time}`
            ));
        return results;}
    return PASS(
        13,
        "DEP và EOBT hợp lệ.",
        `${plan.dep}${plan.time}`
    );}
            function validateItem15(plan) {
                const results = [];
                const speedUnit =
                    valueOf("speedUnit");
                const speedValue =
                    valueOf("speedValue");
                const levelUnit =
                    valueOf("levelUnit");
                const levelValue =
                    valueOf("levelValue");
                if (
                    !speedValue ||
                    !/^\d+$/.test(speedValue) ||
                    Number(speedValue) <= 0
                ) {
                    results.push(
                        ERROR(
                            15,
                            "Tốc độ chưa hợp lệ.",
                            "Speed phải là số lớn hơn 0.",
                            "speedValue"
                        ));
                }
                if (
                    ![
                        "N",
                        "K",
                        "M"
                    ].includes(speedUnit)
                ) {
                    results.push(
                        ERROR(
                            15,
                            "Đơn vị Speed không hợp lệ.",
                            `Đơn vị: ${speedUnit}`,
                            "speedUnit"
                        ));
                }
                if (
                    levelUnit === "VFR"
                ) {
                } else {
                    if (
                        !levelValue ||
                        !/^\d+$/.test(levelValue)
                    ) {
                        results.push(
                            ERROR(
                                15,
                                "Mực bay chưa hợp lệ.",
                                "Level phải có giá trị số.",
                                "levelValue"
                            ));}
                    if (
                        ![
                            "A",
                            "F",
                            "M"
                        ].includes(levelUnit)) {results.push(
                            ERROR(
                                15,
                                "Đơn vị Level không hợp lệ.",
                                `Đơn vị: ${levelUnit}`,
                                "levelUnit"
                            ));}}
                if (!plan.route) {
                    results.push(
                        ERROR(
                            15,
                            "Chưa nhập Route.",
                            "",
                            "route"
                        )
                    );
                } else {
                    const route =
                        analyzeRoute(plan);
                    if (
                        route.unknown.length
                    ) {
                        results.push(
                            ERROR(
                                15,
                                "Route có điểm không xác định.",
                                `Không tìm thấy: ${route.unknown.join(", ")}`,
                                "route"
                            ));
                    }
                    if (
                        route.points.length === 0
                    ) {
                        results.push(
                            ERROR(
                                15,
                                "Không xác định được điểm Route.",
                                "Kiểm tra DEP / Route / database điểm.",
                                "route"
                            ));}
                }
                if (results.length) {
                    return results;
                }
                return PASS(
                    15,
                    "Speed / Level / Route hợp lệ.",
                    `${plan.speed}${plan.level} ${plan.route}`
                );}
            function validateItem16(plan) {
                const results = [];
                if (!plan.dest) {
                    results.push(
                        ERROR(
                            16,
                            "Chưa nhập DEST.",
                            "",
                            "dest"
                        ));
                } else if (
                    !isICAO4(plan.dest)
                ) {
                    results.push(
                        ERROR(
                            16,
                            "DEST không có dạng 4 ký tự.",
                            `Giá trị: ${plan.dest}`,
                            "dest"
                        ));
                } else if (
                    plan.dest === "ZZZZ"
                ) {
                    results.push(
                        WARNING(
                            16,
                            "DEST = ZZZZ.",
                            "Không có tọa độ DEST để hiển thị trên bản đồ.",
                            "dest"
                        ));
                } else if (
                    !resolvePoint(plan.dest)
                ) {
                    results.push(
                        ERROR(
                            16,
                            "Không tìm thấy tọa độ DEST.",
                            `Không xác định được: ${plan.dest}`,
                            "dest"
                        ));
                }
                if (!plan.eet) {
                    results.push(
                        ERROR(
                            16,
                            "Chưa có EET.",
                            "",
                            "eet"
                        ));
                } else if (
                    !isHHMM(plan.eet)
                ) {
                    results.push(
                        ERROR(
                            16,
                            "EET không đúng dạng HHMM.",
                            `Giá trị: ${plan.eet}`,
                            "eet"
                        )
                    );
                }
                if (
                    plan.altn1 &&
                    !isICAO4(plan.altn1)
                ) {
                    results.push(
                        WARNING(
                            16,
                            "ALTN 1 không có dạng 4 ký tự.",
                            plan.altn1,
                            "altn1"
                        ));
                }
                if (
                    plan.altn2 &&
                    !isICAO4(plan.altn2)
                ) {
                    results.push(
                        WARNING(
                            16,
                            "ALTN 2 không có dạng 4 ký tự.",
                            plan.altn2,
                            "altn2"
                        )
                    );
                }
                if (results.length) {
                    return results;
                }
                if (
                    typeof isEETManuallyEdited !==
                    "undefined" &&
                    isEETManuallyEdited
                ) {
                    return WARNING(
                        16,
                        "EET đã được chỉnh thủ công.",
                        `EET hiện tại: ${plan.eet}`,
                        "eet"
                    );}
                return PASS(
                    16,
                    "DEST / EET / ALTN hợp lệ.",
                    `${plan.dest}${plan.eet}`
                );}
            function validateItem18() {
                const rows =
                    Array.from(
                        document.querySelectorAll(
                            ".item18Input"
                        ));
                if (!rows.length) {
                    return WARNING(
                        18,
                        "Item 18 chưa có trường bổ sung.",
                        "Không có dòng Item 18 được tạo."
                    );}
                const results = [];
                rows.forEach(
                    (input, index) => {
                        const prefix =
                            String(
                                input.dataset.prefix || ""
                            )
                            .trim()
                            .toUpperCase();
                        const value =
                            String(
                                input.value || ""
                            )
                            .trim()
                            .toUpperCase();
                        if (!prefix) {
                            results.push(
                                ERROR(
                                    18,
                                    `Dòng Item 18 #${index + 1} thiếu prefix.`,
                                    "Không xác định được loại thông tin."
                                )
                            );
                            return;
                        }
                        if (!value) {
                            results.push(
                                WARNING(
                                    18,
                                    `${prefix} chưa có giá trị.`,
                                    `Dòng Item 18 #${index + 1} đang trống.`
                                )
                            );
                            return;
                        }
                        if (
                            !/^[A-Z0-9]+\/$/.test(
                                prefix
                            )
                        ) {
                            results.push(
                                WARNING(
                                    18,
                                    `Prefix ${prefix} cần kiểm tra lại.`,
                                    "Prefix không theo dạng ABC/."
                                ));}}
                );
                const errors =
                    results.filter(
                        r => r.status === "error"
                    );
                const warnings =
                    results.filter(
                        r => r.status === "warning"
                    );
                if (errors.length) {
                    return errors;
                }
                if (warnings.length) {
                    return warnings;
                }
                return PASS(
                    18,
                    "Các trường Item 18 hợp lệ.",
                    rows
                    .map(
                        input =>
                        `${input.dataset.prefix}${input.value.trim().toUpperCase()}`
                    )
                    .join(" ")
                );}
            function createSnapshot() {
                const ids = [
                    "callsign",
                    "rules",
                    "flightType",
                    "aircraftNumber",
                    "aircraftType",
                    "wakeCat",
                    "equipment",
                    "dep",
                    "time",
                    "speedUnit",
                    "speedValue",
                    "levelUnit",
                    "levelValue",
                    "route",
                    "dest",
                    "eet",
                    "altn1",
                    "altn2"
                ];
                const state = {};
                ids.forEach(
                    id => {
                        state[id] =
                            valueOf(id);
                    }
                );
                state.item18 =
                    Array.from(
                        document.querySelectorAll(
                            ".item18Input"
                        )
                    )
                    .map(
                        input =>
                        `${input.dataset.prefix || ""}${input.value.trim().toUpperCase()}`
                    )
                    .join("|");
                return JSON.stringify(state);
            }
            function validateFPL() {
                let plan;
                try {
                    if (
                        typeof getFormData !==
                        "function"
                    ) {
                        throw new Error(
                            "getFormData() không tồn tại."
                        );
                    }
                    plan =
                        getFormData();
                } catch (error) {
                    console.error(
                        "[FPL VALIDATION]",
                        error
                    );
                    fplValidationState = {
                        valid: false,
                        errors: [
                            ERROR(
                                0,
                                "Không thể đọc dữ liệu FPL.",
                                error.message
                            )
                        ],
                        warnings: [],
                        results: []
                    };
                    renderValidationModal(
                        fplValidationState
                    );
                    return fplValidationState;
                }
                const rawResults = [
                    validateItem7(plan),
                    validateItem8(plan),
                    validateItem9(plan),
                    validateItem10(plan),
                    validateItem13(plan),
                    validateItem15(plan),
                    validateItem16(plan),
                    validateItem18()
                ];
                const results =
                    rawResults.flatMap(
                        item =>
                        Array.isArray(item) ?
                        item : [item]
                    );
                const errors =
                    results.filter(
                        r =>
                        r.status === "error"
                    );
                const warnings =
                    results.filter(
                        r =>
                        r.status === "warning"
                    );
                fplValidationState = {
                    valid: errors.length === 0,
                    errors,
                    warnings,
                    results,
                    checkedAt: Date.now(),
                    snapshot: createSnapshot()
                };
                renderValidationModal(
                    fplValidationState
                );
                updateValidationButton();
                return fplValidationState;
            }
            function invalidateFPLValidation() {
                fplValidationState =
                    null;
                updateValidationButton();}
            function isValidationStillCurrent() {
                if (
                    !fplValidationState ||
                    !fplValidationState.valid
                ) {
                    return false;
                }
                return (
                    fplValidationState.snapshot ===
                    createSnapshot()
                );}
            function updateValidationButton() {
                const button =
                    document.getElementById(
                        "fplValidateBtn"
                    );
                if (!button) return;
                const icon =
                    button.querySelector("i");
                const text =
                    button.querySelector(
                        ".fpl-validation-btn-text"
                    );
                button.classList.remove(
                    "bg-brand-600",
                    "hover:bg-brand-500",
                    "bg-emerald-600",
                    "hover:bg-emerald-500",
                    "bg-red-600",
                    "hover:bg-red-500"
                );
                if (!fplValidationState) {
                    button.classList.add(
                        "bg-brand-600",
                        "hover:bg-brand-500"
                    );
                    if (icon) {
                        icon.className =
                            "fa-solid fa-shield-check";
                    }
                    if (text) {
                        text.textContent =
                            "Kiểm tra";
                    }
                    return;
                }
                if (
                    fplValidationState.valid
                ) {
                    button.classList.add(
                        "bg-emerald-600",
                        "hover:bg-emerald-500"
                    );
                    if (icon) {
                        icon.className =
                            "fa-solid fa-circle-check";
                    }
                    if (text) {
                        text.textContent =
                            "Đã kiểm tra";
                    }
                    return;
                }
                button.classList.add(
                    "bg-red-600",
                    "hover:bg-red-500"
                );
                if (icon) {
                    icon.className =
                        "fa-solid fa-triangle-exclamation";
                }
                if (text) {
                    text.textContent =
                        "Kiểm tra lại";
                }}
            function escapeHTML(value) {
                return String(
                        value ?? ""
                    )
                    .replace(
                        /&/g,
                        "&amp;"
                    )
                    .replace(
                        /</g,
                        "&lt;"
                    )
                    .replace(
                        />/g,
                        "&gt;"
                    )
                    .replace(
                        /"/g,
                        "&quot;"
                    )
                    .replace(
                        /'/g,
                        "&#039;"
                    );}
            function getStatusUI(status) {
                if (
                    status === "pass"
                ) {
                    return {
                        row: "border-emerald-500/20 bg-emerald-500/5",
                        icon: "bg-emerald-500/15 text-emerald-400",
                        title: "text-emerald-400",
                        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                        symbol: "fa-circle-check",
                        label: "HỢP LỆ"
                    };
                }
                if (
                    status === "warning"
                ) {
                    return {
                        row: "border-amber-500/20 bg-amber-500/5",
                        icon: "bg-amber-500/15 text-amber-400",
                        title: "text-amber-400",
                        badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                        symbol: "fa-triangle-exclamation",
                        label: "CẢNH BÁO"
                    };
                }
                return {
                    row: "border-red-500/20 bg-red-500/5",
                    icon: "bg-red-500/15 text-red-400",
                    title: "text-red-400",
                    badge: "bg-red-500/10 text-red-400 border-red-500/20",
                    symbol: "fa-circle-exclamation",
                    label: "LỖI"
                };
            }
            function renderValidationModal(state) {
                const modal =
                    document.getElementById(
                        "fplValidationModal"
                    );
                const list =
                    document.getElementById(
                        "fplValidationList"
                    );
                const headline =
                    document.getElementById(
                        "fplValidationHeadline"
                    );
                const summary =
                    document.getElementById(
                        "fplValidationSummary"
                    );
                const icon =
                    document.getElementById(
                        "fplValidationSummaryIcon"
                    );
                if (
                    !modal ||
                    !list ||
                    !headline ||
                    !summary ||
                    !icon
                ) {
                    console.error(
                        "[FPL VALIDATION] Thiếu HTML modal."
                    );
                    return;
                }
                const errorCount =
                    state.errors.length;
                const warningCount =
                    state.warnings.length;
                if (
                    state.valid
                ) {
                    headline.textContent =
                        "FPL SẴN SÀNG";
                    headline.className =
                        "text-lg font-black text-emerald-400";
                    summary.textContent =
                        warningCount > 0 ?
                        `8 mục đã kiểm tra • ${warningCount} cảnh báo • Không có lỗi` :
                        "8 mục đã kiểm tra • Không có lỗi";
                    icon.className =
                        "w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xl";
                    icon.innerHTML =
                        '<i class="fa-solid fa-shield-check"></i>';
                } else {
                    headline.textContent =
                        "FPL CHƯA HỢP LỆ";
                    headline.className =
                        "text-lg font-black text-red-400";
                    summary.textContent =
                        `${errorCount} lỗi cần sửa` +
                        (
                            warningCount ?
                            ` • ${warningCount} cảnh báo` :
                            ""
                        );
                    icon.className =
                        "w-12 h-12 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center text-xl";
                    icon.innerHTML =
                        '<i class="fa-solid fa-triangle-exclamation"></i>';
                }
                list.innerHTML = "";
                state.results.forEach(
                    item => {
                        const ui =
                            getStatusUI(
                                item.status
                            );
                        const row =
                            document.createElement(
                                "button"
                            );
                        row.type =
                            "button";
                        row.className =
                            `
                    w-full
                    text-left
                    border
                    rounded-xl
                    p-3
                    ${ui.row}
                    hover:bg-slate-700/30
                    transition-colors
                    `;
                        row.innerHTML =`
                    <div class="flex items-start gap-3">
                        <div
                            class="w-8 h-8 rounded-lg ${ui.icon}
                            flex items-center justify-center shrink-0">
                            <i class="fa-solid ${ui.symbol}"></i>
                        </div>
                        <div class="min-w-0 flex-1">
                            <div
                                class="flex items-center justify-between gap-2">
                                <div
                                    class="font-bold text-xs text-white">
                                    Item ${item.item}
                                    <span
                                        class="text-slate-400 font-normal">
                                        — ${escapeHTML(item.name)}
                                    </span>
                                </div>
                                <span
                                    class="
                                    text-[9px]
                                    font-bold
                                    px-2
                                    py-0.5
                                    rounded-full
                                    border
                                    ${ui.badge}
                                    ">
                                    ${ui.label}
                                </span>
                            </div>
                            <div
                                class="
                                text-xs
                                ${ui.title}
                                mt-1
                                font-semibold
                                "
                            >
                                ${escapeHTML(item.message)}
                            </div>
                            ${
                                item.detail
                                    ?
                                    `
                                    <div
                                        class="
                                        text-[10px]
                                        text-slate-400
                                        mt-1
                                        font-mono
                                        break-words
                                        "
                                    >
                                        ${escapeHTML(item.detail)}
                                    </div>
                                    `
                                    :
                                    ""
                            }
                        </div>
                    </div>
                    `;
                        row.addEventListener(
                            "click",
                            function() {
                                if (
                                    item.targetId
                                ) {
                                    closeFplValidationModal();
                                    focusValidationTarget(
                                        item.targetId
                                    );
                                }
                            }
                        );
                        list.appendChild(
                            row
                        );
                    }
                );
                modal.classList.remove(
                    "hidden"
                );
            }
            function focusValidationTarget(
                id
            ) {
                const element =
                    document.getElementById(id);
                if (!element) {
                    return;
                }
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
                setTimeout(
                    function() {
                        element.focus();
                        element.classList.add(
                            "ring-2",
                            "ring-red-500",
                            "border-red-500"
                        );
                        setTimeout(
                            function() {
                                element.classList.remove(
                                    "ring-2",
                                    "ring-red-500",
                                    "border-red-500"
                                );
                            },1800
                        );},350
                );
            }
            function closeFplValidationModal() {
                const modal =
                    document.getElementById(
                        "fplValidationModal"
                    );
                if (modal) {
                    modal.classList.add(
                        "hidden"
                    );
                }
            }
            function safeToast(
                message,
                type = "info"
            ) {
                if (
                    typeof showToast ===
                    "function"
                ) {

                    showToast(
                        message,
                        type
                    );
                } else {
                    console.log(
                        `[${type}] ${message}`
                    );}}
            function requireValidatedCopyAndSend() {
                if (
                    !isValidationStillCurrent()
                ) {
                    safeToast(
                        "Vui lòng kiểm tra FPL trước khi Copy / Gửi.",
                        "warning"
                    );
                    validateFPL();
                    return;
                }
                if (
                    typeof copyCurrentPreview ===
                    "function"
                ) {
                    copyCurrentPreview();
                } else {
                    safeToast(
                        "Không tìm thấy hàm Copy FPL hiện tại.",
                        "error"
                    );}}
            function requireValidatedCopyAftn() {
                if (
                    !isValidationStillCurrent()
                ) {
                    safeToast(
                        "Vui lòng kiểm tra FPL trước khi Copy AFTN.",
                        "warning"
                    );
                    validateFPL();
                    return;
                }
                if (
                    typeof copyCurrentAftn ===
                    "function"
                ) {
                    copyCurrentAftn();
                } else {
                    safeToast(
                        "Chức năng Copy AFTN chưa tồn tại.",
                        "error"
                    );}}
            function installValidationListeners() {
                const ids = [
                    "callsign",
                    "rules",
                    "flightType",
                    "aircraftNumber",
                    "aircraftType",
                    "wakeCat",
                    "equipment",
                    "dep",
                    "time",
                    "speedUnit",
                    "speedValue",
                    "levelUnit",
                    "levelValue",
                    "route",
                    "dest",
                    "eet",
                    "altn1",
                    "altn2"
                ];
                ids.forEach(
                    id => {
                        const element =
                            document.getElementById(
                                id
                            );
                        if (!element) {
                            return;
                        }
                        if (
                            element.dataset.validationBound ===
                            "1"
                        ) {
                            return;
                        }
                        element.dataset.validationBound =
                            "1";
                        element.addEventListener(
                            "input",
                            invalidateFPLValidation
                        );
                        element.addEventListener(
                            "change",
                            invalidateFPLValidation
                        );
                    }
                );
                const item18 =
                    document.getElementById(
                        "item18Container"
                    );
                if (
                    item18 &&
                    item18.dataset.validationBound !==
                    "1"
                ) {
                    item18.dataset.validationBound =
                        "1";
                    item18.addEventListener(
                        "input",
                        invalidateFPLValidation
                    );
                    item18.addEventListener(
                        "change",
                        invalidateFPLValidation
                    );
                    const observer =
                        new MutationObserver(
                            invalidateFPLValidation
                        );
                    observer.observe(
                        item18, {
                            childList: true,
                            subtree: true
                        });}}
            function initializeValidation() {
                installValidationListeners();
                updateValidationButton();
                const modal =
                    document.getElementById(
                        "fplValidationModal"
                    );
                if (modal) {
                    modal.addEventListener(
                        "click",
                        function(event) {
                            if (
                                event.target === modal
                            ) {
                                closeFplValidationModal();
                            }});}}
            window.validateFPL =
                validateFPL;
            window.closeFplValidationModal =
                closeFplValidationModal;
            window.requireValidatedCopyAndSend =
                requireValidatedCopyAndSend;
            window.requireValidatedCopyAftn =
                requireValidatedCopyAftn;
            window.invalidateFPLValidation =
                invalidateFPLValidation;
            window.getFPLValidationState =
                function() {return fplValidationState;};
            if (document.readyState ===
                "loading") {document.addEventListener("DOMContentLoaded",initializeValidation);
            } else {initializeValidation();}
        })();