console.log("Flight Map JS loaded");
console.log("Leaflet:", typeof L);
const flightMap = L.map("flightMap", {
    zoomControl: true,
    attributionControl: false
});
flightMap.setView([15.5, 108.0], 5);
flightMap.createPane("baseMapPane");
flightMap.getPane("baseMapPane").style.zIndex = 200;
flightMap.createPane("flightRoutePane");
flightMap.getPane("flightRoutePane").style.zIndex = 400;
const flightRouteLayer =
    L.layerGroup().addTo(flightMap);
const segmentInfoLayer =
    L.layerGroup().addTo(flightMap);

let mapLabelsVisible = true;
let segmentInfoVisible = true;
fetch("map-data/countries.json")
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pane: "baseMapPane",
            style: {
                color: "#334155",
                weight: 0.8,
                fillColor: "#0f172a",
                fillOpacity: 1
            }
        }).addTo(flightMap);

    })
    .catch(error => {
        console.error(
            "Không thể tải countries.json:",
            error
        );
    });
fetch("map-data/coastline.json")
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pane: "baseMapPane",
            style: {
                color: "#475569",
                weight: 1,
                opacity: 1
            }
        }).addTo(flightMap);
    })
    .catch(error => {
        console.error(
            "Không thể tải coastline.json:",
            error
        );
    });
