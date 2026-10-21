// File: main.js
// Integrasi Logika Data dan Render ke Elemen DOM
const projects = [
 {
 id: 1,
 title: "Sistem Inventaris Keuangan",
 category: "Web App",
 budget: 2500000,
 completed: true
 },
 {
 id: 2,
 title: "Sistem Kasir Digital POS",
 category: "Desktop App",
 budget: 5000000,
 completed: true
 },
 {
 id: 3,
 title: "Landing Page Profil Perusahaan",
 category: "Web App",
 budget: 1500000,
 completed: false
 },
 {
 id: 4,
 title: "Aplikasi Presensi GPS Mobile",
 category: "Mobile App",
 budget: 4500000,
 completed: false
 }
];
const formatRupiah = (angka) => {
 return new Intl.NumberFormat('id-ID', {
 style: 'currency',
 currency: 'IDR',
 maximumFractionDigits: 0
 }).format(angka);
};
const updateStats = (dataList) => {
 const totalProjects = dataList.length;                         
 const totalBudget = dataList.reduce((acc, curr) => acc + curr.budget, 0);
 const completedCount = dataList.filter(item => item.completed).length;
 document.getElementById("stat-total-projects").textContent = totalProjects;
 document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);
 document.getElementById("stat-completed-projects").textContent = completedCount;
};
const renderProjects = (filteredList) => {
 const container = document.getElementById("project-list");
 if (!container) return;
 if (filteredList.length === 0) {
 container.innerHTML = "<p style='text-align: center; color: #64748b; padding: 20px;'>Tidak ada proyek pada kategori ini.</p>";
 return;
 }
 const htmlString = filteredList.map(proj => {
 const badgeClass = proj.completed ? "badge-success" : "badge-pending";
 const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";
 const title = proj.title.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
 return `
 <div class="project-card">
 <div class="project-info">
 <span class="project-category">${proj.category}</span>
 <h4>${title}</h4>
 <p class="project-budget">${formatRupiah(proj.budget)}</p>
 </div>
 <div>
 <span class="badge ${badgeClass}">${statusText}</span>
 <div class="project-actions">
 <button type="button" data-action="toggle" data-id="${proj.id}">Ubah Status</button>
 <button type="button" data-action="delete" data-id="${proj.id}">Hapus Proyek</button>
 </div>
 </div>
 </div>
 `;
 }).join("");
 container.innerHTML = htmlString;
};
document.addEventListener("DOMContentLoaded", () => {
 let selectedCategory = "Semua";
 const searchInput = document.getElementById("project-search");
 const renderCurrentProjects = () => {
 const query = searchInput.value.trim().toLowerCase();
 const filtered = projects.filter(project =>
 (selectedCategory === "Semua" || project.category === selectedCategory) &&
 project.title.toLowerCase().includes(query)
 );
 renderProjects(filtered);
 updateStats(projects);
 };
 renderCurrentProjects();
 document.getElementById("project-form").addEventListener("submit", e => {
 e.preventDefault();
 const title = document.getElementById("project-title").value.trim();
 const budget = Number(document.getElementById("project-budget").value);
 if (!title || !Number.isFinite(budget) || budget <= 0) return;
 projects.push({
 id: Date.now(), title,
 category: document.getElementById("project-category").value,
 budget, completed: document.getElementById("project-completed").checked
 });
 e.target.reset();
 renderCurrentProjects();
 });
 searchInput.addEventListener("input", renderCurrentProjects);
 const filterButtons = document.querySelectorAll(".btn-filter");
 filterButtons.forEach(btn => {
 btn.addEventListener("click", (e) => {
 filterButtons.forEach(b => b.classList.remove("active"));
 e.target.classList.add("active");
 selectedCategory = e.target.getAttribute("data-category");
 renderCurrentProjects();
 });
 });
 document.getElementById("project-list").addEventListener("click", e => {
 const button = e.target.closest("button[data-action]");
 if (!button) return;
 const id = Number(button.dataset.id);
 const index = projects.findIndex(project => project.id === id);
 if (index < 0) return;
 if (button.dataset.action === "toggle") projects[index].completed = !projects[index].completed;
 else projects.splice(index, 1);
 renderCurrentProjects();
 });
});
