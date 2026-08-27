console.log("Export JS loaded");
function getExportPlans(fromDate, toDate, callsign = "") {
    if (!Array.isArray(plans)) {
        console.error(
            "[EXPORT] plans không tồn tại hoặc không phải array"
        );
        return [];
    }
    return plans
        .filter(plan => {
            const dateMatch =
                plan.createdDate >= fromDate &&
                plan.createdDate <= toDate;
            const callsignMatch =
                !callsign ||
                plan.callsign === callsign;
            return dateMatch && callsignMatch;
        })
        // Mới nhất trước
        .sort((a, b) => {
            return (
                (b.createdAt || 0) -
                (a.createdAt || 0)
            );
        });}
function getAvailableCallsigns() {
    return [...new Set(
        plans
            .map(plan => plan.callsign)
            .filter(Boolean)
    )].sort();}
function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
function formatExportDate(dateString) {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length !== 3) {
        return dateString;
    }
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
function createFlightPlanHTML(plan, index) {
    const callsign = escapeHTML(plan.callsign || "—");
    const aircraft = escapeHTML(plan.aircraftType || "—");
    const aircraftNumber =
        escapeHTML(plan.aircraftNumber || "—");
    const rules =
        escapeHTML(plan.rules || "—");
    const flightType =
        escapeHTML(plan.flightType || "—");
    const wakeCat =
        escapeHTML(plan.wakeCat || "—");
    const equipment =
        escapeHTML(plan.equipment || "—");
    const dep =
        escapeHTML(plan.dep || "—");
    const time =
        escapeHTML(plan.time || "—");
    const dest =
        escapeHTML(plan.dest || "—");
    const eet =
        escapeHTML(plan.eet || "—");
    const speed =
        escapeHTML(plan.speed || "—");
    const level =
        escapeHTML(plan.level || "—");
    const route =
        escapeHTML(plan.route || "—");
    const altn1 =
        escapeHTML(plan.altn1 || "—");
    const altn2 =
        escapeHTML(plan.altn2 || "—");
    const pob =
        escapeHTML(plan.pob || "—");
    const pic =
        escapeHTML(plan.pic || "—");
    const color =
        escapeHTML(plan.color || "—");
    const other =
        escapeHTML(plan.other || "—");
    const createdDate =
        formatExportDate(plan.createdDate);
    return `
        <section class="fpl-card">
            <!-- FPL HEADER -->
            <div class="fpl-header">
                <div>
                    <div class="fpl-title">
                        FLIGHT PLAN
                    </div>
                    <div class="fpl-callsign">
                        ${callsign}
                    </div>
                </div>
                <div class="fpl-number">
                    FPL ${String(index).padStart(2, "0")}
                </div>
            </div>
            <!-- BASIC INFORMATION -->
            <div class="info-grid">
                <div class="field">
                    <div class="label">RULE</div>
                    <div class="value">${rules}</div>
                </div>
                <div class="field">
                    <div class="label">TYPE</div>
                    <div class="value">${flightType}</div>
                </div>
                <div class="field">
                    <div class="label">AIRCRAFT</div>
                    <div class="value">
                        ${aircraftNumber} × ${aircraft}
                    </div>
                </div>
                <div class="field">
                    <div class="label">WTC</div>
                    <div class="value">${wakeCat}</div>
                </div>
            </div>
            <!-- ROUTE INFORMATION -->
            <div class="section-title">
                FLIGHT INFORMATION
            </div>
            <div class="info-grid four">
                <div class="field">
                    <div class="label">DEP</div>
                    <div class="value strong">${dep}</div>
                </div>
                <div class="field">
                    <div class="label">TIME</div>
                    <div class="value strong">${time}</div>
                </div>
                <div class="field">
                    <div class="label">DEST</div>
                    <div class="value strong">${dest}</div>
                </div>
                <div class="field">
                    <div class="label">EET</div>
                    <div class="value strong">${eet}</div>
                </div>
            </div>
            <div class="info-grid four">
                <div class="field">
                    <div class="label">SPEED</div>
                    <div class="value">${speed}</div>
                </div>
                <div class="field">
                    <div class="label">LEVEL</div>
                    <div class="value">${level}</div>
                </div>
                <div class="field">
                    <div class="label">EQUIPMENT</div>
                    <div class="value">${equipment}</div>
                </div>
                <div class="field">
                    <div class="label">FILLED DATE</div>
                    <div class="value">${createdDate}</div>
                </div>
            </div>
            <!-- ROUTE -->
            <div class="section-title">
                ROUTE
            </div>
            <div class="route-box">
                ${route}
            </div>
            <!-- ALTERNATES -->
            <div class="info-grid four">
                <div class="field">
                    <div class="label">ALTN 1</div>
                    <div class="value">${altn1}</div>
                </div>
                <div class="field">
                    <div class="label">ALTN 2</div>
                    <div class="value">${altn2}</div>
                </div>
                <div class="field">
                    <div class="label">POB</div>
                    <div class="value">${pob}</div>
                </div>
                <div class="field">
                    <div class="label">PIC</div>
                    <div class="value">${pic}</div>
                </div>
            </div>
            <!-- ITEM 18 -->
            <div class="section-title">
                ITEM 18
            </div>
            <div class="item18-box">
                ${other}
            </div>
            <!-- SUPPLEMENTARY -->
            <div class="supplementary">
                <span>
                    <b>COLOR:</b> ${color}
                </span>
            </div>
        </section>
    `;
}
function generateReportHTML(exportPlans, fromDate, toDate) {
    const reportDate =
        new Date().toLocaleString("vi-VN");
    const cards = exportPlans.length
        ? exportPlans
            .map((plan, index) =>
                createFlightPlanHTML(plan, index + 1)
            )
            .join("")
        : `
            <div class="empty-state">
                Không tìm thấy Flight Plan trong khoảng thời gian đã chọn.
            </div>
        `;
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Flight Plan Report</title>
<style>
@page {
    size: A4;
    margin: 10mm;
}
/* --------------------------------------------------------
   GLOBAL
-------------------------------------------------------- */
* {
    box-sizing: border-box;
}
body {
    margin: 0;
    font-family:
        Arial,
        Helvetica,
        sans-serif;
    font-size: 9pt;
    color: #1f2937;
    background: #ffffff;}
/* --------------------------------------------------------
   REPORT HEADER
-------------------------------------------------------- */
.report-header {
    border-bottom: 2px solid #111827;
    padding-bottom: 8px;
    margin-bottom: 10px;
}
.report-title {
    font-size: 17pt;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #111827;
}
.report-subtitle {
    margin-top: 3px;
    font-size: 9pt;
    color: #4b5563;
}
.report-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 7px;
    font-size: 8pt;
    color: #374151;
}
/* --------------------------------------------------------
   SUMMARY
-------------------------------------------------------- */
.summary {
    display: flex;
    gap: 20px;
    padding: 6px 8px;
    margin-bottom: 10px;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    font-size: 8.5pt;
}
.summary strong {
    color: #111827;
}
/* --------------------------------------------------------
   FPL CARD
-------------------------------------------------------- */
.fpl-card {
    border: 1px solid #9ca3af;
    margin-bottom: 9px;
    page-break-inside: avoid;
    break-inside: avoid;
}
/* --------------------------------------------------------
   FPL HEADER
-------------------------------------------------------- */
.fpl-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 9px;
    background: #f3f4f6;
    border-bottom: 1px solid #9ca3af;
}
.fpl-title {
    font-size: 10pt;
    font-weight: 700;
    color: #6b7280;
    letter-spacing: 0.8px;
}
.fpl-callsign {
    margin-top: 1px;
    font-size: 13pt;
    font-weight: 700;
    color: #111827;
}
.fpl-number {
    font-size: 8pt;
    font-weight: 700;
    color: #4b5563;
}
/* --------------------------------------------------------
   INFORMATION GRID
-------------------------------------------------------- */
.info-grid {
    display: grid;
    grid-template-columns:
        repeat(4, 1fr);
    border-bottom: 1px solid #d1d5db;
}
.info-grid.four {
    grid-template-columns:
        repeat(4, 1fr);
}
.field {
    min-width: 0;
    padding: 5px 8px;
    border-right: 1px solid #d1d5db;
}
.field:last-child {
    border-right: none;
}
.label {
    font-size: 6.5pt;
    font-weight: 700;
    color: #6b7280;
    letter-spacing: 0.4px;
    text-transform: uppercase;
}
.value {
    margin-top: 2px;
    font-size: 9pt;
    font-weight: 500;
    color: #111827;
    overflow-wrap: anywhere;
}
.value.strong {
    font-weight: 700;
}
/* --------------------------------------------------------
   SECTION TITLE
-------------------------------------------------------- */
.section-title {
    padding: 4px 8px;
    background: #f9fafb;
    border-bottom: 1px solid #d1d5db;
    font-size: 6.5pt;
    font-weight: 700;
    letter-spacing: 0.7px;
    color: #6b7280;
}
.route-box {
    padding: 6px 8px;
    font-family:
        "Helvetica",
        monospace;
    font-size: 11pt;
    line-height: 1.4;
    overflow-wrap: anywhere;
    border-bottom: 1px solid #d1d5db;
}
.item18-box {
    padding: 5px 8px;
    font-family:
        "Helvetica",
        monospace;
    font-size: 11pt;
    line-height: 1.35;
    overflow-wrap: anywhere;
    border-bottom: 1px solid #d1d5db;
}
.supplementary {
    padding: 4px 8px;
    font-size: 7.5pt;
    color: #4b5563;
}
.empty-state {
    padding: 30px;
    text-align: center;
    border: 1px solid #d1d5db;
    color: #6b7280;
}
@media print {
    body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
    .fpl-card {
        page-break-inside: avoid;
        break-inside: avoid;
    }
}
</style>
</head>
<body>
<!-- REPORT HEADER -->
<header class="report-header">
    <div class="report-title">
        FLIGHT PLAN REPORT
    </div>
    <div class="report-subtitle">
        Trung tâm Chỉ huy - Điều hành bay
    </div>
    <div class="report-meta">
        <span>
            Period:
            <strong>
                ${formatExportDate(fromDate)}
                —
                ${formatExportDate(toDate)}
            </strong>
        </span>
        <span>
            Exported:
            <strong>${reportDate}</strong>
        </span>
    </div>
