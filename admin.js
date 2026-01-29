/**
 * ShopSabaai - Admin Logic
 */

let products = [];
let orders = [];
let users = [];

function initAdmin() {
    // Auth Check
    const user = JSON.parse(sessionStorage.getItem('sabaai_current_user') || 'null');
    if (!user || user.role !== 'admin') {
        alert('Access Denied');
        window.location.href = 'index.html';
        return;
    }

    loadData();
    renderDashboard();
    renderProducts();
    renderOrders();
    renderUsers();
}

function loadData() {
    products = JSON.parse(localStorage.getItem('sabaai_products') || '[]');
    orders = JSON.parse(localStorage.getItem('sabaai_orders') || '[]');
    users = JSON.parse(localStorage.getItem('sabaai_users') || '[]');
}

function saveData(key) {
    if (key === 'products') localStorage.setItem('sabaai_products', JSON.stringify(products));
    if (key === 'orders') localStorage.setItem('sabaai_orders', JSON.stringify(orders));
    if (key === 'users') localStorage.setItem('sabaai_users', JSON.stringify(users));
}

function logoutAdmin() {
    sessionStorage.removeItem('sabaai_current_user');
    window.location.href = 'index.html';
}

// --- Navigation ---
function showSection(id) {
    document.querySelectorAll('.section-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(id + '-section').classList.remove('hidden');

    // Update active nav
    document.querySelectorAll('.nav-item').forEach(el => {
        if (el.getAttribute('onclick').includes(id)) {
            el.classList.add('bg-purple-50', 'text-purple-600');
            el.classList.remove('text-gray-600');
        } else {
            el.classList.remove('bg-purple-50', 'text-purple-600');
            el.classList.add('text-gray-600');
        }
    });

    // Update Title
    const titles = {
        'dashboard': 'ภาพรวมระบบ',
        'products': 'จัดการสินค้า',
        'orders': 'รายการคำสั่งซื้อ',
        'users': 'จัดการผู้ใช้'
    };
    document.getElementById('page-title').innerText = titles[id];
}

// ... existing code ...

// --- Users ---
function renderUsers() {
    const tbody = document.getElementById('admin-users-table');
    tbody.innerHTML = users.map(u => `
        <tr class="hover:bg-gray-50 transition">
            <td class="p-4 font-mono text-xs text-purple-600">#${u.id}</td>
            <td class="p-4 font-bold text-gray-800">${u.name}</td>
            <td class="p-4 text-gray-600">${u.email}</td>
            <td class="p-4 text-gray-600">${u.phone}</td>
            <td class="p-4 text-center">
                <button onclick="openUserModal('${u.id}')" class="text-blue-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition mr-1">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button onclick="deleteUser('${u.id}')" class="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteUser(id) {
    if (!confirm('ต้องการลบผู้ใช้งานนี้หรือไม่?')) return;
    users = users.filter(u => u.id !== id);
    saveData('users');
    renderUsers();
}

let currentUserEditingId = null;

function openUserModal(id) {
    const u = users.find(x => x.id === id);
    if (!u) return;

    currentUserEditingId = u.id;
    const modal = document.getElementById('user-modal');
    const form = modal.querySelector('form');

    form.name.value = u.name;
    form.email.value = u.email;
    form.phone.value = u.phone;
    form.password.value = ''; // Don't show password

    modal.classList.remove('hidden');
}

function closeUserModal() {
    document.getElementById('user-modal').classList.add('hidden');
    currentUserEditingId = null;
}

function saveUser(e) {
    e.preventDefault();
    if (!currentUserEditingId) return;

    const form = e.target;
    // Find User
    const idx = users.findIndex(u => u.id === currentUserEditingId);
    if (idx !== -1) {
        users[idx].name = form.name.value;
        users[idx].email = form.email.value;
        users[idx].phone = form.phone.value;

        // Update password only if provided
        if (form.password.value.trim() !== '') {
            users[idx].password = form.password.value;
        }

        saveData('users');
        renderUsers();
        closeUserModal();
        alert('บันทึกข้อมูลเรียบร้อย');
    }
}

// Start
document.addEventListener('DOMContentLoaded', initAdmin);

// --- Dashboard ---
function renderDashboard() {
    const totalSales = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
    document.getElementById('dash-total-sales').innerText = `฿${totalSales.toLocaleString()}`;
    document.getElementById('dash-total-orders').innerText = orders.length;
    document.getElementById('dash-total-products').innerText = products.length;

    const recentOrders = orders.slice(0, 5);
    const tbody = document.getElementById('dash-recent-orders');
    tbody.innerHTML = recentOrders.map(o => `
        <tr class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
            <td class="p-4 font-mono text-xs text-purple-600">#${o.id}</td>
            <td class="p-4">${o.shippingName || 'Unknown'}</td>
            <td class="p-4 font-bold">฿${o.total}</td>
            <td class="p-4"><span class="px-2 py-1 rounded text-xs font-bold ${getStatusBadge(o.status)}">${getStatusText(o.status)}</span></td>
        </tr>
    `).join('');
}

// --- Products ---
function renderProducts() {
    const container = document.getElementById('admin-products-grid');
    container.innerHTML = products.map(p => `
        <div class="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition group overflow-hidden relative">
            <div class="h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
            </div>
            <div class="text-xs text-purple-500 font-bold uppercase mb-1">${p.category}</div>
            <h4 class="font-bold text-gray-800 line-clamp-1 mb-1">${p.name}</h4>
            <div class="flex justify-between items-center text-sm">
                <span class="font-bold text-gray-600">฿${p.price}</span>
                <span class="text-gray-400 text-xs">${p.model}</span>
            </div>
            <button onclick='editProduct("${p.id}")' class="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:text-purple-600 transition opacity-0 group-hover:opacity-100">
                <i class="fa-solid fa-pen"></i>
            </button>
        </div>
    `).join('');
}

let currentEditingId = null;

function openProductModal(product = null) {
    const modal = document.getElementById('product-modal');
    const form = modal.querySelector('form');
    const deleteBtn = document.getElementById('btn-delete-product');

    modal.classList.remove('hidden');

    if (product) {
        currentEditingId = product.id;
        document.getElementById('modal-title').innerText = 'แก้ไขสินค้า';
        form.name.value = product.name;
        form.price.value = product.price;
        form.category.value = product.category;
        form.model.value = product.model;
        form.image.value = product.image;
        form.description.value = product.description;
        deleteBtn.classList.remove('hidden');
    } else {
        currentEditingId = null;
        document.getElementById('modal-title').innerText = 'เพิ่มสินค้า';
        form.reset();
        deleteBtn.classList.add('hidden');
    }
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

function editProduct(id) {
    const p = products.find(x => x.id === id);
    if (p) openProductModal(p);
}

function saveProduct(e) {
    e.preventDefault();
    const form = e.target;

    const newProduct = {
        id: currentEditingId || 'p_' + Date.now(),
        name: form.name.value,
        price: parseInt(form.price.value),
        category: form.category.value,
        image: form.image.value,
        description: form.description.value,
        model: form.model.value
    };

    if (currentEditingId) {
        const idx = products.findIndex(x => x.id === currentEditingId);
        if (idx !== -1) products[idx] = newProduct;
    } else {
        products.push(newProduct);
    }

    saveData('products');
    renderProducts();
    renderDashboard();
    closeProductModal();
}

function deleteProduct() {
    if (!currentEditingId || !confirm('ยืนยันที่จะลบสินค้านี้?')) return;

    products = products.filter(p => p.id !== currentEditingId);
    saveData('products');
    renderProducts();
    renderDashboard();
    closeProductModal();
}

// --- Orders ---
function renderOrders() {
    const tbody = document.getElementById('admin-orders-table');
    tbody.innerHTML = orders.map(o => {
        const dateStr = new Date(o.date).toLocaleDateString('th-TH');
        const slipBtn = o.slip
            ? `<button onclick="viewSlip('${o.slip}')" class="text-blue-500 hover:underline text-xs"><i class="fa-solid fa-image"></i> ดูสลิป</button>`
            : '<span class="text-gray-300 text-xs">-</span>';

        return `
        <tr class="hover:bg-gray-50 transition">
            <td class="p-4 font-mono text-xs text-purple-600">#${o.id}</td>
            <td class="p-4 text-xs text-gray-500">${dateStr}</td>
            <td class="p-4">
                <div class="font-bold text-gray-800">${o.shippingName}</div>
                <div class="text-xs text-gray-500">${o.shippingPhone}</div>
            </td>
            <td class="p-4 text-xs text-gray-500 max-w-xs truncate" title="${o.shippingAddress}">${o.shippingAddress}</td>
            <td class="p-4 text-xs">
                <button onclick="viewOrder('${o.id}')" class="text-purple-600 hover:underline font-bold">
                    ${o.items.length} รายการ
                </button>
            </td>
            <td class="p-4">${slipBtn}</td>
            <td class="p-4 font-bold text-right">฿${o.total}</td>
            <td class="p-4 text-center">
                <select onchange="updateOrderStatus('${o.id}', this.value)" class="bg-gray-100 text-xs rounded border-0 py-1 px-2 cursor-pointer font-bold ${getStatusBadge(o.status, true)}">
                    <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>รอตรวจสอบ</option>
                    <option value="paid" ${o.status === 'paid' ? 'selected' : ''}>ชำระแล้ว</option>
                    <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>จัดส่งแล้ว</option>
                    <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>ยกเลิก</option>
                </select>
            </td>
        </tr>
        `;
    }).join('');
}

function viewOrder(id) {
    const o = orders.find(x => x.id === id);
    if (!o) return;

    const content = document.getElementById('order-modal-content');
    content.innerHTML = `
        <div class="mb-4">
            <div class="text-sm text-gray-500">Order ID</div>
            <div class="font-bold text-lg text-purple-600">#${o.id}</div>
        </div>
        <div class="space-y-3">
            ${o.items.map(item => {
        const p = products.find(prod => prod.id === item.productId) || { name: 'สินค้าที่ถูกลบ', price: 0, image: '' };
        return `
                    <div class="flex items-center space-x-3">
                        <img src="${p.image || 'https://via.placeholder.com/50'}" class="w-12 h-12 rounded object-cover bg-gray-100">
                        <div class="flex-1">
                            <div class="font-bold text-gray-800">${p.name}</div>
                            <div class="text-xs text-gray-500">รุ่น: ${p.model || '-'}</div>
                        </div>
                        <div class="text-right">
                             <div class="font-bold">x${item.qty}</div>
                             <div class="text-xs text-purple-600">฿${p.price * item.qty}</div>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
        <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <span class="font-bold text-gray-600">รวมทั้งสิ้น</span>
            <span class="font-bold text-xl text-purple-600">฿${o.total}</span>
        </div>
    `;

    document.getElementById('order-modal').classList.remove('hidden');
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.add('hidden');
}

function updateOrderStatus(id, status) {
    const order = orders.find(o => o.id === id);
    if (order) {
        order.status = status;
        saveData('orders');
        renderDashboard();
        // Force refresh UI color for select
        renderOrders();
    }
}

function viewSlip(slipName) {
    // In real app, this would be a URL. Assuming local name for now, we can't really show it unless we have object URLs.
    // For demo purposes, we'll just show the name or a placeholder if it was a real file upload.
    alert('Slip attachment: ' + slipName);
}

// --- Utils ---
function getStatusBadge(status, textOnly = false) {
    if (status === 'pending') return textOnly ? 'text-yellow-600' : 'bg-yellow-100 text-yellow-700';
    if (status === 'cancelled') return textOnly ? 'text-red-600' : 'bg-red-100 text-red-700';
    return textOnly ? 'text-green-600' : 'bg-green-100 text-green-700';
}
function getStatusText(status) {
    if (status === 'pending') return 'รอโอน';
    if (status === 'cancelled') return 'ยกเลิก';
    if (status === 'paid') return 'ชำระแล้ว';
    if (status === 'shipped') return 'ส่งแล้ว';
    return status;
}

function toggleSidebar() {
    const s = document.querySelector('.sidebar');
    s.classList.toggle('hidden');
    s.classList.toggle('absolute');
    s.classList.toggle('z-50');
    s.classList.toggle('h-full');
}


// Start
document.addEventListener('DOMContentLoaded', initAdmin);
