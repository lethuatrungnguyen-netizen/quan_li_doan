function showToast(message, type = "success") {
    const c = document.getElementById("toastContainer");
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.textContent = message;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}
