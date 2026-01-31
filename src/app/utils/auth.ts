/**
 * Simple auth utility for managing user session
 * In production, this would integrate with a real auth provider
 */

export type UserRole = "patient" | "clinician" | null;

const AUTH_KEY = "auth_session";

interface AuthSession {
  role: UserRole;
  loginAt: string;
}

export function login(role: UserRole): void {
  const session: AuthSession = {
    role,
    loginAt: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem("pairedDevice");
}

export function getSession(): AuthSession | null {
  const data = localStorage.getItem(AUTH_KEY);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}

export function getCurrentRole(): UserRole {
  return getSession()?.role || null;
}

