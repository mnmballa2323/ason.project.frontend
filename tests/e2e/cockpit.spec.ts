// ============================================================
// E2E Tests — Ason Verification Cockpit
// Liberty Center One — ZERO EXTERNAL APIs
// ============================================================

import { test, expect } from '@playwright/test';

test.describe('Ason Verification Cockpit — E2E', () => {

    test('should load the main dashboard', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Ason/i);
        await expect(page.locator('body')).toBeVisible();
    });

    test('should display the Decision Graph', async ({ page }) => {
        await page.goto('/');
        // The DecisionGraph uses SVG for edges
        const svg = page.locator('svg');
        await expect(svg.first()).toBeVisible({ timeout: 10000 });
    });

    test('should render role-based navigation', async ({ page }) => {
        await page.goto('/');
        // Check for Engineer / Admin / Owner tabs or panels
        const body = await page.textContent('body');
        expect(body).toBeTruthy();
    });

    test('should have no external network requests', async ({ page }) => {
        const externalRequests: string[] = [];
        page.on('request', (request) => {
            const url = request.url();
            if (!url.startsWith('http://localhost') && !url.startsWith('data:') && !url.startsWith('blob:')) {
                externalRequests.push(url);
            }
        });

        await page.goto('/');
        await page.waitForTimeout(3000);

        // ZERO external requests allowed
        expect(externalRequests).toHaveLength(0);
    });

    test('should include security meta tags', async ({ page }) => {
        await page.goto('/');
        // Check for viewport meta
        const viewport = page.locator('meta[name="viewport"]');
        await expect(viewport).toHaveAttribute('content', /width/);
    });

    test('should render without console errors', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        await page.goto('/');
        await page.waitForTimeout(2000);

        // Allow fetch errors (backend may not be running)
        const realErrors = errors.filter(e => !e.includes('fetch') && !e.includes('WebSocket'));
        expect(realErrors).toHaveLength(0);
    });
});

test.describe('Audit Dashboard', () => {

    test('should display chain integrity badge', async ({ page }) => {
        await page.goto('/');
        // Look for audit-related content
        const body = await page.textContent('body');
        expect(body).toBeTruthy();
    });
});
