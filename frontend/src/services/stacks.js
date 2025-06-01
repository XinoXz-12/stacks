const BASE_URL = import.meta.env.VITE_BASE_URL;

// Build headers
const getHeaders = (isJson = true) => {
    const headers = {};
    if (isJson) headers["Content-Type"] = "application/json";
    return headers;
};

// Request
const request = async (
    endpoint,
    { method = "GET", params, body, isJson = true } = {}
) => {
    let url = `${BASE_URL}${endpoint}`;
    if (params) url += `?${new URLSearchParams(params)}`;

    const response = await fetch(url, {
        method,
        headers: getHeaders(isJson),
        body: isJson && body ? JSON.stringify(body) : body,
        mode: "cors",
        credentials: "include",
    });

    if (!response.ok) await handleError(response);
    return response.json();
};

// Handle error
const handleError = async (response) => {
    const isLoginRequest = response.url.includes("/auth/login");
    const isOnLoginPage = window.location.pathname === "/login";

    if (response.status === 401 && !isLoginRequest && !isOnLoginPage) {
        window.location.href = "/login";
        throw new Error("Sesión expirada");
    }

    let message = "Error desconocido";

    let bodyText = await response.text();

    try {
        const data = JSON.parse(bodyText);
        message = data.message || message;
    } catch {
        message = bodyText;
    }

    throw new Error(message);
};

// Get
const get = (endpoint, params) => {
    return request(endpoint, { method: "GET", params });
};

// Post
const post = (endpoint, body, isJson = true) => {
    return request(endpoint, { method: "POST", body, isJson });
};

// Put
const put = (endpoint, body, isJson = true) => {
    return request(endpoint, { method: "PUT", body, isJson });
};

// Delete
const del = (endpoint) => {
    return request(endpoint, { method: "DELETE" });
};

const api = { get, post, put, del };

// — UPLOADS —
export const getImages = (path) => `${BASE_URL}${path}`;
export const uploadImage = (imageData) => api.post(imageData, false);
export const deleteImage = (fileName) => api.del(fileName);
export const updateUserImage = (formData) =>
    api.put("/users/update-image", formData, false);

// — TEAMS —
export const getAllTeams = (filters = {}) => api.get("/teams", filters);
export const getTeamById = (id) => api.get(`/teams/${id}`);
export const getTeamsByProfile = (profileId) =>
    api.get(`/teams/profile/${profileId}/teams/`);
export const createTeam = (data) => api.post("/teams", data);
export const updateTeam = (id, data) => api.put(`/teams/${id}`, data);
export const deleteTeam = (id) => api.del(`/teams/${id}`);

// — REQUESTS —
export const getRequestsByTeam = (teamId) =>
    api.get(`/requests/team/${teamId}`);
export const getRequestsByProfile = (profileId) =>
    api.get(`/requests/profile/${profileId}`);
export const addRequest = (data) => api.post("/requests", data);
export const updateRequestStatus = (id, data) =>
    api.put(`/requests/${id}/status`, data);
export const removeRequest = (id) => api.del(`/requests/${id}`);

// — PROFILES —
export const getAllProfiles = () => api.get("/profiles");
export const getProfileById = (id) => api.get(`/profiles/${id}`);
export const getProfilesByUser = (userId) =>
    api.get(`/profiles/user/${userId}`);
export const createProfile = (data) => api.post("/profiles", data);
export const updateProfile = (id, data) => api.put(`/profiles/${id}`, data);
export const deleteProfile = (id) => api.del(`/profiles/${id}`);

// — USERS —
export const getAllUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) =>
    api.put(`/users/update-data/${id}`, data);
export const deleteUser = (id) => api.del(`/users/${id}`);
export const comparePassword = (pwd) =>
    api.post("/users/compare-password", { password: pwd });

// — MEMBERS —
export const getTeamMembers = (teamId) => api.get(`/members/${teamId}`);
export const getTeamMember = (teamId, profileId) =>
    api.get(`/members/${teamId}/${profileId}`);
export const addTeamMember = (teamId, data) =>
    api.post(`/members/${teamId}`, data);
export const removeTeamMember = (teamId, profileId) =>
    api.del(`/members/${teamId}/${profileId}`);

// — RANKS —
export const getRanksData = () => api.get("/ranks");

// — AUTH —
export const checkAuth = () => api.get("/auth/check");
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const logout = () => api.post("/auth/logout");

// — NEWS —
export const getAllNews = () => api.get("/news");

// — CHAT —
export const getMessagesByTeam = (teamId) => api.get(`/chat/${teamId}`);
export const sendMessage = (teamId, data) => api.post(`/chat/${teamId}`, data);
export const getLastMessageByTeam = (teamId) =>
    api.get(`/chat/last/${teamId}/`);
