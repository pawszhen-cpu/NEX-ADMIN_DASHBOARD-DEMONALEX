// ===== ADMIN DASHBOARD - NO FIREBASE (MOCK DATA) =====

// ===== CHECK AUTHENTICATION =====
function checkAdminAuth() {
  const adminToken = localStorage.getItem('adminToken');
  const adminEmail = localStorage.getItem('adminEmail');
  const tokenTimestamp = localStorage.getItem('tokenTimestamp');
  
  // Token expiration: 24 hours
  if (tokenTimestamp && Date.now() - parseInt(tokenTimestamp) > 24 * 60 * 60 * 1000) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('tokenTimestamp');
    window.location.href = 'index.html';
    return false;
  }
  
  if (!adminToken || !adminEmail) {
    window.location.href = 'index.html';
    return false;
  }
  
  return true;
}

if (!checkAdminAuth()) {
  throw new Error('Unauthorized access');
}

// ===== MOCK DATA =====
let mockUsers = [
  { id: 1, username: 'john_doe', email: 'john@example.com', status: 'online', joined: '2025-12-01', isBlocked: false },
  { id: 2, username: 'jane_smith', email: 'jane@example.com', status: 'offline', joined: '2025-11-15', isBlocked: false },
  { id: 3, username: 'mike_wilson', email: 'mike@example.com', status: 'online', joined: '2025-10-20', isBlocked: true },
  { id: 4, username: 'sarah_jones', email: 'sarah@example.com', status: 'online', joined: '2025-09-10', isBlocked: false },
  { id: 5, username: 'alex_brown', email: 'alex@example.com', status: 'offline', joined: '2025-08-05', isBlocked: false }
];

let mockReports = [
  { id: 1, reporter: 'john_doe', reported: 'spam_user', reason: 'Spam messages', details: 'Sending unwanted promotional content', timestamp: '2026-01-05', status: 'pending' },
  { id: 2, reporter: 'jane_smith', reported: 'toxic_user', reason: 'Harassment', details: 'Using inappropriate language', timestamp: '2026-01-04', status: 'pending' },
  { id: 3, reporter: 'mike_wilson', reported: 'fake_account', reason: 'Fake Account', details: 'Impersonating another user', timestamp: '2026-01-03', status: 'reviewed' },
  { id: 4, reporter: 'sarah_jones', reported: 'abusive_user', reason: 'Abusive behavior', details: 'Making threats to other users', timestamp: '2026-01-02', status: 'resolved' }
];

let mockAdmins = [
  { id: 1, name: 'Super Admin', email: 'admin@nexchat.com', createdAt: '2025-01-01', createdBy: 'System', isActive: true, lastLogin: '2026-01-09' },
  { id: 2, name: 'Moderator 1', email: 'mod1@nexchat.com', createdAt: '2025-06-15', createdBy: 'admin@nexchat.com', isActive: true, lastLogin: '2026-01-08' }
];

// ===== STATE VARIABLES =====
let currentAdminName = "Admin";
let selectedUserId = null;

// ===== INITIALIZE DASHBOARD =====
window.addEventListener('load', () => {
  if (!checkAdminAuth()) return;
  
  currentAdminName = localStorage.getItem('adminEmail') || 'Admin';
  document.getElementById('adminName').textContent = `${currentAdminName} (Admin)`;
  
  loadOverviewStats();
  setupTabNavigation();
  loadUsers();
});

// ===== TAB NAVIGATION =====
function setupTabNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(tabName).classList.add('active');
      
      if (tabName === 'users') loadUsers();
      if (tabName === 'reports') loadReports();
      if (tabName === 'blocked') loadBlockedUsers();
      if (tabName === 'admins') loadAdmins();
    });
  });
}

// ===== LOAD OVERVIEW STATISTICS =====
function loadOverviewStats() {
  document.getElementById('totalUsers').textContent = mockUsers.length;
  document.getElementById('totalMessages').textContent = Math.floor(Math.random() * 5000) + 1000;
  document.getElementById('pendingReports').textContent = mockReports.filter(r => r.status === 'pending').length;
  document.getElementById('blockedCount').textContent = mockUsers.filter(u => u.isBlocked).length;
}