</header>
<!-- SUMMARY -->
<div class="summary">
    <span>
        TOTAL FPL:
        <strong>${exportPlans.length}</strong>
    </span>
    <span>
        PERIOD:
        <strong>
            ${formatExportDate(fromDate)}
            —
            ${formatExportDate(toDate)}
        </strong>
    </span>
</div>
<!-- FLIGHT PLANS -->
${cards}
</body>
</html>
`;
}
function generateExportText(exportPlans, fromDate, toDate) {
    let text = "";
    text += "============================================================\n";
    text += "                 FLIGHT PLAN REPORT\n";
    text += "============================================================\n";
    text += `PERIOD: ${fromDate} - ${toDate}\n`;
    text += `TOTAL : ${exportPlans.length} FPL\n`;
    text += "============================================================\n\n";
    if (exportPlans.length === 0) {
        text += "NO FLIGHT PLANS FOUND.\n";
        return text;
    }
    exportPlans.forEach((plan, index) => {
        const createdDate =
            formatExportDate(plan.createdDate);
        text += `[${String(index + 1).padStart(2, "0")}] `;
        text += `${plan.callsign || "—"} | `;
        text += `${plan.dep || "—"} → `;
        text += `${plan.dest || "—"} | `;
        text += `${plan.time || "—"} | `;
        text += `EET ${plan.eet || "—"}\n`;
        text += `     ${plan.aircraftNumber || "—"} × `;
        text += `${plan.aircraftType || "—"} | `;
        text += `${plan.speed || "—"} | `;
        text += `${plan.level || "—"}\n`;
        text += `     ROUTE: ${plan.route || "—"}\n`;
        text += `     ITEM18: ${plan.other || "—"}\n`;
        text += `     DATE: ${createdDate}\n`;
        text += "\n";
    });
    return text;
}
function generateExportFilename(fromDate, toDate, extension) {
    if (fromDate === toDate) {
        return `FPL_${fromDate}.${extension}`;
    }
    return `FPL_${fromDate}_to_${toDate}.${extension}`;
}
function downloadFile(content, filename, mimeType) {
    const blob = new Blob(
        [content],        {
            type: mimeType
        }
    );
    const url =
        URL.createObjectURL(blob);
    const link =
        document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
function exportTXT(exportPlans, fromDate, toDate) {
    const text =
        generateExportText(
            exportPlans,
            fromDate,
            toDate
        );
    const filename =
        generateExportFilename(
            fromDate,
            toDate,
            "txt"
        );
    downloadFile(
        "\uFEFF" + text,
        filename,
        "text/plain;charset=utf-8"
    );
}
function exportDOC(exportPlans, fromDate, toDate) {
    const html =
        generateReportHTML(
            exportPlans,
            fromDate,
            toDate
        );
    const filename =
        generateExportFilename(
            fromDate,
            toDate,
            "doc"
        );
    downloadFile(
        "\uFEFF" + html,
        filename,
        "application/msword"
    );
}
function exportPDF(exportPlans, fromDate, toDate) {
    const html =
        generateReportHTML(
            exportPlans,
            fromDate,
            toDate
        );
    const printWindow =
        window.open(
            "",
            "_blank",
            "width=900,height=700"
        );
    if (!printWindow) {
        alert(
            "Không thể mở cửa sổ PDF.\n" +
            "Hãy cho phép popup của trình duyệt."
        );
        return;
    }
    printWindow.document.open();
    printWindow.document.write(
        html
    );
    printWindow.document.close();
    printWindow.onload = function () {
        setTimeout(
            function () {
                printWindow.focus();
                printWindow.print();
            },
            300
        );
    };
}
function openExportDialog() {
    if (
        document.getElementById(
            "exportDialog"
        )
    ) {
        return;
    }
    const today =
        new Date()
            .toISOString()
            .split("T")[0];
    const overlay =
        document.createElement("div");
    overlay.id =
        "exportDialog";
    overlay.className =
        "fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4";
    overlay.innerHTML = `
        <div class="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl">
            <div class="flex items-center justify-between px-5 py-4 border-b border-slate-700">
                <h3 class="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <i class="fa-solid fa-file-export text-brand-400"></i>
                    Xuất Danh Sách FPL
                </h3>
                <button
                    type="button"
                    onclick="closeExportDialog()"
                    class="text-slate-400 hover:text-white text-lg"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="p-5 space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1">
                        Khoảng thời gian
                    </label>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[11px] text-slate-500 mb-1">
                                Từ ngày
                            </label>
                            <input
                                type="date"
                                id="exportFromDate"
                                value="${today}"
                                class="w-full bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                        </div>
                        <div>
                            <label class="block text-[11px] text-slate-500 mb-1">
                                Đến ngày
                            </label>
                            <input
                                type="date"
                                id="exportToDate"
                                value="${today}"
                                class="w-full bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                        </div>
                    </div>
                </div>