//Hàm số 1 Thống làm cho nó vừa map. Nó sẽ tự zoom sao cho route nằm trọn trong khung hình, không cần lo nó bị nhảy ra ngoài màn hình. Great
function tuvuamap(points) {
    if (!points || points.length === 0) {
        return;
    }
    const bounds = L.latLngBounds(
        points.map(point => [
            point.lat,
            point.lon
        ])
    );
    flightMap.fitBounds(bounds, {
        padding: [40, 40]
    });
}
//Hàm số 2 Thống tạo một điểm trên map. Là lấy waypoint đó. Hàm là laywaypoint, cái này nó dùng cho hai hàm dưới nữa, cần cẩn thận
function laywaypoint(
    code,
    data,
    role = "WAYPOINT"
) {
    return {
        code: code,
        lat: data.lat,
        lon: data.lon,
        name: data.name || code,
        type: data.type || "AIRPORT",
        role: role
    };
}
// Hàm số 3, lấy tọa độ sân bay. Hàm dùng cho cả sân bay đến và sân bay đi. Tên hàm là laysanbay Cẩn thận
function laysanbay(
    code,
    role = "WAYPOINT"
) {
    if (!code) {
        return null;
    }
    const airport =
        airportCoordinates[code];
    if (!airport) {
        console.warn(
            "[MAP] Airport not found:",
            code
        );

        return null;
    }
    return laywaypoint(
        code,
        airport,
        role
    );// Kết quả trả ra tọa độ và code sân bay
}
//Hàm số 4, lấy tên của waypoint. Cái này tạm thời sẽ trả về dạng ICAO, mình sẽ chỉnh sau. tên hàm là laytenwaypoint
function laytenwaypoint(code) {
    if (!code) {
        return null;
    }
    const cleanCode =
        code.trim().toUpperCase();
     if (waypointDatabase[cleanCode]) {
        return laywaypoint(
            cleanCode,
            waypointDatabase[cleanCode]
        );
    }
    if (waypointDatabase2[cleanCode]) {
        return laywaypoint(
            cleanCode,
            waypointDatabase2[cleanCode]
        );
    }
    const coordinatePoint =
        diembayqua(cleanCode);
    if (coordinatePoint) {
        return coordinatePoint;
    }
    console.warn(
        "[MAP] Waypoint not found:",
        cleanCode
    );
    return null;
}
//Hàm số 5 lấy các điểm bay qua, rất khó. Nó sẽ đọc từ route, sau đó lấy các điểm mà bay qua chứ không phải ký tự bất kỳ nào. hàm là diembayqua
function diembayqua(code) {
    if (!code) {return null;}
    const cleanCode =
        code.trim().toUpperCase();
    const match = cleanCode.match(
        /^(\d{2})(\d{2})([NS])(\d{3})(\d{2})([EW])$/
    );
    if (!match) {return null;}
    const latDeg = Number(match[1]);
    const latMin = Number(match[2]);
    const latDir = match[3];
    const lonDeg = Number(match[4]);
    const lonMin = Number(match[5]);
    const lonDir = match[6];
    let lat = latDeg + latMin / 60;
    let lon = lonDeg + lonMin / 60;
    if (latDir === "S") { lat = -lat; }
    if (lonDir === "W") { lon = -lon; }
    return {
        code: cleanCode, lat: lat, lon: lon, name: cleanCode, type: "COORDINATE", role: "WAYPOINT"};
}
// hàm số 6, Thống lấy các điểm trên hàm 5 rồi thì ta ráp nó thành một route hoàn chỉnh hàm làm routebayqua
function routebayqua(routeString) {
    if (!routeString) {
        return [];
    }
    const tokens = routeString
        .trim()
        .toUpperCase()
        .split(/\s+/);
    const ignoredTokens = [
        "DCT",
        "VFR",
        "IFR"
    ];
    const points = [];
    let i = 0;
    while (i < tokens.length) {
        let token = tokens[i];        
        if (ignoredTokens.includes(token)) {
            i++;
            continue;
        }
        token = token.split("/")[0];
        if (
            waypointDatabase[token] ||
            waypointDatabase2[token]
        ) {
            points.push(token);
            i++;
            continue;
        }
        if (i + 1 < tokens.length) {
            const combined =
                token + " " + tokens[i + 1];

            if (
                waypointDatabase[combined] ||
                waypointDatabase2[combined]
            ) {
                points.push(combined);
                i += 2;
                continue;
            }
        }
        points.push(token);
        i++;
    }
    return points;
}
// Hàm số 7 hàm tạo ra các điểm trên map từ dữ liệu route lấy ở hàm 6 hàm là vemapturoute
function vemapturoute(
    routeTokens
) {
    if (
        !routeTokens ||
        routeTokens.length === 0
    ) {
        return [];
    }
    const points = [];
    routeTokens.forEach(code => {
        const point =
            laytenwaypoint(code);
        if (point) {
            points.push(point);
        } else {
            console.warn(
                "[MAP] Route point skipped:",
                code
            );
        }
    });
    return points;
}
//Hàm phụ đổi ra Rad
function toRad(degrees) {
    return degrees * Math.PI / 180;
}
//Hàm phụ, đổi ra độ
function toDegrees(radians) {
    return radians * 180 / Math.PI;
}
function calculateSegmentDistance(from, to) {
    const R = 3440.065;
    const lat1 = toRad(from.lat);
    const lon1 = toRad(from.lon);
    const lat2 = toRad(to.lat);
    const lon2 = toRad(to.lon);
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );
    return R * c;
}
//Hàm 8 tính Bearing hàm tên là mapbearing
function mapbearing(from, to) {
    const lat1 =        toRad(from.lat);
    const lat2 =        toRad(to.lat);
    const dLon =        toRad(            to.lon - from.lon        );
    const y =        Math.sin(dLon) *        Math.cos(lat2);
    const x =        Math.cos(lat1) *        Math.sin(lat2) -        Math.sin(lat1) *        Math.cos(lat2) *        Math.cos(dLon);
    let bearing =        toDegrees(            Math.atan2(y, x)        );
    bearing =        (bearing + 360) % 360;
    return bearing;
}
function calculateRouteSegments(points) {
    const segments = [];
    if (
        !points ||
        points.length < 2
    ) {
        return segments;
    }
    for (
        let i = 0;
        i < points.length - 1;
        i++
    ) {
        const from =
            points[i];
        const to =
            points[i + 1];
        segments.push({
            from: from,
            to: to,
            distance:
                calculateSegmentDistance(
                    from,
                    to
                ),
            bearing:
                mapbearing(
                    from,
                    to
                )
        });
    }
    return segments;
}
function calculateTotalMapDistance(points) {
    const segments =
        calculateRouteSegments(
            points
        );
    return segments.reduce(
        (
            total,
            segment
        ) => total + segment.distance,
        0
    );
}
function renderMapPoint(point) {
    if (!point) {
        return null;
    }
    let radius = 3;
    let color = "#ffffff";
    let fillColor = "#0ea5e9";
    if (point.role === "DEP") {
        radius = 4;
        fillColor = "#0066a1";
    }
    if (point.role === "DEST") {
        radius = 4;
        fillColor = "#dc2626";
    }
      if (point.type === "COORDINATE") {
        radius = 3;
        fillColor = "#38bdf8";
    }
    const marker =
        L.circleMarker(
            [
                point.lat,
                point.lon
            ],
            {
                pane:
                    "flightRoutePane",

                radius:
                    radius,

                color:
                    color,

                weight:
                    2,

                fillColor:
                    fillColor,

                fillOpacity:
                    1
            }
        );
    if (mapLabelsVisible) {
        marker.bindTooltip(
            point.code,
            {
                permanent: true,

                direction: "top",

                offset: [0, -8]
            }
        );
    }
    marker.bindPopup(`
        <div style="
            min-width:160px;
            font-family:Arial,sans-serif;
        ">
            <strong>
                ${point.code}
            </strong>
            <br>
            ${point.name || ""}
            <br>
            <small>
                ${point.type}
            </small>
            <br><br>
            <small>
                ${point.lat.toFixed(4)},
                ${point.lon.toFixed(4)}
            </small>
        </div>
    `);
    marker.addTo(
        flightRouteLayer
    );
    return marker;
}
function renderFlightRouteLine(points) {
    if (
        !points ||
        points.length < 2
    ) {
        return null;
    }
    const routeCoordinates =
        points.map(point => [
            point.lat,
            point.lon
        ]);
    const routeLine =
        L.polyline(
            routeCoordinates,
            {
                pane: "flightRoutePane",
                color: "#94a3b8",
                weight: 2,
                opacity: 0.75,
                lineCap: "round",
                lineJoin: "round"
            }
        );
    routeLine.addTo(
        flightRouteLayer
    );
    return routeLine;
}
function renderSegmentInfo(points) {
    if (
        !segmentInfoVisible ||
        !points ||
        points.length < 2
    ) {
        return;
    }
    const segments =
        calculateRouteSegments(
            points
        );
    segments.forEach(
        segment => {
            const from =
                segment.from;
            const to =
                segment.to;
            // Midpoint
            const midLat =(from.lat + to.lat) / 2;
            const midLon =(from.lon + to.lon) / 2;
            const bearing = Math.round(segment.bearing)
                    .toString()
                    .padStart(
                        3,
                        "0"
                    );
            const distance =
                segment.distance
                    .toFixed(1);
            const label =
                L.marker(
                    [
                        midLat,
                        midLon
                    ],
                    {
                        pane:
                            "flightRoutePane",
                        interactive:
                            false,
                        icon:
                            L.divIcon({
                                className:
                                    "segment-info",
                                html: `
                                    <div class="
                                        bg-slate-900/90
                                        border
                                        border-slate-600
                                        rounded-lg
                                        px-2
                                        py-1
                                        text-[10px]
                                        text-white
                                        font-mono
                                        shadow-lg
                                        whitespace-nowrap
                                    ">
                                        ${bearing}°
                                        ·
                                        ${distance} NM
                                    </div>
                                `,
                                iconSize:
                                    null
                            })
                    }
                );
            label.bindTooltip(
                `
                <b>
                    ${from.code}
                    →
                    ${to.code}
                </b>
                <br>
                BRG:
                ${bearing}°
                <br>
                DIST:
                ${distance} NM
                `
            );
            label.addTo(
                segmentInfoLayer
            );
        }
    );
}
function updateFlightMap(points) {
    flightRouteLayer.clearLayers();
    segmentInfoLayer.clearLayers();
    if (!Array.isArray(points)) {
        points = [];
    }
    updateMapSummary(points);
    // Không có điểm → map chờ
    if (points.length === 0) {
        console.log("[MAP] Waiting for points...");
        return;
    }
    points.forEach(point => {
        renderMapPoint(point);
    });
    if (points.length >= 2) {
        renderFlightRouteLine(points);
        renderSegmentInfo(points);
        tuvuamap(points);
    } else {
        console.log(
            "[MAP] Single point — waiting for next point"
        );
    }updateMapSummary(points);
}
function updateMapSummary(points) {
    const segmentCount =
        Math.max(
            0,
            points.length - 1
        );
    const totalDistance =
        calculateTotalMapDistance(
            points
        );
    const segmentElement =
        document.getElementById(
            "mapSegmentCount"
        );
    const distanceElement =
        document.getElementById(
            "mapTotalDistance"
        );
    if (segmentElement) {
        segmentElement.textContent =
            `SEG: ${segmentCount}`;
    }
    if (distanceElement) {

        distanceElement.textContent =
            `DIST: ${totalDistance.toFixed(1)} NM`;
    }
}
function resetFlightMapView() {
    updateMapFromFPL();
}
function toggleMapLabels() {
    mapLabelsVisible =
        !mapLabelsVisible;
    updateMapFromFPL();
}
function toggleSegmentInfo() {
    segmentInfoVisible =
        !segmentInfoVisible;
    updateMapFromFPL();
}
function updateMapFromFPL() {
    const depCode =
        document
            .getElementById("dep")
            ?.value
            .trim()
            .toUpperCase();
    const routeString =
        document
            .getElementById("route")
            ?.value
            .trim()
            .toUpperCase();
     const destCode =
        document
            .getElementById("dest")
            ?.value
            .trim()
            .toUpperCase() || "";
    console.log(
        "[MAP] DEP:",
        depCode
    );
    console.log(
        "[MAP] ROUTE:",
        routeString
    );
    console.log(
        "[MAP] DEST:",
        destCode
    );
    const points = [];
    const depPoint =
        laysanbay(
            depCode,
            "DEP"
        );
    if (depPoint) {
        points.push(depPoint);
    }
    const routeTokens =
        routebayqua(
            routeString
        );
    const routePoints =
        vemapturoute(
            routeTokens
        );
    points.push(
        ...routePoints
    );
    const destPoint =
        laysanbay(
            destCode,
            "DEST"
        );
    if (destPoint) {
        points.push(destPoint);
    }
    console.log(
        "[MAP] Final points:",
        points
    );
    updateFlightMap(
        points
    );
}
function toggleMapFullscreen() {
    const mapContainer =
        document.getElementById("flightMap");
    if (!mapContainer) {
        return;
    }
    if (!document.fullscreenElement) {
        mapContainer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
const fullscreenButton =
    document.getElementById("mapFullscreenBtn");
if (fullscreenButton) {
    fullscreenButton.addEventListener(
        "click",
        toggleMapFullscreen
    );
}
document.addEventListener(
    "fullscreenchange",
    () => {
        setTimeout(() => {
            flightMap.invalidateSize();
        }, 100);
    }
);
let mapUpdateTimer = null;
function scheduleMapUpdate() {
    clearTimeout(mapUpdateTimer);
    mapUpdateTimer = setTimeout(() => {
        updateMapFromFPL();
    }, 100);
}
document
    .getElementById("dep")
    ?.addEventListener(
        "input",
        scheduleMapUpdate
    );
document
    .getElementById("dest")
    ?.addEventListener(
        "input",
        scheduleMapUpdate
    );
document
    .getElementById("route")
    ?.addEventListener(
        "input",
        scheduleMapUpdate
    );
console.log("[MAP] INPUT LISTENERS ATTACHED");
updateMapFromFPL();