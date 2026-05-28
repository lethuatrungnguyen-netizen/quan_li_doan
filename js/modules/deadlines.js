function openDeadlineModal() { document.getElementById("deadlineModal").classList.add("show"); }
function closeDeadlineModal() { document.getElementById("deadlineModal").classList.remove("show"); }

function saveDeadline() {
    const title = document.getElementById("deadlineTitle").value.trim();
    const date = document.getElementById("deadlineDate").value;
    if (!title || !date) { showToast("Vui lòng nhập đầy đủ thông tin", "warning"); return; }
    appData.deadlines.push({ title, date, done: false });
    saveData(); renderDeadlines(); updateDeadlineBadge();
    addLog(`Đã thêm lịch hẹn "${title}"`);
    showToast("Thêm lịch hẹn thành công");
    closeDeadlineModal();
    document.getElementById("deadlineTitle").value = "";
    document.getElementById("deadlineDate").value = "";
}
function toggleDeadline(index) {
    appData.deadlines[index].done = !appData.deadlines[index].done;
    saveData(); renderDeadlines(); updateDeadlineBadge();
}
function deleteDeadline(index) {
    const t = appData.deadlines[index].title;
    if (confirm("Xóa lịch hẹn này?")) {
        appData.deadlines.splice(index, 1);
        saveData(); renderDeadlines(); updateDeadlineBadge();
        addLog(`Đã xóa lịch hẹn "${t}"`);
    }
}
function getRemainingDays(date) {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.ceil((new Date(date) - now) / (1000 * 60 * 60 * 24));
}
function renderDeadlines() {
    const c = document.getElementById("deadlineContainer");
    if (!c) return;
    if (appData.deadlines.length === 0) {
        c.innerHTML = `<div class="project-empty"><i class="ti ti-calendar-off"></i><p>Chưa có lịch hẹn nào.</p></div>`;
        return;
    }
    c.innerHTML = appData.deadlines.map((item, i) => {
        const rem = getRemainingDays(item.date);
        const cls = item.done ? "deadline-done" : rem < 0 ? "deadline-overdue" : "";
        const lbl = item.done
            ? `<span style="color:var(--success);font-weight:700">✓ Hoàn thành</span>`
            : rem < 0 ? `<span style="color:var(--danger);font-weight:700">Đã quá hạn</span>`
                : rem === 0 ? `<span style="color:var(--warning);font-weight:700">Hôm nay!</span>`
                    : `<span style="color:var(--primary)">Còn ${rem} ngày</span>`;
        return `
        <div class="deadline-item ${cls}">
            <div class="deadline-info">
                <div class="deadline-title">${item.title}</div>
                <div class="deadline-date">📅 ${item.date} &nbsp;•&nbsp; ${lbl}</div>
            </div>
            <div class="action-group">
                <button class="action-btn action-edit" onclick="toggleDeadline(${i})" title="${item.done ? 'Bỏ hoàn thành' : 'Đánh dấu xong'}">
                    <i class="ti ti-${item.done ? 'rotate-clockwise' : 'check'}"></i>
                </button>
                <button class="action-btn action-delete" onclick="deleteDeadline(${i})" title="Xóa">
                    <i class="ti ti-trash"></i>
                </button>
            </div>
        </div>`;
    }).join("");
}
function updateDeadlineBadge() {
    const n = appData.deadlines.filter(d => !d.done).length;
    document.getElementById("deadlineBadge").textContent = n;
}

/* ===================================
   GITHUB
=================================== */
function saveGithub() {
    appData.githubInfo = {
        repoName: document.getElementById("repoName").value,
        commits: document.getElementById("repoCommit").value,
        repoUrl: document.getElementById("repoUrl").value
    };
    saveData(); renderGithub(); updateGithubQuickBtn();
    addLog("Đã cập nhật GitHub Repository");
    showToast("Đã lưu GitHub");
}
function renderGithub() {
    const r = appData.githubInfo;
    document.getElementById("repoName").value = r.repoName;
    document.getElementById("repoCommit").value = r.commits;
    document.getElementById("repoUrl").value = r.repoUrl;
    document.getElementById("repoPreviewName").textContent = r.repoName || "Chưa có repository";
    const link = document.getElementById("repoPreviewLink");
    link.href = r.repoUrl || "#";
    link.textContent = r.repoUrl ? "Mở GitHub" : "Chưa có đường dẫn";
}

