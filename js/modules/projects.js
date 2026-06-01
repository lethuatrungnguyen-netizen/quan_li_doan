/* Project= */

// Thêm hoặc Cập nhật một đồ án trong danh sách cá nhân
function saveNewProjectToList() {
    const name = document.getElementById("myProjectName").value.trim();
    if (!name) { showToast("Vui lòng nhập tên đề tài", "warning"); return; }

    const editIndex = parseInt(document.getElementById("myProjectEditIndex").value);

    const projectItem = {
        maDoAn: document.getElementById("myProjectId").value.trim(),
        tenDeTai: name,
        giangVien: document.getElementById("myProjectTeacher").value.trim(),
        linkUrl: document.getElementById("myProjectUrl").value.trim(), // Lưu link nhập từ bàn phím
        moTa: document.getElementById("myProjectDesc").value.trim(),
        danhGiaGV: document.getElementById("myProjectTeacherReview").value.trim(),
        trangThai: document.getElementById("myProjectStatus").value
    };

    if (editIndex >= 0) {
        appData.myProjects[editIndex] = projectItem;
        addLog(`Đã cập nhật đồ án: ${name}`);
        showToast("Cập nhật đồ án thành công!");
    } else {
        // Trường hợp thêm mới đồ án
        appData.myProjects.push(projectItem);
        addLog(`Đã thêm đồ án mới: ${name}`);
        showToast("Thêm đồ án mới thành công!");
    }

    saveData();
    resetMyProjectForm();
    renderMyProjectsList();      
    renderProjectDashboard();    
}

// Thiết lập form về trạng thái thêm mới ban đầu
function resetMyProjectForm() {
    document.getElementById("myProjectEditIndex").value = "-1";
    document.getElementById("myProjectId").value = "";
    document.getElementById("myProjectName").value = "";
    document.getElementById("myProjectTeacher").value = "";
    document.getElementById("myProjectUrl").value = "";
    document.getElementById("myProjectDesc").value = "";
    document.getElementById("myProjectTeacherReview").value = "";
    document.getElementById("myProjectStatus").value = "Đang thực hiện";
    document.getElementById("myProjectFormTitle").innerHTML = `<i class="ti ti-folder-plus" style="color:var(--primary)"></i> Thêm đồ án mới vào danh sách`;
}

// Tải dữ liệu đồ án lên form để chỉnh sửa
function editMyProjectItem(index) {
    const p = appData.myProjects[index];
    if (!p) return;

    document.getElementById("myProjectEditIndex").value = index;
    document.getElementById("myProjectId").value = p.maDoAn || "";
    document.getElementById("myProjectName").value = p.tenDeTai || "";
    document.getElementById("myProjectTeacher").value = p.giangVien || "";
    document.getElementById("myProjectUrl").value = p.linkUrl || "";
    document.getElementById("myProjectDesc").value = p.moTa || "";
    document.getElementById("myProjectTeacherReview").value = p.danhGiaGV || "";
    document.getElementById("myProjectStatus").value = p.trangThai || "Đang thực hiện";

    document.getElementById("myProjectFormTitle").innerHTML = `<i class="ti ti-edit" style="color:var(--warning)"></i> Đang chỉnh sửa đồ án: ${p.tenDeTai}`;
    showToast("Đã lấy thông tin đồ án lên form chỉnh sửa.");
}

// Xóa đồ án ra khỏi danh sách cá nhân
function deleteMyProjectItem(index) {
    if (confirm("Bạn có chắc chắn muốn xóa đồ án này khỏi danh sách cá nhân?")) {
        const deletedName = appData.myProjects[index].tenDeTai;
        appData.myProjects.splice(index, 1);
        saveData();
        addLog(`Đã xóa đồ án: ${deletedName}`);
        showToast("Đã xóa đồ án thành công.");
        renderMyProjectsList();
        renderProjectDashboard();
    }
}

