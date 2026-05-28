/* ===================================
   APP DATA
=================================== */
const _saved = localStorage.getItem("graduationProject_v2");
let appData = _saved ? JSON.parse(_saved) : null;

if (!appData) {
    appData = {
        myProjects: [], // Chuyển đổi thành mảng để chứa nhiều đồ án cá nhân
        projectCards: [], deadlines: [], feedbacks: [],
        githubInfo: { repoName: "", repoUrl: "", commits: 0 },
        logs: [], settings: { darkMode: false }, repoView: "card"
    };
}
// Các bước kiểm tra Migration
if (!Array.isArray(appData.myProjects)) {
    appData.myProjects = [];
    if (appData.project && appData.project.tenDeTai) {
        // Chuyển đồ án cũ của bạn (nếu có) sang danh sách mảng mới
        appData.myProjects.push(appData.project);
    }
}
appData.myProjects = appData.myProjects.map(p => ({ ...p, danhGiaGV: p.danhGiaGV || "" }));
if (!Array.isArray(appData.projectCards)) appData.projectCards = [];
if (!Array.isArray(appData.deadlines)) appData.deadlines = [];
if (!Array.isArray(appData.feedbacks)) appData.feedbacks = [];
if (!Array.isArray(appData.logs)) appData.logs = [];
if (!appData.githubInfo) appData.githubInfo = { repoName: "", repoUrl: "", commits: 0 };
if (!appData.settings) appData.settings = { darkMode: false };
if (!appData.project) appData.project = { maDoAn: "", tenDeTai: "", giangVien: "", congNghe: "", github: "", moTa: "", trangThai: "Đang thực hiện", hocKy: "" };
if (!appData.repoView) appData.repoView = "card";
// Ensure svName and teacher review exist on old cards
appData.projectCards.forEach(c => {
    if (!c.svName) c.svName = "";
    if (!c.danhGiaGV) c.danhGiaGV = "";
});

function saveData() { localStorage.setItem("graduationProject_v2", JSON.stringify(appData)); }