/* ===================================
   FEEDBACK
=================================== */
function sendFeedback() {
    const text = document.getElementById("feedbackInput").value.trim();
    const author = document.getElementById("feedbackRole").value;
    if (!text) return;
    appData.feedbacks.push({ author, content: text, time: new Date().toLocaleString("vi-VN") });
    saveData(); renderFeedbacks(); addLog("Đã gửi phản hồi");
    document.getElementById("feedbackInput").value = "";
    showToast("Gửi phản hồi thành công");
}
function renderFeedbacks() {
    const list = document.getElementById("feedbackList");
    if (!list) return;
    if (appData.feedbacks.length === 0) {
        list.innerHTML = `<div class="project-empty"><i class="ti ti-message-x"></i><p>Chưa có phản hồi nào.</p></div>`;
        return;
    }
    list.innerHTML = appData.feedbacks.map(item => `
        <div class="feedback-item">
            <div class="feedback-author">${item.author}</div>
            <div class="feedback-content">${item.content}</div>
            <div class="feedback-time">${item.time}</div>
        </div>`).join("");
}

/* ===================================
   QUICK FEEDBACK (Dashboard)
=================================== */
function sendQuickFeedback() {
    const text = document.getElementById("quickFeedbackInput").value.trim();
    const author = document.getElementById("quickFeedbackRole").value;
    if (!text) { showToast("Vui lòng nhập nội dung", "warning"); return; }
    appData.feedbacks.push({ author, content: text, time: new Date().toLocaleString("vi-VN") });
    saveData(); renderFeedbacks(); renderQuickFeedbacks();
    addLog(`[${author}] Đã gửi phản hồi nhanh`);
    showToast("Gửi phản hồi thành công");
    document.getElementById("quickFeedbackInput").value = "";
}
function renderQuickFeedbacks() {
    const list = document.getElementById("quickFeedbackList");
    if (!list) return;
    const recent = [...appData.feedbacks].reverse().slice(0, 5);
    if (recent.length === 0) {
        list.innerHTML = `<div class="quick-fb-empty"><i class="ti ti-message-x"></i><p>Chưa có phản hồi nào</p></div>`;
        return;
    }
    list.innerHTML = recent.map(item => `
        <div class="quick-fb-item">
            <div class="quick-fb-author">${item.author}</div>
            <div class="quick-fb-content">${item.content}</div>
            <div class="quick-fb-time">${item.time}</div>
        </div>`).join("");
}

/* ===================================
   THEO DÕI TIẾN ĐỘ
=================================== */
let progCurrentCardIdx = 0;
let progCurrentMsgType = 'question';
let progCurrentChatRole = 'Giảng viên';
let progEditingMsIdx = -1;

// Ensure progress data exists on each card
function ensureProgData(card) {
    if (!card.progMessages) card.progMessages = [];
    if (!card.progMilestones) card.progMilestones = [];
    if (!card.progDocs) card.progDocs = [];
    if (!card.progProgress) card.progProgress = 0;
}

function initProgressPage() {
    const cards = appData.projectCards || [];
    const tabs = document.getElementById('progStudentTabs');
    const layout = document.getElementById('progLayout');
    const empty = document.getElementById('progEmptyState');
    if (!tabs) return;

    if (cards.length === 0) {
        layout.style.display = 'none';
        empty.style.display = 'flex';
        tabs.innerHTML = '';
        return;
    }
    layout.style.display = '';
    empty.style.display = 'none';

    tabs.innerHTML = cards.map((c, i) => {
        const initials = (c.svName || c.ten || '??').trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        return `<button class="prog-student-tab ${i === progCurrentCardIdx ? 'active' : ''}" onclick="selectProgStudent(${i})">
            <span class="prog-tab-avatar">${initials}</span>
            <span>${c.svName || c.ten}</span>
        </button>`;
    }).join('');

    renderProgStudent();
}

function selectProgStudent(idx) {
    progCurrentCardIdx = idx;
    document.querySelectorAll('.prog-student-tab').forEach((b, i) => b.classList.toggle('active', i === idx));
    renderProgStudent();
}

