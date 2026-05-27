/* ========================================
   AUTHENTICATION SYSTEM
   Security Implementation (localStorage Phase 1)
   ======================================== */

// Brute force protection
const loginAttempts = new Map();

const API_BASE_URL =
  localStorage.getItem("apiBaseUrl") ||
  (window.location.port === "5000" ? "" : "http://localhost:5000");

function getAuthToken() {
  return sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
}

function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Erreur serveur");
  }

  return data;
}

function isApiReachableError(error) {
  return error instanceof TypeError || /Failed to fetch|NetworkError/i.test(error.message);
}


/* ========================================
   USER STORAGE NORMALIZATION
   ======================================== */

function normalizeUser(user = {}) {
  const normalizedName =
    typeof user.name === "string" && user.name.trim()
      ? user.name.trim()
      : "";

  const normalizedPremium =
    typeof user.premium === "boolean"
      ? user.premium
      : false;

  return {
    ...user,
    name: normalizedName,
    premium: normalizedPremium,
    email: typeof user.email === "string" ? user.email.toLowerCase() : "",
    preferences: {
      theme: localStorage.getItem("theme") || "dark",
      notifications: true,
      ...(user.preferences || {}),
    },
    stats: {
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      ...(user.stats || {}),
    },
    createdAt: user.createdAt || new Date().toISOString(),
    lastLogin: user.lastLogin || null,
  };
}

function getStoredUsers() {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const normalizedUsers = users.map(normalizeUser);
  localStorage.setItem("users", JSON.stringify(normalizedUsers));
  return normalizedUsers;
}

function saveStoredUsers(users) {
  localStorage.setItem(
    "users",
    JSON.stringify(users.map((user) => normalizeUser(user))),
  );
}

/* ========================================
   PASSWORD UTILITIES
   ======================================== */

/**
 * Hash password using SHA-256
 */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Validate password strength
 */
function isStrongPassword(password) {
  // Min 8 chars, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) && email.length <= 254;
}

/* ========================================
   REGISTRATION
   ======================================== */

/**
 * Register new user
 */
async function register(email, password, name, level = "beginner") {
  // Validation
  if (!isValidEmail(email)) {
    throw new Error("Email invalide");
  }

  if (!isStrongPassword(password)) {
    throw new Error(
      "Mot de passe trop faible. Minimum 8 caractères avec majuscule et chiffre",
    );
  }

  if (!name || name.length < 2 || name.length > 50) {
    throw new Error("Nom invalide (2-50 caractères)");
  }

  try {
    const data = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name, level }),
    });

    await createSession(data.user, false, data.token);
    logActivity("register", { userId: data.user.id, source: "api" });
    return data.user;
  } catch (error) {
    if (!isApiReachableError(error)) throw error;
    console.warn("API auth indisponible, bascule en mode local:", error.message);
  }

  // Simulate delay to prevent timing attacks in local fallback
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Get existing users
  const users = getStoredUsers();

  // Check if user exists
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Un compte existe déjà avec cet email");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create new user
  const newUser = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    password: hashedPassword,
    name: name.trim(),
    premium: false,
    level,
    role: "user",
    createdAt: new Date().toISOString(),
    preferences: {
      theme: localStorage.getItem("theme") || "dark",
      notifications: true,
    },
    stats: {
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
    },
  };

  // Save user
  users.push(normalizeUser(newUser));
  saveStoredUsers(users);

  // Auto-login
  await createSession(newUser);

  // Log activity
  logActivity("register", { userId: newUser.id });

  return newUser;
}

/* ========================================
   LOGIN
   ======================================== */

/**
 * Check brute force attempts
 */
function checkBruteForce(email) {
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  // Reset after 5 minutes
  if (now - attempts.lastAttempt > fiveMinutes) {
    attempts.count = 0;
  }

  attempts.lastAttempt = now;
  attempts.count++;
  loginAttempts.set(email, attempts);

  // Max 5 attempts in 5 minutes
  if (attempts.count > 5) {
    throw new Error("Trop de tentatives. Réessayez dans 5 minutes.");
  }
}

/**
 * Login user
 */
