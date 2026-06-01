/*   PAGE NAVIGATION */
function showPage(pageId, button) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active-page"));
    document.getElementById(pageId).classList.add("active-page");
    document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
    if (button) button.classList.add("active");
    const map = {
        dashboardPage: "Bảng điều khiển", projectPage: "Đồ án của tôi",
        taskPage: "Kho đồ án", deadlinePage: "Lịch hẹn & Deadline",
        githubPage: "GitHub", feedbackPage: "Phản hồi",
        activityPage: "Nhật ký hoạt động", settingPage: "Cài đặt",
        progressPage: "Theo dõi Tiến độ"
    };
    document.getElementById("pageTitle").textContent = map[pageId] || "";
}

/* TOAST*/
function showToast(message, type = "success") {
    const c = document.getElementById("toastContainer");
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.textContent = message;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

/* ACTIVITY LOG */
function addLog(text) {
    appData.logs.unshift({ text, time: new Date().toLocaleString("vi-VN") });
    saveData(); renderLogs();
}
function clearLogs() {
    if (confirm("Xóa toàn bộ nhật ký?")) {
        appData.logs = []; saveData(); renderLogs();
    }
}
function renderLogs() {
    const list = document.getElementById("activityList");
    if (!list) return;
    if (appData.logs.length === 0) {
        list.innerHTML = `<div class="project-empty"><i class="ti ti-history"></i><p>Chưa có hoạt động nào.</p></div>`;
        return;
    }
    list.innerHTML = appData.logs.map(l => `
        <div class="activity-item">
            <div class="activity-text">${l.text}</div>
            <div class="activity-time">${l.time}</div>
        </div>`).join("");
}

/* DARK MODE*/
function toggleTheme() {
    appData.settings.darkMode = !appData.settings.darkMode;
    saveData(); applyTheme();
}
function applyTheme() { document.body.classList.toggle("dark", appData.settings.darkMode); }