function renderProgStudent() {
    const cards = appData.projectCards || [];
    if (!cards.length) return;
    const c = cards[progCurrentCardIdx];
    ensureProgData(c);

    const sc = c.trangThai === 'Hoàn thành' ? 'done' : c.trangThai === 'Cần chỉnh sửa' ? 'fix' : 'doing';
    const initials = (c.svName || c.ten || '??').trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    // Info card
    document.getElementById('progInfoCard').innerHTML = `
        <div class="prog-info-body">
            <div class="prog-avatar">${initials}</div>
            <div class="prog-name">${c.svName || '—'}</div>
            <div class="prog-meta-row">
                ${c.ma ? `<span class="prog-meta-tag">${c.ma}</span>` : ''}
                ${c.giangVien ? `<span class="prog-meta-tag">· ${c.giangVien}</span>` : ''}
            </div>
            <span class="status ${sc}" style="margin-top:8px">${c.trangThai}</span>
            <div class="prog-detail-list">
                <div class="prog-detail-row"><span class="prog-detail-lbl">Đề tài</span><span>${c.ten}</span></div>
                ${c.giangVien ? `<div class="prog-detail-row"><span class="prog-detail-lbl">Giảng viên HD</span><span>${c.giangVien}</span></div>` : ''}
                ${c.link ? `<div class="prog-detail-row"><span class="prog-detail-lbl">GitHub</span><a href="${c.link}" target="_blank" class="prog-link"><i class="ti ti-brand-github"></i> ${c.link}</a></div>` : ''}
            </div>
        </div>`;

    // Progress card
    const pct = Math.min(100, Math.max(0, c.progProgress || 0));
    const total = c.progMilestones.length;
    const done = c.progMilestones.filter(m => m.status === 'completed').length;
    document.getElementById('progProgressCard').innerHTML = `
        <div class="prog-progress-body">
            <div class="prog-progress-header">
                <span class="fw-bold">Tiến độ tổng thể</span>
                <div class="prog-pct-row">
                    <button class="prog-pct-btn" onclick="adjustProgress(-5)">−</button>
                    <span class="prog-pct-val" style="color:var(--primary)">${pct}%</span>
                    <button class="prog-pct-btn" onclick="adjustProgress(5)">+</button>
                </div>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="prog-progress-footer">
                <span>${done}/${total} milestone hoàn thành</span>
                ${c.deadline ? `<span>Hạn: ${c.deadline}</span>` : ''}
            </div>
        </div>`;

    renderMilestones();
    renderProgChat();
    renderProgTimeline();
    renderProgDocs();
    const roleSelector = document.getElementById('progChatRole');
    if (roleSelector) roleSelector.value = progCurrentChatRole;
}

function adjustProgress(delta) {
    const c = appData.projectCards[progCurrentCardIdx];
    ensureProgData(c);
    c.progProgress = Math.min(100, Math.max(0, (c.progProgress || 0) + delta));
    saveData();
    renderProgStudent();
}

// ─── MILESTONE ───
function renderMilestones() {
    const c = appData.projectCards[progCurrentCardIdx];
    const list = document.getElementById('progMilestoneList');
    if (!list) return;
    if (!c.progMilestones.length) {
        list.innerHTML = `<div class="project-empty" style="padding:20px 0"><i class="ti ti-list-check"></i><p>Chưa có milestone nào.</p></div>`;
        return;
    }
    const icons = { completed: 'ti-circle-check', 'in-progress': 'ti-loader', pending: 'ti-circle' };
    const cls   = { completed: 'ms-done', 'in-progress': 'ms-doing', pending: '' };
    list.innerHTML = c.progMilestones.map((m, i) => `
        <div class="prog-ms-item ${cls[m.status] || ''}">
            <i class="ti ${icons[m.status] || 'ti-circle'} prog-ms-icon"></i>
            <div class="prog-ms-body">
                <div class="prog-ms-title">${m.title}</div>
                ${m.date ? `<div class="prog-ms-date">${m.date}</div>` : ''}
            </div>
            <div class="action-group">
                <button class="action-btn action-edit" onclick="editMilestone(${i})" title="Sửa"><i class="ti ti-edit"></i></button>
                <button class="action-btn action-delete" onclick="deleteMilestone(${i})" title="Xóa"><i class="ti ti-trash"></i></button>
            </div>
        </div>`).join('');
}