async function login(email, password, remember = false) {
  // Brute force protection
  checkBruteForce(email);

  try {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    loginAttempts.delete(email);
    await createSession(data.user, remember, data.token);
    logActivity("login", { userId: data.user.id, source: "api" });
    return data.user;
  } catch (error) {
    if (!isApiReachableError(error)) throw error;
    console.warn("API auth indisponible, bascule en mode local:", error.message);
  }

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Get users
  const users = getStoredUsers();

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Find user
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === hashedPassword,
  );

  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  // Reset login attempts
  loginAttempts.delete(email);

  // Create session
  await createSession(user, remember);

  // Log activity
  logActivity("login", { userId: user.id });

  return user;
}

/* ========================================
   SESSION MANAGEMENT
   ======================================== */

/**
 * Generate simple JWT-like token
 */
function generateToken(userId) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      userId,
      exp: Date.now() + 30 * 60 * 1000, // 30 minutes
    }),
  );

  // In production, use proper HMAC signature
  const signature = btoa(`${header}.${payload}.SECRET`);

  return `${header}.${payload}.${signature}`;
}

function parseTokenPayload(token) {
  const [, payloadB64] = token.split(".");
  const normalized = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  return JSON.parse(atob(padded));
}

/**
 * Create user session
 */
async function createSession(user, remember = false, serverToken = null) {
  const token = serverToken || generateToken(user.id);

  // Store in sessionStorage (or localStorage if remember)
  const storage = remember ? localStorage : sessionStorage;

  storage.setItem("authToken", token);
  storage.setItem("userId", user.id || user.uid || user.firebaseUid);
  storage.setItem("firebaseUid", user.firebaseUid || user.uid || user.id);
  storage.setItem("userName", user.name);
  storage.setItem("userRole", user.role);
  storage.setItem("userEmail", user.email);
  storage.setItem("userPremium", String(Boolean(user.premium)));
  if (user.createdAt) storage.setItem("userCreatedAt", user.createdAt);
  if (user.lastLogin) storage.setItem("userLastLogin", user.lastLogin);

  // Update last login
  const users = getStoredUsers();
  const userIndex = users.findIndex((u) => u.id === user.id);
  if (userIndex !== -1) {
    users[userIndex].lastLogin = new Date().toISOString();
    saveStoredUsers(users);
  }

  // Start inactivity timer
  startInactivityTimer();
}

/**
 * Verify authentication
 */
function requireAuth() {
  const token =
    sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

  if (!token) {
    window.location.href = "/login.html";
    throw new Error("Non authentifié");
  }

  // Verify token expiration
  try {
    const payload = parseTokenPayload(token);
    const expiresAt =
      typeof payload.exp === "number" && payload.exp < 1000000000000
        ? payload.exp * 1000
        : payload.exp;

    if (expiresAt && Date.now() > expiresAt) {
      logout();
      throw new Error("Session expirée");
    }
  } catch (error) {
    logout();
    throw new Error("Token invalide");
  }

  return sessionStorage.getItem("userId") || localStorage.getItem("userId");
}

/**
 * Verify admin role
 */
function requireAdmin() {
  const userId = requireAuth();
  const role =
    sessionStorage.getItem("userRole") || localStorage.getItem("userRole");

  if (role !== "admin") {
    window.location.href = "/dashboard.html";
    throw new Error("Accès interdit - Admin uniquement");
  }

  // Log admin access
  logActivity("admin_access", { userId, page: window.location.pathname });

  return userId;
}

/**
 * Logout user
 */
function logout() {
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");

  // Log activity
  if (userId) {
    logActivity("logout", { userId });
  }

  // Clear session
  sessionStorage.clear();

  // Clear localStorage auth if exists
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("firebaseUid");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userPremium");
  localStorage.removeItem("userCreatedAt");
  localStorage.removeItem("userLastLogin");

  // Clear inactivity timer
  if (window.inactivityTimer) {
    clearTimeout(window.inactivityTimer);
  }

  // Redirect to home
  window.location.href = "/index.html";
}

/* ========================================
   INACTIVITY MANAGEMENT
   ======================================== */

/**
 * Start inactivity timer
 */
function startInactivityTimer() {
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  function resetTimer() {
    if (window.inactivityTimer) {
      clearTimeout(window.inactivityTimer);
    }

    window.inactivityTimer = setTimeout(() => {
      alert("Session expirée pour inactivité");
      logout();
    }, INACTIVITY_TIMEOUT);
  }

  // Reset on user activity
  ["mousedown", "keypress", "scroll", "touchstart"].forEach((event) => {
    document.addEventListener(event, resetTimer);
  });

  // Initial start
  resetTimer();
}

