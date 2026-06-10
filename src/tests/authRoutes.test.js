/**
 * authRoutes.test.js
 *
 * Unit tests for the central role-to-route config utility.
 * These are pure functions — no DOM, no mocks needed.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  resolveRouteForRole,
  redirectAfterLogin,
  DEFAULT_ROUTE,
} from '../utils/authRoutes';

// ── resolveRouteForRole ───────────────────────────────────────────────────────

describe('resolveRouteForRole', () => {
  it('routes ADMIN to /AdminDashboard', () => {
    expect(resolveRouteForRole('ADMIN')).toBe('/AdminDashboard');
  });

  it('is case-insensitive (admin → /AdminDashboard)', () => {
    expect(resolveRouteForRole('admin')).toBe('/AdminDashboard');
  });

  it('routes TRAINER to /EmployeeDashboard', () => {
    expect(resolveRouteForRole('TRAINER')).toBe('/EmployeeDashboard');
  });

  it('routes STAFF to /EmployeeDashboard', () => {
    expect(resolveRouteForRole('STAFF')).toBe('/EmployeeDashboard');
  });

  it('routes FRONT OFFICE to /EmployeeDashboard', () => {
    expect(resolveRouteForRole('FRONT OFFICE')).toBe('/EmployeeDashboard');
  });

  it('routes MANAGER to /EmployeeDashboard', () => {
    expect(resolveRouteForRole('MANAGER')).toBe('/EmployeeDashboard');
  });

  it('routes USER to /userdashboard', () => {
    expect(resolveRouteForRole('USER')).toBe('/userdashboard');
  });

  it('routes MEMBER to /userdashboard', () => {
    expect(resolveRouteForRole('MEMBER')).toBe('/userdashboard');
  });

  it('returns DEFAULT_ROUTE for an unknown role', () => {
    expect(resolveRouteForRole('GHOST')).toBe(DEFAULT_ROUTE);
  });

  it('returns DEFAULT_ROUTE for null', () => {
    expect(resolveRouteForRole(null)).toBe(DEFAULT_ROUTE);
  });

  it('returns DEFAULT_ROUTE for empty string', () => {
    expect(resolveRouteForRole('')).toBe(DEFAULT_ROUTE);
  });

  it('handles roles with extra whitespace', () => {
    expect(resolveRouteForRole('  admin  ')).toBe('/AdminDashboard');
  });

  // Substring matching
  it('routes SENIOR TRAINER (includes TRAINER) to /EmployeeDashboard', () => {
    expect(resolveRouteForRole('SENIOR TRAINER')).toBe('/EmployeeDashboard');
  });

  it('routes HEAD OF OFFICE (includes OFFICE) to /EmployeeDashboard', () => {
    expect(resolveRouteForRole('HEAD OF OFFICE')).toBe('/EmployeeDashboard');
  });
});

// ── redirectAfterLogin ────────────────────────────────────────────────────────

describe('redirectAfterLogin', () => {
  beforeEach(() => {
    window.location.href = '';
  });

  it('redirects ADMIN user to /AdminDashboard', () => {
    redirectAfterLogin({ role: 'ADMIN', mustChangePassword: false });
    expect(window.location.href).toBe('/AdminDashboard');
  });

  it('redirects TRAINER to /EmployeeDashboard', () => {
    redirectAfterLogin({ role: 'TRAINER', mustChangePassword: false });
    expect(window.location.href).toBe('/EmployeeDashboard');
  });

  it('redirects member to /userdashboard', () => {
    redirectAfterLogin({ role: 'USER', mustChangePassword: false });
    expect(window.location.href).toBe('/userdashboard');
  });

  it('redirects to /change-password when mustChangePassword is true', () => {
    redirectAfterLogin({ role: 'ADMIN', mustChangePassword: true });
    expect(window.location.href).toBe('/change-password');
  });

  it('redirects to DEFAULT_ROUTE when user is null', () => {
    redirectAfterLogin(null);
    expect(window.location.href).toBe(DEFAULT_ROUTE);
  });

  it('redirects to DEFAULT_ROUTE when user is undefined', () => {
    redirectAfterLogin(undefined);
    expect(window.location.href).toBe(DEFAULT_ROUTE);
  });
});