// Render danh sách đồ án tại trang quản lý riêng ("Đồ án của tôi")
function renderMyProjectsList() {
    const body = document.getElementById("myProjectsListBody");
    if (!body) return;

    if (appData.myProjects.length === 0) {
        body.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--text-light)">Chưa có đồ án nào trong danh sách cá nhân của bạn.</td></tr>`;
        return;
    }

    body.innerHTML = appData.myProjects.map((p, index) => {
        const sc = p.trangThai === "Hoàn thành" ? "done" : p.trangThai === "Cần chỉnh sửa" ? "fix" : "doing";
        const linkDisplay = p.linkUrl ? `<a href="${p.linkUrl}" target="_blank" style="color:var(--primary); text-decoration:underline; font-weight:500;"><i class="ti ti-link"></i> Xem liên kết</a>` : `<span style="color:var(--text-light); font-style:italic;">Không có link</span>`;
        const reviewDisplay = p.danhGiaGV ? `<div style="font-size:12px; color:var(--text); max-width:260px; white-space:normal; word-break:break-word;">${p.danhGiaGV.length > 70 ? p.danhGiaGV.slice(0, 70) + "..." : p.danhGiaGV}</div>` : `<span style="color:var(--text-light); font-style:italic;">Không có</span>`;

        return `
        <tr style="border-bottom:1px solid var(--border)">
            <td style="padding:12px; font-weight:600;" class="td-code">${p.maDoAn || "—"}</td>
            <td style="padding:12px;">
                <div style="font-weight:600;">${p.tenDeTai}</div>
            </td>
            <td style="padding:12px; color:var(--text-light);">${p.giangVien || "—"}</td>
            <td style="padding:12px;">${reviewDisplay}</td>
            <td style="padding:12px;">${linkDisplay}</td>
            <td style="padding:12px;"><span class="status ${sc}">${p.trangThai}</span></td>
            <td style="padding:12px; text-align:center;">
                <button class="action-btn action-edit" onclick="editMyProjectItem(${index})" title="Sửa" style="display:inline-flex; margin-right:4px;"><i class="ti ti-edit"></i></button>
                <button class="action-btn action-delete" onclick="deleteMyProjectItem(${index})" title="Xóa" style="display:inline-flex;"><i class="ti ti-trash"></i></button>
            </td>
        </tr>`;
    }).join("");
}

// HIỂN THỊ TOÀN BỘ DANH SÁCH ĐỒ ÁN RA MÀN HÌNH CHÍNH (BẢNG ĐIỀU KHIỂN)
function renderProjectDashboard() {
    const box = document.getElementById("dashboardProject");
    if (!box) return;

    if (!appData.myProjects || appData.myProjects.length === 0) {
        box.innerHTML = `<div class="project-empty"><i class="ti ti-folder-open"></i><p>Chưa có thông tin đồ án nào. <a href="#" onclick="showPage('projectPage', document.querySelectorAll('.menu-item')[1])">Thêm ngay</a></p></div>`;
        return;
    }

    const statusLabel = {
        "Hoàn thành": { cls: "done", icon: "ti-circle-check" },
        "Cần chỉnh sửa": { cls: "fix", icon: "ti-alert-circle" },
        "Đang thực hiện": { cls: "doing", icon: "ti-loader" }
    };

    const cards = appData.myProjects.map(p => {
        const st = statusLabel[p.trangThai] || { cls: "doing", icon: "ti-loader" };
        return `
        <div class="project-info-card">
            <div class="pic-accent status-${st.cls}"></div>
            <div class="pic-body">
                <div class="project-info-header">
                    <div style="min-width:0">
                        ${p.maDoAn ? `<div class="project-info-code"><i class="ti ti-hash" style="font-size:9px"></i>${p.maDoAn}</div>` : ""}
                        <div class="project-info-title">${p.tenDeTai}</div>
                    </div>
                    <span class="status ${st.cls}" style="flex-shrink:0"><i class="ti ${st.icon}" style="font-size:11px;margin-right:3px"></i>${p.trangThai}</span>
                </div>
                ${(p.giangVien || p.moTa || p.danhGiaGV) ? `
                <div class="project-info-meta">
                    ${p.giangVien ? `<div class="meta-item"><i class="ti ti-user-circle"></i><span>${p.giangVien}</span></div>` : ""}
                </div>` : ""}
                ${p.moTa ? `<div class="project-info-desc">${p.moTa}</div>` : ""}
                ${p.danhGiaGV ? `<div class="project-info-review"><strong>Đánh giá GV:</strong> ${p.danhGiaGV}</div>` : ""}
            </div>
            <div class="pic-footer">
                ${p.linkUrl
                ? `<a href="${p.linkUrl}" target="_blank" class="pic-link-btn"><i class="ti ti-external-link"></i> Xem liên kết</a>`
                : `<span style="font-size:11px;color:var(--text-light);font-style:italic">Không có liên kết</span>`
            }
                <span class="pic-date"><i class="ti ti-folder" style="font-size:11px;margin-right:3px;color:var(--primary)"></i>Đồ án cá nhân</span>
            </div>
        </div>`;
    }).join("");

    box.innerHTML = `<div class="my-projects-grid">${cards}</div>`;
}