<!-- CALLSIGN FILTER -->
<div>
    <label class="block text-xs font-semibold text-slate-300 mb-2">
        Lọc theo Callsign
    </label>
    <select
        id="exportCallsign"
        onchange="updateExportPreview()"
        class="w-full bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
        <option value="">
            Tất cả Callsign
        </option>
        ${getAvailableCallsigns()
            .map(callsign => `
                <option value="${escapeHTML(callsign)}">
                    ${escapeHTML(callsign)}
                </option>
            `)
            .join("")
        }
    </select>
</div>
                <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-2">
                        Định dạng xuất
                    </label>
                    <div class="grid grid-cols-3 gap-2">
                        <label class="cursor-pointer">
                            <input
                                type="radio"
                                name="exportFormat"
                                value="txt"
                                checked
                                class="sr-only peer"
                            >
                            <div class="text-center px-3 py-3 rounded-xl border border-slate-600 bg-slate-900 peer-checked:border-brand-500 peer-checked:bg-brand-500/10 transition">
                                <i class="fa-solid fa-file-lines text-lg mb-1"></i>
                                <div class="text-xs font-semibold">
                                    TXT
                                </div>
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input
                                type="radio"
                                name="exportFormat"
                                value="doc"
                                class="sr-only peer"
                            >
                            <div class="text-center px-3 py-3 rounded-xl border border-slate-600 bg-slate-900 peer-checked:border-brand-500 peer-checked:bg-brand-500/10 transition">
                                <i class="fa-solid fa-file-word text-lg mb-1"></i>
                                <div class="text-xs font-semibold">
                                    DOC
                                </div>
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input
                                type="radio"
                                name="exportFormat"
                                value="pdf"
                                class="sr-only peer"
                            >
                            <div class="text-center px-3 py-3 rounded-xl border border-slate-600 bg-slate-900 peer-checked:border-brand-500 peer-checked:bg-brand-500/10 transition">
                                <i class="fa-solid fa-file-pdf text-lg mb-1"></i>
                                <div class="text-xs font-semibold">
                                    PDF
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
                <!-- EXPORT PREVIEW -->
