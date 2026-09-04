import { readFileSync } from 'node:fs';
import { createApiVersionInfo } from '../../../lib/api/api-version.js';

/** Loads a fixture from `test/fixtures/`, e.g. `loadFixture('v4/event-category.4.12.json')`. */
export function loadFixture<T = any>(relativePath: string): T {
  return JSON.parse(readFileSync(new URL('../../fixtures/' + relativePath, import.meta.url), 'utf8'));
}

/** Platform versions the adapters branch on. Patch levels are build dates, as on a real system. */
export const v412 = createApiVersionInfo('4.12.20231011');
export const v413 = createApiVersionInfo('4.13.20231219');
export const v415 = createApiVersionInfo('4.15.20240715');
export const v416 = createApiVersionInfo('4.16.20241018');
export const v417 = createApiVersionInfo('4.17.20250121');
export const v422 = createApiVersionInfo('4.22.20260409');
export const v423 = createApiVersionInfo('4.23.20260622');
export const v50 = createApiVersionInfo('5.0.20260902');