// Thay thế hàm loadProject cũ để khởi chạy đồng bộ danh sách
function loadProject() {
    renderMyProjectsList();
    renderProjectDashboard();
}

function updateGithubQuickBtn() {
    const btn = document.getElementById("githubQuickBtn");
    const lbl = document.getElementById("githubQuickLabel");
    if (!btn || !lbl) return;
    const url = appData.githubInfo?.repoUrl || appData.project?.github || "";
    const name = appData.githubInfo?.repoName || (url ? "Mở GitHub Repository" : "Chưa có GitHub");
    lbl.textContent = name;
    btn.title = url || "Chưa có đường dẫn GitHub";
    btn.style.opacity = url ? "1" : "0.55";
    btn.style.cursor = url ? "pointer" : "default";
}
function openGithubLink() {
    const url = appData.githubInfo?.repoUrl || appData.project?.github || "";
    if (url) window.open(url, "_blank");
    else showToast("Chưa có đường dẫn GitHub", "warning");
}


function updateDashboard() {
    const cards = appData.projectCards || [];
    const total = cards.length;
    const done = cards.filter(c => c.trangThai === "Hoàn thành").length;
    const doing = cards.filter(c => c.trangThai === "Đang thực hiện").length;
    const fix = cards.filter(c => c.trangThai === "Cần chỉnh sửa").length;
    const pct = total === 0 ? 0 : Math.round(done * 100 / total);
    document.getElementById("totalCards").textContent = total;
    document.getElementById("doneCards").textContent = done;
    document.getElementById("doingCards").textContent = doing;
    document.getElementById("fixCards").textContent = fix;
    document.getElementById("progressPercent").textContent = pct + "%";
    document.getElementById("progressFill").style.width = pct + "%";
    document.getElementById("progressText").textContent = `${done} / ${total} đồ án hoàn thành`;
}


