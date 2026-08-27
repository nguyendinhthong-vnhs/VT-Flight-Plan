// HỆ THỐNG TÍNH TOÁN TRUNG TÂM
        // 5.Hàm định dạng tốc độ
        function formatSpeed() {
            const unit = document.getElementById("speedUnit").value;
            let value = document.getElementById("speedValue").value.trim().replace(/\D/g, '');
            if (!value) return "N0120";
            if (unit === "N") return "N" + value.padStart(4, "0");
            if (unit === "K") return "K" + value.padStart(4, "0");
            if (unit === "M") return "M" + value.padStart(3, "0");
            return "N" + value.padStart(4, "0");
        }
        // 6.Hàm định dạng độ cao
        function formatLevel() {
            const unit = document.getElementById("levelUnit").value;
            let value = document.getElementById("levelValue").value.trim().toUpperCase();
            if (unit === "VFR") return "VFR";
            value = value.replace(/\D/g, '');
            if (!value) return "A045";
            if (unit === "F") return "F" + value.padStart(3, "0");
            if (unit === "A") return "A" + value.padStart(3, "0");
            if (unit === "M") return "M" + value.padStart(4, "0");
            return "A" + value.padStart(3, "0");
        }
        // 7.Hàm tính khoảng cách
        function calculateDistanceNM(lat1, lon1, lat2, lon2) {
            const R = 6371; // Earth radius km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return (R * c) * 0.539957; // Chuyển đổi sang NM (Nautical Miles)
        }
        // 8.Hàm lấy thông tin tọa độ của một điểm bất kỳ
        function getPointCoordinates(code) {
            code = code.trim().toUpperCase();
            // 8.1Kiểm tra trong danh sách sân bay (airportCoordinates)
            if (typeof airportCoordinates !== 'undefined' && airportCoordinates[code]) {
                return {
                    lat: airportCoordinates[code].lat,
                    lon: airportCoordinates[code].lon
                };
            }
            // 8.2Kiểm tra trong cơ sở dữ liệu waypoint (waypointDatabase)
            if (typeof waypointDatabase !== 'undefined' && waypointDatabase[code]) {
                return {
                    lat: waypointDatabase[code].lat,
                    lon: waypointDatabase[code].lon
                };
            }
            // 8.3Kiểm tra trong cơ sở dữ liệu waypoint2 (waypointDatabase2)
            if (typeof waypointDatabase2 !== 'undefined' && waypointDatabase2[code]) {
                return {
                    lat: waypointDatabase2[code].lat,
                    lon: waypointDatabase2[code].lon
                };
            }
            // 8.4Nếu không tìm thấy tọa độ
            return null;
        }
        // 9. QUAN TRỌNG: Tự động phân tích chuỗi Route và cộng dồn khoảng cách các chặng
        function calculateTotalRouteDistance(depAirport, routeString, destAirport) {
            let totalDistance = 0;
            let pointsList = [];
            // 9.1 Thêm điểm khởi hành (Departure) vào đầu danh sách
            if (depAirport) {
                pointsList.push(depAirport.trim().toUpperCase());
            }
            // 9.2 Xử lý chuỗi route (bóc tách các điểm sau chữ DCT)
            if (routeString && routeString.trim() !== "") {
                // 9.2.1 Tách các từ trong route, lọc bỏ khoảng trắng thừa
                let tokens = routeString.toUpperCase().split(/\s+/);
                for (let i = 0; i < tokens.length; i++) {
                    // Nếu gặp từ "DCT", điểm nằm ngay sau đó là waypoint trung gian
                    if (tokens[i] === "DCT" && i + 1 < tokens.length) {
                        pointsList.push(tokens[i + 1]);
                        i++; // Bỏ qua phần tử tiếp theo vì đã lấy
                    } else if (tokens[i] !== "DCT" && tokens[i] !== "") {
                        // Trường hợp người dùng gõ trực tiếp tên điểm mà không có chữ DCT
                        pointsList.push(tokens[i]);
                    }
                }
            }
            // 9.3 Thêm điểm đến (Destination) vào cuối danh sách
            if (destAirport) {
                pointsList.push(destAirport.trim().toUpperCase());
            }
            // 9.4 Duyệt qua từng cặp điểm liên tiếp để tính khoảng cách và cộng dồn
            let routeSegmentsLog = []; // Dùng để kiểm tra log nếu cần
            for (let i = 0; i < pointsList.length - 1; i++) {
                let p1Code = pointsList[i];
                let p2Code = pointsList[i + 1];
                let coord1 = getPointCoordinates(p1Code);
                let coord2 = getPointCoordinates(p2Code);
                if (coord1 && coord2) {
                    let dist = calculateDistanceNM(coord1.lat, coord1.lon, coord2.lat, coord2.lon);
                    totalDistance += dist;
                    routeSegmentsLog.push(`${p1Code} -> ${p2Code}: ${dist.toFixed(1)} NM`);
                } else {
                    console.warn(`Không tìm thấy tọa độ cho chặng: ${p1Code} hoặc ${p2Code}`);
                }
            }
            // 9.5 Trả về tổng khoảng cách làm tròn
            return {
                total: Math.round(totalDistance * 10) / 10, // Làm tròn 1 chữ số thập phân
                segments: routeSegmentsLog
            };
        }
        // 10. QUAN TRỌNG: Hàm tính tổng khoảng cách hành trình (quan trọng)
        function calculateTotalRouteDistance(depAirport, routeString, destAirport) {
            let totalDistance = 0;
            let pointsList = [];
            // 10.1. Thêm điểm khởi hành (Departure)
            if (depAirport) {
                pointsList.push(depAirport.trim().toUpperCase());
            }
            // 10.2. Bóc tách các điểm trung gian từ chuỗi Route
if (routeString && routeString.trim() !== "") {

    const ignoredTokens = [
        "DCT",
        "VFR",
        "IFR"
    ];

    const tokens = routeString
        .trim()
        .toUpperCase()
        .split(/\s+/);

    for (let token of tokens) {

        // Trường hợp: LITAM/N0120A060
        // hoặc CSN/N0120A060
        if (token.includes("/")) {
            token = token.split("/")[0];
        }

        // Bỏ keyword
        if (ignoredTokens.includes(token)) {
            continue;
        }

        // Chỉ thêm token hợp lệ
        if (token.length > 0) {
            pointsList.push(token);
        }
    }
}
            // 10.3. Thêm điểm đến (Destination)
            if (destAirport) {
                pointsList.push(destAirport.trim().toUpperCase());
            }
            // 10.4. Hàm phụ trợ: Chuyển đổi chuỗi tọa độ ICAO dạng XXXXXNYYYYYE sang số thập phân (lat, lon) ---
            function parseICAOCoordinate(coordStr) {
                // Chuẩn hóa chuỗi
                // Định dạng tiêu chuẩn hàng không
                let match = coordStr.match(/^(\d{2,4})([NS])(\d{3,5})([WE])$/);
                if (!match) return null;
                let latVal = match[1];
                let latDir = match[2];
                let lonVal = match[3];
                let lonDir = match[4];
                let latDeg = parseInt(latVal.substring(0, 2), 10);
                let latMin = latVal.length > 2 ? parseInt(latVal.substring(2), 10) / (latVal.length === 4 ? 60 : 60) : 0; // Hỗ trợ linh hoạt độ phút hoặc độ phút giây
                let lat = latDeg + (latVal.length === 4 ? (parseInt(latVal.substring(2), 10) / 60) : (parseInt(latVal.substring(2, 4), 10) / 60));
                if (latDir === 'S') lat = -lat;
                let lonDeg = parseInt(lonVal.substring(0, 3), 10);
                let lon = lonDeg + (lonVal.length === 5 ? (parseInt(lonVal.substring(3), 10) / 60) : (parseInt(lonVal.substring(3), 10) / 60));
                if (lonDir === 'W') lon = -lon;
                return {
                    lat: lat,
                    lon: lon
                };
            }
            // 10.5. Hàm phụ trợ: Lấy tọa độ từ airportCoordinates, waypointDatabase, waypointDatabase2 hoặc chuỗi ICAO trực tiếp
            function getCoord(code) {
                if (!code) return null;
                code = code.trim().toUpperCase();
                // trường hợp 1: Kiểm tra trong airportCoordinates
                if (typeof airportCoordinates !== 'undefined' && airportCoordinates[code]) {
                    return {
                        lat: airportCoordinates[code].lat,
                        lon: airportCoordinates[code].lon
                    };
                }
                // trường hợp 2: Kiểm tra trong waypointDatabase
                if (typeof waypointDatabase !== 'undefined' && waypointDatabase[code]) {
                    return {
                        lat: waypointDatabase[code].lat,
                        lon: waypointDatabase[code].lon
                    };
                }
                // trường hợp 3: Kiểm tra trong waypointDatabase2 (nếu có)
                if (typeof waypointDatabase2 !== 'undefined' && waypointDatabase2[code]) {
                    let info = waypointDatabase2[code];
                    // Nếu waypointDatabase2 lưu sẵn lat/lon dạng số
                    if (typeof info.lat === 'number' && typeof info.lon === 'number') {
                        return {
                            lat: info.lat,
                            lon: info.lon
                        };
                    }
                    // Nếu waypointDatabase2 lưu lat dưới dạng chuỗi ICAO
                    if (typeof info.lat === 'string') {
                        let parsed = parseICAOCoordinate(info.lat);
                        if (parsed) return parsed;
                    }
                }
                // trường hợp 4: Nếu mã truyền vào chính là một chuỗi tọa độ ICAO trực tiếp trên trường Route
                let directParsed = parseICAOCoordinate(code);
                if (directParsed) {
                    return directParsed;
                }
                return null;
            }
            // 10.6. Cộng dồn khoảng cách các chặng liên tiếp
            for (let i = 0; i < pointsList.length - 1; i++) {
                let coord1 = getCoord(pointsList[i]);
                let coord2 = getCoord(pointsList[i + 1]);
                if (coord1 && coord2) {
                    let dist = calculateDistanceNM(coord1.lat, coord1.lon, coord2.lat, coord2.lon);
                    totalDistance += dist;
                } else {
                    console.warn(`Không tìm thấy tọa độ cho chặng: ${pointsList[i]} -> ${pointsList[i + 1]}`);
                }
            }
            return totalDistance;
        }
        // 11. Hàm tính tổng EET
        function calculateEET() {
            const dep = document.getElementById("dep") ? document.getElementById("dep").value.trim().toUpperCase() : "";
            const dest = document.getElementById("dest") ? document.getElementById("dest").value.trim().toUpperCase() : "";
            const route = document.getElementById("route") ? document.getElementById("route").value : "";
            const speedUnit = document.getElementById("speedUnit") ? document.getElementById("speedUnit").value : "K";
            const speedRawInput = document.getElementById("speedValue") ? document.getElementById("speedValue").value : "";
            const speedRaw = parseInt(speedRawInput);
            const badge = document.getElementById("distanceBadge");
            const autoEetBadge = document.getElementById("autoEetBadge");
            // Kiểm tra điều kiện đầu vào cơ bản
            if (!dep || !dest || !speedRaw || speedRaw <= 0) {
                if (badge) badge.classList.add("hidden");
                if (autoEetBadge) autoEetBadge.classList.add("hidden");
                return;
            }
            // Chuyển đổi tốc độ sang chuẩn Knots
            let speedKT = speedRaw;
            if (speedUnit === "K") {
                // Giả định đơn vị khác
                speedKT = speedRaw * 0.539957;
            }
            // THAY THẾ QUAN TRỌNG: Sử dụng hàm tính tổng khoảng cách hành trình qua các waypoint
            const distanceNM = calculateTotalRouteDistance(dep, route, dest);
            // Hiển thị tổng khoảng cách lên Badge giao diện
            if (badge) {
                badge.textContent = `${Math.round(distanceNM)} NM`;
                badge.classList.remove("hidden");
            }
            // Tính toán thời gian bay (EET) dựa trên tổng khoảng cách mới
            if (speedKT > 0) {
                const hours = distanceNM / speedKT;
                const totalMinutes = Math.round(hours * 60);
                const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
                const mm = String(Math.round(totalMinutes % 60)).padStart(2, "0");
                // Chỉ tự động cập nhật nếu người dùng CHƯA tự sửa tay
                if (typeof isEETManuallyEdited !== 'undefined' && !isEETManuallyEdited) {
                    const eetField = document.getElementById("eet");
                    if (eetField) {
                        eetField.value = hh + mm;
                        if (autoEetBadge) autoEetBadge.classList.remove("hidden");
                    }
                }
            }
        }
        
        // 12. Hàm chuyển đổi số thập phân sang định dạng Độ, Phút hàng không (VD: 10° 22.0' N)
        function formatCoordinate(decimal, isLat) {
            if (decimal === undefined || decimal === null) return "";
            let absolute = Math.abs(decimal);
            let degrees = Math.floor(absolute);
            let minutes = ((absolute - degrees) * 60).toFixed(2); // Lấy 2 chữ số thập phân cho phút
            let direction = "";
            if (isLat) {
                direction = decimal >= 0 ? "N" : "S";
            } else {
                direction = decimal >= 0 ? "E" : "W";
            }
            return `${degrees}° ${minutes}' ${direction}`;
        }