<div
    id="exportPreview"
    class="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-400"
>
    Chọn khoảng thời gian để xuất FPL.
</div>
<!-- SELECTED FPL LIST -->
<div>
    <div class="flex items-center justify-between mb-2">
        <label class="block text-xs font-semibold text-slate-300">
            Chọn FPL để xuất
        </label>
        <button
            type="button"
            onclick="toggleAllExportPlans()"
            class="text-[11px] text-brand-400 hover:text-brand-300"
        >
            Chọn tất cả
        </button>
    </div>
    <div
        id="exportPlansList"
        class="max-h-56 overflow-y-auto space-y-1.5 pr-1"
    >
        <div class="text-xs text-slate-500 text-center py-4">
            Chưa có dữ liệu.
        </div>
    </div>
    <div
        id="exportSelectedCount"
        class="mt-2 text-[11px] text-slate-500"
    >
        Đã chọn: 0 FPL
    </div>
</div>
</div>
            <div class="flex justify-end gap-2 px-5 py-4 border-t border-slate-700">
                <button
                    type="button"
                    onclick="closeExportDialog()"
                    class="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs text-white"
                >
                    Hủy
                </button>
                <button
                    type="button"
                    onclick="executeExport()"
                    class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white"
                >
                    <i class="fa-solid fa-download mr-1"></i>
                    Xuất file
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(
        overlay
    );
    const fromInput =
        document.getElementById(
            "exportFromDate"
        );
    const toInput =
        document.getElementById(
            "exportToDate"
        );