function renderDashboardTable() {
    const cards = appData.projectCards || [];
    const el = document.getElementById("dashTableBody");
    const empty = document.getElementById("dashTableEmpty");
    const wrap = document.getElementById("dashTableEl");
    const badge = document.getElementById("dashTableCount");
    if (!el) return;
    badge.textContent = cards.length;
    if (cards.length === 0) {
        wrap.style.display = "none";
        empty.style.display = "block";
        return;
    }
    wrap.style.display = "";
    empty.style.display = "none";

    const preview = cards.slice(-8).reverse();
    el.innerHTML = preview.map((c, i) => {
        const sc = c.trangThai === "Hoàn thành" ? "done" : c.trangThai === "Cần chỉnh sửa" ? "fix" : "doing";
        const realIdx = cards.indexOf(c);

        // Tạo liên kết hiển thị thay cho text Công nghệ cũ
        const linkHTML = c.link ? `<a href="${c.link}" target="_blank" onclick="event.stopPropagation();" style="color:var(--primary); font-weight:500; text-decoration:underline;"><i class="ti ti-link"></i> Xem Link</a>` : "—";

        return `<tr onclick="openCardDetail(${realIdx})" style="cursor:pointer">
            <td class="td-light">${cards.length - cards.indexOf(c)}</td>
            <td class="td-code">${c.ma || "—"}</td>
            <td>
                <div style="font-weight:600;color:var(--text)">${c.ten}</div>
                ${c.svName ? `<div style="font-size:11px;color:var(--text-light);margin-top:2px"><i class="ti ti-user" style="font-size:11px"></i> ${c.svName}</div>` : ""}
            </td>
            <td class="td-light">${c.giangVien || "—"}</td>
            <td class="td-light">${linkHTML}</td> 
            <td><span class="status ${sc}">${c.trangThai}</span></td>
            <td class="td-light">${c.created || "—"}</td>
        </tr>`;
    }).join("");
}
/*Kho đồ án*/
let editingCardIndex = -1;
let currentView = appData.repoView || "card";

function setRepoView(view) {
    currentView = view;
    appData.repoView = view;
    saveData();
    document.getElementById("viewTableBtn").classList.toggle("active", view === "table");
    document.getElementById("viewCardBtn").classList.toggle("active", view === "card");
    document.getElementById("repoTableView").style.display = view === "table" ? "block" : "none";
    document.getElementById("repoCardView").style.display = view === "card" ? "block" : "none";
    filterProjectCards();
}

function openProjectCardModal(index = -1) {
    editingCardIndex = index;
    document.getElementById("projectCardModal").classList.add("show");
    if (index >= 0) {
        const c = appData.projectCards[index];
        document.getElementById("projectCardModalTitle").textContent = "Chỉnh sửa đồ án";
        document.getElementById("pcMa").value = c.ma;
        document.getElementById("pcTen").value = c.ten;
        document.getElementById("pcGV").value = c.giangVien;
        document.getElementById("pcSV").value = c.svName || "";
        document.getElementById("pcCN").value = c.congNghe;
        document.getElementById("pcStatus").value = c.trangThai;
        document.getElementById("pcLink").value = c.link;
        document.getElementById("pcMoTa").value = c.moTa;
        document.getElementById("pcReview").value = c.danhGiaGV || "";
    } else {
        document.getElementById("projectCardModalTitle").textContent = "Thêm đồ án mới";
        ["pcMa", "pcTen", "pcGV", "pcSV", "pcCN", "pcLink", "pcMoTa", "pcReview"].forEach(id => document.getElementById(id).value = "");
        document.getElementById("pcStatus").value = "Đang thực hiện";
    }
}
function closeProjectCardModal() { document.getElementById("projectCardModal").classList.remove("show"); }

function saveProjectCard() {
    const ma = document.getElementById("pcMa").value.trim();
    const ten = document.getElementById("pcTen").value.trim();
    if (!ma || !ten) { showToast("Vui lòng nhập Mã và Tên đề tài", "warning"); return; }
    const card = {
        ma, ten,
        giangVien: document.getElementById("pcGV").value.trim(),
        svName: document.getElementById("pcSV").value.trim(),
        congNghe: document.getElementById("pcCN").value.trim(),
        trangThai: document.getElementById("pcStatus").value,
        link: document.getElementById("pcLink").value.trim(),
        moTa: document.getElementById("pcMoTa").value.trim(),
        danhGiaGV: document.getElementById("pcReview").value.trim(),
        created: editingCardIndex >= 0 ? appData.projectCards[editingCardIndex].created : new Date().toLocaleDateString("vi-VN")
    };
    if (editingCardIndex >= 0) {
        appData.projectCards[editingCardIndex] = card;
        addLog(`Đã cập nhật đồ án "${ten}"`);
        showToast("Cập nhật thành công");
    } else {
        appData.projectCards.push(card);
        addLog(`Đã thêm đồ án "${ten}"`);
        showToast("Thêm đồ án thành công");
    }
    saveData(); renderProjectCards(); renderDashboardTable(); updateDashboard();
    closeProjectCardModal();
}