function openAddMilestoneModal() {
    progEditingMsIdx = -1;
    document.getElementById('milestoneModalTitle').textContent = 'Thêm Milestone';
    document.getElementById('msTitleInput').value = '';
    document.getElementById('msDateInput').value = '';
    document.getElementById('msStatusInput').value = 'pending';
    document.getElementById('milestoneModal').classList.add('show');
}

function editMilestone(idx) {
    progEditingMsIdx = idx;
    const m = appData.projectCards[progCurrentCardIdx].progMilestones[idx];
    document.getElementById('milestoneModalTitle').textContent = 'Chỉnh sửa Milestone';
    document.getElementById('msTitleInput').value = m.title;
    document.getElementById('msDateInput').value = m.date || '';
    document.getElementById('msStatusInput').value = m.status;
    document.getElementById('milestoneModal').classList.add('show');
}

function closeMilestoneModal() { document.getElementById('milestoneModal').classList.remove('show'); }

function saveMilestone() {
    const title = document.getElementById('msTitleInput').value.trim();
    if (!title) { showToast('Vui lòng nhập tên milestone', 'warning'); return; }
    const c = appData.projectCards[progCurrentCardIdx];
    ensureProgData(c);
    const ms = { title, date: document.getElementById('msDateInput').value, status: document.getElementById('msStatusInput').value };
    if (progEditingMsIdx >= 0) {
        c.progMilestones[progEditingMsIdx] = ms;
        showToast('Cập nhật milestone thành công');
    } else {
        c.progMilestones.push(ms);
        addLog(`Thêm milestone "${title}" cho ${c.svName || c.ten}`);
        showToast('Thêm milestone thành công');
    }
    saveData(); closeMilestoneModal(); renderProgStudent();
}

function deleteMilestone(idx) {
    const c = appData.projectCards[progCurrentCardIdx];
    const t = c.progMilestones[idx].title;
    if (confirm(`Xóa milestone "${t}"?`)) {
        c.progMilestones.splice(idx, 1);
        saveData(); renderProgStudent();
        addLog(`Xóa milestone "${t}"`);
    }
}