fromInput.addEventListener(
    "change",
    function () {

        updateExportPreview();
        renderExportPlansList();

    }
);
toInput.addEventListener(
    "change",
    function () {
        updateExportPreview();
        renderExportPlansList();

    }
);
updateExportPreview();
renderExportPlansList();
}
const callsignInput =
    document.getElementById(
        "exportCallsign"
    );
if (callsignInput) {
    callsignInput.addEventListener(
        "change",
        function () {
            updateExportPreview();
            renderExportPlansList();
        }
    );
}
function renderExportPlansList() {
    const list =
        document.getElementById(
            "exportPlansList"
        );
    if (!list) {
        return;
    }
    const fromDate =
        document.getElementById(
            "exportFromDate"
        )?.value;
    const toDate =
        document.getElementById(
            "exportToDate"
        )?.value;
    const callsign =
        document.getElementById(
            "exportCallsign"
        )?.value || "";
    if (!fromDate || !toDate) {
        list.innerHTML = `
            <div class="text-xs text-slate-500 text-center py-4">
                Chọn khoảng thời gian.
            </div>
        `;
        updateExportSelectedCount();
        return;
    }
    if (fromDate > toDate) {
        list.innerHTML = `
            <div class="text-xs text-red-400 text-center py-4">
                Khoảng thời gian không hợp lệ.
            </div>`;
        updateExportSelectedCount();
        return;
    }
    const filteredPlans =
        getExportPlans(
            fromDate,
            toDate,
            callsign
        );
    if (filteredPlans.length === 0) {
        list.innerHTML = `
            <div class="text-xs text-slate-500 text-center py-4">
                Không tìm thấy FPL phù hợp.
            </div>`;
        updateExportSelectedCount();
        return;
    }
    list.innerHTML =
        filteredPlans.map(
            (plan, index) => {
                const planId =
                    plan.createdAt || index;
                return `
                    <label
                        class="flex items-center gap-3 p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 cursor-pointer transition">
                        <input
                            type="checkbox"
                            class="export-plan-checkbox accent-brand-500"
                            value="${planId}"
                            onchange="updateExportSelectedCount()"
                        >
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-xs font-bold text-white">
                                    ${escapeHTML(plan.callsign || "—")}
                                </span>
                                <span class="text-[10px] text-slate-500">
                                    ${formatExportDate(plan.createdDate)}
                                </span>
                            </div>
                            <div class="text-[10px] text-slate-400 mt-0.5">
                                ${escapeHTML(plan.dep || "—")}
                                <span class="mx-1 text-slate-600">
                                    →
                                </span>
                                ${escapeHTML(plan.dest || "—")}
                                <span class="mx-2 text-slate-600">
                                    |
                                </span>
                                ${escapeHTML(plan.time || "—")}
                            </div>
                        </div>
                    </label>
                `;
            }
        ).join("");
    updateExportSelectedCount();
}
function toggleAllExportPlans() {
    const checkboxes =
        document.querySelectorAll(
            ".export-plan-checkbox"
        );
    if (!checkboxes.length) {
        return;
    }
    const allChecked =
        [...checkboxes]
            .every(
                checkbox => checkbox.checked
            );
    checkboxes.forEach(
        checkbox => {
            checkbox.checked =
                !allChecked;
        }
    );
    updateExportSelectedCount();
}
// ------------------------------------------------------------
// 13. Preview
// ------------------------------------------------------------
function updateExportPreview() {
    const fromDate =
        document.getElementById(
            "exportFromDate"
        )?.value;
    const toDate =
        document.getElementById(
            "exportToDate"
        )?.value;
    const preview =
        document.getElementById(
            "exportPreview"
        );
    if (
        !fromDate ||
        !toDate ||
        !preview
    ) {
        return;
    }
    if (fromDate > toDate) {
        preview.innerHTML =
            `<span class="text-red-400">
                Ngày bắt đầu không được lớn hơn ngày kết thúc.
            </span>`;
        return;
    }
    const callsign =
    document.getElementById(
        "exportCallsign"
    )?.value || "";
const exportPlans =
    getExportPlans(
        fromDate,
        toDate,
        callsign
    );
    preview.innerHTML =
        `Tìm thấy <strong class="text-white">${exportPlans.length}</strong> FPL trong khoảng thời gian đã chọn.`;
}
function executeExport() {
    const fromDate =
        document.getElementById(
            "exportFromDate"
        ).value;
    const toDate =
        document.getElementById(
            "exportToDate"
        ).value;
    const format =
        document.querySelector(
            'input[name="exportFormat"]:checked'
        )?.value;
const callsign =
    document.getElementById(
        "exportCallsign"
    )?.value || "";
    if (
        !fromDate ||
        !toDate
    ) {
        alert(
            "Vui lòng chọn đầy đủ khoảng thời gian."
        );
        return;
    }
    if (fromDate > toDate) {
        alert(
            "Ngày bắt đầu không được lớn hơn ngày kết thúc."
        );
        return;
    }
const filteredPlans =
    getExportPlans(
        fromDate,
        toDate,
        callsign
    );
const selectedIds =
    [
        ...document.querySelectorAll(
            ".export-plan-checkbox:checked"
        )
    ].map(
        checkbox => String(checkbox.value)
    );
let exportPlans;
// Nếu người dùng tick ít nhất một FPL
if (selectedIds.length > 0) {
    exportPlans =
        filteredPlans.filter(
            plan =>
                selectedIds.includes(
                    String(plan.createdAt)
                )
        );
// Nếu không tick gì → xuất toàn bộ FPL đang lọc
} else {
    exportPlans =
        filteredPlans;
}
    if (
        exportPlans.length === 0
    ) {
        const confirmEmpty =
            confirm(
                "Không tìm thấy FPL nào trong khoảng thời gian này.\n\n" +
                "Bạn vẫn muốn xuất file rỗng?"
            );
        if (!confirmEmpty) {
            return;
        }
    }
    if (format === "txt") {
        exportTXT(
            exportPlans,
            fromDate,
            toDate
        );
    } else if (format === "doc") {
        exportDOC(
            exportPlans,
            fromDate,
            toDate
        );
    } else if (format === "pdf") {
        exportPDF(
            exportPlans,
            fromDate,
            toDate
        );}
    closeExportDialog();
    if (
        typeof showToast === "function"
    ) {
        showToast(
            `Đã xuất ${exportPlans.length} FPL.`,
            "success"
        );}}
function closeExportDialog() {
    const dialog =
        document.getElementById(
            "exportDialog"
        );
    if (dialog) {
        dialog.remove();
    }
}
document.addEventListener(
    "keydown",
    function (event) {
        if (
            event.key === "Escape"
        ) {
            closeExportDialog();
        }});