function deleteProjectCard(index) {
    const name = appData.projectCards[index].ten;
    if (confirm(`Xóa đồ án "${name}"?`)) {
        appData.projectCards.splice(index, 1);
        saveData(); renderProjectCards(); renderDashboardTable(); updateDashboard();
        addLog(`Đã xóa đồ án "${name}"`);
        showToast("Đã xóa đồ án");
    }
}

function filterProjectCards() { renderProjectCards(); }

function getFilteredCards() {
    const kw = (document.getElementById("taskSearch")?.value || "").toLowerCase();
    const ft = document.getElementById("taskFilter")?.value || "";
    const srt = document.getElementById("taskSort")?.value || "newest";
    let arr = [...(appData.projectCards || [])].map((c, i) => ({ ...c, _i: i }));
    if (kw) arr = arr.filter(c => c.ten.toLowerCase().includes(kw) || c.ma.toLowerCase().includes(kw) || (c.svName && c.svName.toLowerCase().includes(kw)) || (c.danhGiaGV && c.danhGiaGV.toLowerCase().includes(kw)));
    if (ft) arr = arr.filter(c => c.trangThai === ft);
    if (srt === "name") arr.sort((a, b) => a.ten.localeCompare(b.ten));
    else if (srt === "oldest") arr.sort((a, b) => a._i - b._i);
    else arr.sort((a, b) => b._i - a._i); // newest default
    return arr;
}

function renderProjectCards() {
    const filtered = getFilteredCards();
    const repoCount = document.getElementById("repoCount");
    if (repoCount) repoCount.textContent = appData.projectCards.length;

    if (currentView === "table") {
        renderProjectTable(filtered);
    } else {
        renderProjectCardGrid(filtered);
    }
}

function renderProjectTable(filtered) {
    const tbody = document.getElementById("projectTableBody");
    const empty = document.getElementById("projectTableEmpty");
    if (!tbody) return;
    if (filtered.length === 0) {
        tbody.innerHTML = "";
        empty.style.display = "block";
        return;
    }
    empty.style.display = "none";
    tbody.innerHTML = filtered.map((c, rowIdx) => {
        const sc = c.trangThai === "Hoàn thành" ? "done" : c.trangThai === "Cần chỉnh sửa" ? "fix" : "doing";
        return `<tr>
            <td class="td-light">${rowIdx + 1}</td>
            <td class="td-code">${c.ma || "—"}</td>
            <td>
                <div class="td-title">${c.ten}
                    ${c.moTa ? `<div class="sub">${c.moTa.substring(0, 60)}${c.moTa.length > 60 ? "..." : ""}</div>` : ""}
                </div>
            </td>
            <td class="td-light">${c.giangVien || "—"}</td>
            <td class="td-light">${c.danhGiaGV ? (c.danhGiaGV.length > 50 ? c.danhGiaGV.slice(0, 50) + "..." : c.danhGiaGV) : "—"}</td>
            <td class="td-light">${c.congNghe || "—"}</td>
            <td><span class="status ${sc}">${c.trangThai}</span></td>
            <td class="td-light">${c.created || "—"}</td>
            <td>
                <div class="action-group" style="justify-content:center">
                    <button class="action-btn action-view" onclick="openCardDetail(${c._i})" title="Xem"><i class="ti ti-eye"></i></button>
                    <button class="action-btn action-edit" onclick="openProjectCardModal(${c._i})" title="Sửa"><i class="ti ti-edit"></i></button>
                    <button class="action-btn action-delete" onclick="deleteProjectCard(${c._i})" title="Xóa"><i class="ti ti-trash"></i></button>
                </div>
            </td>
        </tr>`;
    }).join("");
}