// ===== LOAD AND DISPLAY USERS =====
function loadUsers() {
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = '';
  
  mockUsers.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div class="user-profile">
          <span style="font-size: 1.5rem;">👤</span>
          <strong>${user.username}</strong>
        </div>
      </td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td><span class="status-badge ${user.status}">${user.status.toUpperCase()}</span></td>
      <td>${user.joined}</td>
      <td>
        <button class="action-btn view-btn" onclick="showUserModal(${user.id})">👁️ View</button>
        <button class="action-btn ${user.isBlocked ? 'success-btn' : 'warn-btn'}" onclick="toggleBlockUser(${user.id})">
          ${user.isBlocked ? '✅ Unblock' : '🚫 Block'}
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ===== SHOW USER MODAL =====
function showUserModal(userId) {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return;
  
  selectedUserId = userId;
  const modal = document.getElementById('userActionModal');
  const info = document.getElementById('userActionInfo');
  
  info.innerHTML = `
    <h4>${user.username}</h4>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Status:</strong> ${user.status}</p>
    <p><strong>Joined:</strong> ${user.joined}</p>
    <p><strong>Account Status:</strong> ${user.isBlocked ? '🚫 BLOCKED' : '✅ ACTIVE'}</p>
  `;
  
  modal.style.display = 'flex';
}

// ===== TOGGLE BLOCK USER =====
function toggleBlockUser(userId) {
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    user.isBlocked = !user.isBlocked;
    showNotification(`✅ User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, 'success');
    loadUsers();
    loadBlockedUsers();
    loadOverviewStats();
    document.getElementById('userActionModal').style.display = 'none';
  }
}

// ===== DELETE USER =====
function deleteUser(userId) {
  if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
    mockUsers = mockUsers.filter(u => u.id !== userId);
    showNotification('✅ User deleted successfully', 'success');
    loadUsers();
    loadBlockedUsers();
    loadOverviewStats();
  }
}

// ===== LOAD AND DISPLAY REPORTS =====
function loadReports() {
  const container = document.getElementById('reportsContainer');
  container.innerHTML = '';
  
  mockReports.forEach(report => {
    const card = document.createElement('div');
    card.className = `report-card ${report.status}`;
    card.innerHTML = `
      <div class="report-header">
        <h3>Report from ${report.reporter}</h3>
        <span class="report-status ${report.status}">${report.status.toUpperCase()}</span>
      </div>
      <div class="report-content">
        <p><strong>Reported User:</strong> ${report.reported}</p>
        <p><strong>Reason:</strong> ${report.reason}</p>
        <p><strong>Details:</strong> ${report.details}</p>
        <p><strong>Date:</strong> ${report.timestamp}</p>
      </div>
      <div class="action-buttons">
        <button class="action-btn success-btn" onclick="handleReport(${report.id}, 'resolved')">✅ Resolve</button>
        <button class="action-btn warn-btn" onclick="handleReport(${report.id}, 'reviewed')">⚠️ Mark Reviewed</button>
        <button class="action-btn danger-btn" onclick="handleReport(${report.id}, 'dismissed')">❌ Dismiss</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// ===== HANDLE REPORT =====
function handleReport(reportId, status) {
  const report = mockReports.find(r => r.id === reportId);
  if (report) {
    report.status = status;
    showNotification(`✅ Report marked as ${status}`, 'success');
    loadReports();
    loadOverviewStats();
  }
}

// ===== LOAD BLOCKED USERS =====
function loadBlockedUsers() {
  const container = document.getElementById('blockedUsersContainer');
  container.innerHTML = '';
  
  const blockedUsers = mockUsers.filter(u => u.isBlocked);
  
  if (blockedUsers.length === 0) {
    container.innerHTML = '<p class="empty-state">No blocked users</p>';
    return;
  }
  
  blockedUsers.forEach(user => {
    const card = document.createElement('div');
    card.className = 'blocked-card';
    card.innerHTML = `
      <div class="report-header">
        <h3>${user.username}</h3>
        <span class="report-status">BLOCKED</span>
      </div>
      <div class="report-content">
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Joined:</strong> ${user.joined}</p>
        <p><strong>Status:</strong> ${user.status}</p>
      </div>
      <div class="action-buttons">
        <button class="action-btn success-btn" onclick="toggleBlockUser(${user.id})">✅ Unblock User</button>
        <button class="action-btn danger-btn" onclick="deleteUser(${user.id})">🗑️ Delete Account</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// ===== LOAD ADMINS =====
function loadAdmins() {
  const adminsList = document.getElementById('adminsList');
  adminsList.innerHTML = '';
  
  mockAdmins.forEach(admin => {
    const card = document.createElement('div');
    card.className = 'admin-card';
    card.innerHTML = `
      <div class="admin-card-header">
        <h4>👑 ${admin.name}</h4>
        <span class="admin-email">${admin.email}</span>
      </div>
      <div class="admin-details">
        <p><strong>Created:</strong> ${admin.createdAt}</p>
        <p><strong>Created By:</strong> ${admin.createdBy}</p>
        <p><strong>Status:</strong> ${admin.isActive ? '✅ Active' : '❌ Inactive'}</p>
        <p><strong>Last Login:</strong> ${admin.lastLogin || 'Never'}</p>
      </div>
      <div class="admin-actions">
        <button class="action-btn ${admin.isActive ? 'warn-btn' : 'success-btn'}" onclick="toggleAdminStatus(${admin.id})">
          ${admin.isActive ? '🔒 Deactivate' : '🔓 Activate'}
        </button>
        <button class="action-btn danger-btn" onclick="deleteAdmin(${admin.id})">🗑️ Remove</button>
      </div>
    `;
    adminsList.appendChild(card);
  });
}

// ===== TOGGLE ADMIN STATUS =====
function toggleAdminStatus(adminId) {
  const admin = mockAdmins.find(a => a.id === adminId);
  if (admin) {
    admin.isActive = !admin.isActive;
    showNotification(`✅ Admin status updated`, 'success');
    loadAdmins();
  }
}

// ===== DELETE ADMIN =====
function deleteAdmin(adminId) {
  if (confirm('Are you sure you want to remove this admin?')) {
    mockAdmins = mockAdmins.filter(a => a.id !== adminId);
    showNotification('✅ Admin removed successfully', 'success');
    loadAdmins();
  }
}

// ===== SHOW NOTIFICATION =====
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.padding = '15px 20px';
  notification.style.borderRadius = '6px';
  notification.style.zIndex = '3000';
  notification.style.fontWeight = 'bold';
  notification.style.animation = 'slideInRight 0.3s ease';
  
  if (type === 'success') {
    notification.style.background = 'rgba(76, 175, 80, 0.9)';
    notification.style.color = '#fff';
  } else if (type === 'error') {
    notification.style.background = 'rgba(244, 67, 54, 0.9)';
    notification.style.color = '#fff';
  } else {
    notification.style.background = 'rgba(0, 255, 102, 0.9)';
    notification.style.color = '#000';
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== LOGOUT =====
document.getElementById('logoutBtn').addEventListener('click', () => {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('tokenTimestamp');
    window.location.href = 'index.html';
  }
});

// ===== MODAL CLOSE =====
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.target.closest('.modal').style.display = 'none';
  });
});

// Close on outside click
window.addEventListener('click', (e) => {
  const userModal = document.getElementById('userActionModal');
  const reportModal = document.getElementById('reportModal');
  
  if (e.target === userModal) userModal.style.display = 'none';
  if (e.target === reportModal) reportModal.style.display = 'none';
});

// ===== SEARCH USERS =====
const searchInput = document.getElementById('userSearch');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#usersTableBody tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  });
}

// ===== CREATE NEW ADMIN =====
const generatePasswordBtn = document.getElementById('generatePasswordBtn');
const createAdminBtn = document.getElementById('createAdminBtn');
const newAdminEmail = document.getElementById('newAdminEmail');
const newAdminPassword = document.getElementById('newAdminPassword');
const newAdminName = document.getElementById('newAdminName');
const generatedPasswordDiv = document.getElementById('generatedPassword');
const passwordText = document.getElementById('passwordText');
const copyPasswordBtn = document.getElementById('copyPasswordBtn');

// Generate Random Password Function
function generateRandomPassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Generate Password Button
if (generatePasswordBtn) {
  generatePasswordBtn.addEventListener('click', () => {
    const password = generateRandomPassword();
    newAdminPassword.value = password;
    passwordText.textContent = password;
    generatedPasswordDiv.style.display = 'block';
  });
}

// Copy Password to Clipboard
if (copyPasswordBtn) {
  copyPasswordBtn.addEventListener('click', () => {
    const password = newAdminPassword.value;
    navigator.clipboard.writeText(password).then(() => {
      showNotification('✅ Password copied to clipboard', 'success');
    }).catch(() => {
      showNotification('❌ Failed to copy password', 'error');
    });
  });
}

// Create Admin Button
if (createAdminBtn) {
  createAdminBtn.addEventListener('click', () => {
    const email = newAdminEmail.value.trim();
    const password = newAdminPassword.value.trim();
    const name = newAdminName.value.trim();

    // Validation
    if (!email) {
      showNotification('❌ Please enter an email', 'error');
      return;
    }
    
    if (!email.includes('@')) {
      showNotification('❌ Please enter a valid email', 'error');
      return;
    }

    if (!password) {
      showNotification('❌ Please enter or generate a password', 'error');
      return;
    }

    if (!name) {
      showNotification('❌ Please enter admin name', 'error');
      return;
    }

    // Create new admin object
    const newAdmin = {
      id: mockAdmins.length + 1,
      name: name,
      email: email,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: currentAdminName,
      isActive: true,
      lastLogin: 'Just now'
    };

    // Add to mock admins
    mockAdmins.push(newAdmin);

    // Clear form
    newAdminEmail.value = '';
    newAdminPassword.value = '';
    newAdminName.value = '';
    generatedPasswordDiv.style.display = 'none';
    passwordText.textContent = '';

    // Show success notification
    showNotification(`✅ Admin "${name}" created successfully!`, 'success');

    // Reload admins list
    loadAdmins();
  });
}

// Log user activity on page load
window.onload = function() {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Admin loaded the dashboard.`);
};
