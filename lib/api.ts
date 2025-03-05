// lib/api.ts

// Data model interfaces

export interface User {
  _id: string;
  email: string;
  role: string;
}

export interface Agent extends AgentCreate {
  id: string;
  _id: string;
}

export interface UserCreate {
  email: string;
  role: string;
  password?: string; // if omitted, backend defaults to "12345678"
}

export interface UserUpdate {
  email?: string;
  role?: string;
  password?: string;
}

export interface AgentCreate {
  name: string;
  role: string;
  description?: string;
  emails: string[];
  steps?: Array<{
    title: string;
    description: string;
    recordingUrl?: string;
  }>;
}

export interface AgentUpdate {
  name?: string;
  role?: string;
  description?: string;
  emails?: string[];
  steps?: Array<{ title: string; description: string }>;
}

// Set your API base URL.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// A generic helper to make HTTP requests to the backend.
async function request<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }
  return response.json();
}

/* ============================
   Authentication Endpoints
=============================*/

// POST /auth/login
export async function loginUser(email: string, password: string): Promise<User> {
  return request<User>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

/* ============================
   User Endpoints
=============================*/

// GET /users
export async function getUsers(): Promise<User[]> {
  return request<User[]>("/users");
}

// POST /users
export async function createUser(user: UserCreate): Promise<User> {
  return request<User>("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
}

// GET /users/{id}
export async function getUser(id: string): Promise<User> {
  return request<User>(`/users/${id}`);
}

// PUT /users/{id}
export async function updateUser(
  id: string,
  user: UserUpdate
): Promise<User> {
  return request<User>(`/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
}

// DELETE /users/{id}
export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to delete user");
  }
}

/* ============================
   Agent Endpoints
=============================*/

// GET /agents
export async function getAgents(): Promise<Agent[]> {
  const response = await fetch(`${API_BASE}/agents/`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch agents');
  }
  
  return response.json();
}

// POST /agents
export async function createAgent(agent: AgentCreate): Promise<Agent> {
  const response = await fetch(`${API_BASE}/agents/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agent),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create agent');
  }
  
  return response.json();
}

// Upload recording
export async function uploadRecording(
  file: Blob,
  stepIndex: number
): Promise<{ url: string; file_id: string }> {
  const formData = new FormData();
  formData.append('file', file, `step-${stepIndex + 1}.webm`);
  formData.append('step_index', stepIndex.toString());
  
  const response = await fetch(`${API_BASE}/recordings/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Failed to upload recording');
  }
  
  return response.json();
}

// GET /agents/{id}
export async function getAgent(agentId: string): Promise<Agent> {
  const response = await fetch(`${API_BASE}/agents/${agentId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch agent');
  }
  
  return response.json();
}

// PUT /agents/{id}
export async function updateAgent(agentId: string, agentUpdate: Partial<AgentCreate>): Promise<Agent> {
  const response = await fetch(`${API_BASE}/agents/${agentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agentUpdate),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update agent');
  }
  
  return response.json();
}

// DELETE /agents/{id}
export async function deleteAgent(agentId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/agents/${agentId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Failed to delete agent');
  }
}