// ─── CHAT ───
function setMsgType(type, btn) {
    progCurrentMsgType = type;
    document.querySelectorAll('.prog-type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function setProgChatRole(role) {
    progCurrentChatRole = role;
}

function sendProgMessage() {
    const input = document.getElementById('progChatInput');
    const text = input.value.trim();
    if (!text) { showToast('Vui lòng nhập nội dung', 'warning'); return; }
    const c = appData.projectCards[progCurrentCardIdx];
    ensureProgData(c);
    const author = progCurrentChatRole;
    c.progMessages.push({
        author,
        role: author === 'Giảng viên' ? 'advisor' : 'student',
        text,
        type: progCurrentMsgType,
        time: new Date().toLocaleString('vi-VN')
    });
    saveData(); input.value = '';
    renderProgChat(); renderProgTimeline();
    addLog(`Gửi ${progCurrentMsgType === 'question' ? 'câu hỏi' : 'nhận xét'} từ ${author} cho ${c.svName || c.ten}`);
}

function renderProgChat() {
    const c = appData.projectCards[progCurrentCardIdx];
    const el = document.getElementById('progChatMessages');
    if (!el) return;
    if (!c.progMessages.length) {
        el.innerHTML = `<div class="prog-chat-empty"><i class="ti ti-message-off"></i><p>Chưa có tin nhắn nào.</p></div>`;
        return;
    }
    el.innerHTML = c.progMessages.map(m => {
        const isAdvisor = m.role === 'advisor';
        const initials = m.author.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        const typeBadge = m.type === 'question'
            ? '<span class="prog-msg-badge question">❓ Câu hỏi</span>'
            : '<span class="prog-msg-badge feedback">📝 Nhận xét</span>';
        return `<div class="prog-msg ${isAdvisor ? 'advisor' : 'student'}">
            <div class="prog-msg-avatar" style="background:${isAdvisor ? 'var(--primary)' : 'var(--purple)'}">${initials}</div>
            <div class="prog-msg-bubble">
                <div class="prog-msg-header">
                    <span class="prog-msg-name">${m.author}</span>
                    ${typeBadge}
                    <span class="prog-msg-time">${m.time}</span>
                </div>
                <div class="prog-msg-text">${m.text}</div>
            </div>
        </div>`;
    }).join('');
    el.scrollTop = el.scrollHeight;
}

function renderProgTimeline() {
    const c = appData.projectCards[progCurrentCardIdx];
    const el = document.getElementById('progTimeline');
    if (!el) return;
    const all = [
        ...c.progMilestones.map(m => ({ time: m.date || '—', text: `Milestone: ${m.title}`, icon: 'ti-list-check', color: 'var(--primary)' })),
        ...c.progMessages.map(m => ({ time: m.time, text: `${m.author}: ${m.text.slice(0, 60)}${m.text.length > 60 ? '...' : ''}`, icon: 'ti-message', color: 'var(--purple)' }))
    ];
    if (!all.length) {
        el.innerHTML = `<div class="prog-chat-empty"><i class="ti ti-timeline"></i><p>Chưa có hoạt động nào.</p></div>`;
        return;
    }
    el.innerHTML = all.map(item => `
        <div class="prog-tl-item">
            <div class="prog-tl-dot" style="background:${item.color}"><i class="ti ${item.icon}" style="font-size:10px;color:#fff"></i></div>
            <div class="prog-tl-body">
                <div class="prog-tl-time">${item.time}</div>
                <div class="prog-tl-text">${item.text}</div>
            </div>
        </div>`).join('');
}

function handleProgFileUpload(event) {
    const c = appData.projectCards[progCurrentCardIdx];
    ensureProgData(c);
    Array.from(event.target.files).forEach(file => {
        c.progDocs.push({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', time: new Date().toLocaleString('vi-VN') });
    });
    saveData(); renderProgDocs();
    showToast('Tải lên thành công');
}

function renderProgDocs() {
    const c = appData.projectCards[progCurrentCardIdx];
    const el = document.getElementById('progDocsList');
    if (!el) return;
    if (!c.progDocs.length) {
        el.innerHTML = `<div class="prog-chat-empty"><i class="ti ti-folder-open"></i><p>Chưa có tài liệu nào.</p></div>`;
        return;
    }
    el.innerHTML = c.progDocs.map((d, i) => `
        <div class="prog-doc-item">
            <i class="ti ti-file" style="color:var(--primary);font-size:18px;flex-shrink:0"></i>
            <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.name}</div>
                <div style="font-size:11px;color:var(--text-light)">${d.size} · ${d.time}</div>
            </div>
            <button class="action-btn action-delete" onclick="deleteProgDoc(${i})" title="Xóa"><i class="ti ti-trash"></i></button>
        </div>`).join('');
}

function deleteProgDoc(i) {
    const c = appData.projectCards[progCurrentCardIdx];
    c.progDocs.splice(i, 1);
    saveData(); renderProgDocs();
}

function switchProgTab(tab, btn) {
    document.querySelectorAll('.prog-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.prog-tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`progTab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
}

// Override showPage to init progress page
const _origShowPage = showPage;
window.showPage = function(pageId, button) {
    _origShowPage(pageId, button);
    if (pageId === 'progressPage') {
        progCurrentCardIdx = 0;
        initProgressPage();
    }
};

/* ===================================
   RESET
=================================== */
function resetData() {
    if (confirm("Xóa toàn bộ dữ liệu? Thao tác không thể hoàn tác!")) {
        localStorage.removeItem("graduationProject_v2");
        location.reload();
    }
}

/* ===================================
   INIT
=================================== */
document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    loadProject();
    renderProjectDashboard();
    setRepoView(appData.repoView || "card");
    renderProjectCards();
    renderDashboardTable();
    renderDeadlines();
    renderGithub();
    renderFeedbacks();
    renderQuickFeedbacks();
    renderLogs();
    updateDashboard();
    updateDeadlineBadge();
    updateGithubQuickBtn();
});