function renderProjectCardGrid(filtered) {
    const container = document.getElementById("projectCardContainer");
    if (!container) return;
    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="ti ti-folder-x"></i><p>Không tìm thấy đồ án phù hợp.</p></div>`;
        return;
    }
    container.innerHTML = filtered.map(c => {
        const sc = c.trangThai === "Hoàn thành" ? "done" : c.trangThai === "Cần chỉnh sửa" ? "fix" : "doing";
        return `
        <div class="project-card-item status-${sc}">
            <div class="pci-body">
                <div class="pci-header">
                    <div>
                        <div class="pci-code">${c.ma || '—'}</div>
                        <div class="pci-title">${c.ten}</div>
                    </div>
                    <span class="status ${sc}">${c.trangThai}</span>
                </div>
                <div class="pci-meta">
                    ${c.giangVien ? `<div class="meta-item"><i class="ti ti-user"></i><span>${c.giangVien}</span></div>` : ""}
                    ${c.svName ? `<div class="meta-item"><i class="ti ti-user-circle"></i><span>${c.svName}</span></div>` : ""}
                    ${c.congNghe ? `<div class="meta-item"><i class="ti ti-code"></i><span>${c.congNghe}</span></div>` : ""}
                </div>
                ${c.moTa ? `<div class="pci-desc">${c.moTa}</div>` : ""}
                ${c.danhGiaGV ? `<div class="project-card-review"><strong>Đánh giá GV:</strong> ${c.danhGiaGV}</div>` : ""}
            </div>
            <div class="pci-footer">
                <button class="pci-detail-btn" onclick="openCardDetail(${c._i})">
                    <i class="ti ti-eye"></i> Xem chi tiết
                </button>
                <div class="action-group">
                    <button class="action-btn action-edit" onclick="openProjectCardModal(${c._i})" title="Chỉnh sửa"><i class="ti ti-edit"></i></button>
                    <button class="action-btn action-delete" onclick="deleteProjectCard(${c._i})" title="Xóa"><i class="ti ti-trash"></i></button>
                </div>
            </div>
        </div>`;
    }).join("");
}

let viewingCardIndex = -1;

function openCardDetail(index) {
    viewingCardIndex = index;
    const c = appData.projectCards[index];
    const sc = c.trangThai === "Hoàn thành" ? "done" : c.trangThai === "Cần chỉnh sửa" ? "fix" : "doing";
    document.getElementById("cardDetailBody").innerHTML = `
    <div class="card-detail-body">
        <div class="card-detail-header">
            <div>
                <div class="card-detail-code">${c.ma}</div>
                <div class="card-detail-title">${c.ten}</div>
            </div>
            <span class="status ${sc}">${c.trangThai}</span>
        </div>
        <div class="card-detail-meta">
            ${c.giangVien ? `<div class="meta-item"><i class="ti ti-user"></i><span>${c.giangVien}</span></div>` : ""}
            ${c.svName ? `<div class="meta-item"><i class="ti ti-user-circle"></i><span>${c.svName}</span></div>` : ""}
            ${c.congNghe ? `<div class="meta-item"><i class="ti ti-code"></i><span>${c.congNghe}</span></div>` : ""}
            <div class="meta-item"><i class="ti ti-calendar-plus"></i><span>Tạo: ${c.created}</span></div>
        </div>
        ${c.moTa ? `<div class="card-detail-desc">${c.moTa}</div>` : ""}
        ${c.danhGiaGV ? `<div class="card-detail-review"><strong>Đánh giá GV:</strong> ${c.danhGiaGV}</div>` : ""}
        ${c.link ? `<a href="${c.link}" target="_blank" class="card-detail-link"><i class="ti ti-brand-github"></i>${c.link}</a>` : ""}
    </div>`;
    document.getElementById("cardDetailEditBtn").onclick = () => { closeCardDetailModal(); openProjectCardModal(index); };
    document.getElementById("cardDetailModal").classList.add("show");
}
function closeCardDetailModal() { document.getElementById("cardDetailModal").classList.remove("show"); }