/* ========================================
   USER UTILITIES
   ======================================== */

/**
 * Get current user
 */
function getCurrentUser() {
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");

  if (!userId) return null;

  const users = getStoredUsers();
  const localUser = users.find((u) => u.id === userId);
  if (localUser) return localUser;

  return {
    id: userId,
    firebaseUid:
      sessionStorage.getItem("firebaseUid") || localStorage.getItem("firebaseUid"),
    name: sessionStorage.getItem("userName") || localStorage.getItem("userName") || "",
    email:
      sessionStorage.getItem("userEmail") || localStorage.getItem("userEmail") || "",
    role: sessionStorage.getItem("userRole") || localStorage.getItem("userRole") || "user",
    premium:
      (sessionStorage.getItem("userPremium") || localStorage.getItem("userPremium")) ===
      "true",
    createdAt:
      sessionStorage.getItem("userCreatedAt") ||
      localStorage.getItem("userCreatedAt") ||
      null,
    lastLogin:
      sessionStorage.getItem("userLastLogin") ||
      localStorage.getItem("userLastLogin") ||
      null,
  };
}

/**
 * Update user profile
 */
function updateUserProfile(updates) {
  const userId = requireAuth();
  const users = getStoredUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    throw new Error("Utilisateur non trouvé");
  }

  // Merge updates
  users[userIndex] = normalizeUser({ ...users[userIndex], ...updates });
  saveStoredUsers(users);

  // Update session storage
  if (updates.name) {
    sessionStorage.setItem("userName", updates.name);
    localStorage.setItem("userName", updates.name);
  }

  if (typeof updates.premium === "boolean") {
    sessionStorage.setItem("userPremium", String(updates.premium));
    localStorage.setItem("userPremium", String(updates.premium));
  }

  logActivity("profile_update", { userId });

  return users[userIndex];
}

/* ========================================
   ACTIVITY LOGGING
   ======================================== */

/**
 * Log user activity
 */
function logActivity(action, data = {}) {
  const logs = JSON.parse(localStorage.getItem("activityLogs") || "[]");

  logs.push({
    action,
    ...data,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });

  // Keep only last 1000 logs
  if (logs.length > 1000) {
    logs.splice(0, logs.length - 1000);
  }

  localStorage.setItem("activityLogs", JSON.stringify(logs));
}

/* ========================================
   GDPR UTILITIES
   ======================================== */

/**
 * Export user data (GDPR)
 */
function exportUserData() {
  const userId = requireAuth();
  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId);

  const progress = JSON.parse(localStorage.getItem("progress") || "[]");
  const userProgress = progress.filter((p) => p.userId === userId);

  const data = {
    user: {
      email: user.email,
      name: user.name,
      level: user.level,
      createdAt: user.createdAt,
      stats: user.stats,
    },
    progress: userProgress,
    exportedAt: new Date().toISOString(),
  };

  // Download as JSON
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mes-donnees-yoga-${Date.now()}.json`;
  a.click();

  logActivity("data_export", { userId });
}

/**
 * Delete user account (GDPR - Right to be forgotten)
 */
function deleteUserAccount() {
  const userId = requireAuth();

  if (
    !confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
    )
  ) {
    return;
  }

  // Delete user
  const users = getStoredUsers();
  const filteredUsers = users.filter((u) => u.id !== userId);
  saveStoredUsers(filteredUsers);

  // Delete progress
  const progress = JSON.parse(localStorage.getItem("progress") || "[]");
  const filteredProgress = progress.filter((p) => p.userId !== userId);
  localStorage.setItem("progress", JSON.stringify(filteredProgress));

  // Log deletion (anonymized)
  logActivity("account_deleted", { timestamp: new Date().toISOString() });

  // Logout
  logout();
}

/* ========================================
   INITIALIZATION
   ======================================== */

// Initialize default admin if no users exist
function initializeDefaultAdmin() {
  const users = getStoredUsers();

  if (users.length === 0) {
    console.log("Creating default admin account...");
    // This will be created on first registration
  }
}

// Run on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeDefaultAdmin);
} else {
  initializeDefaultAdmin();
}

// Setup logout button if exists
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});
