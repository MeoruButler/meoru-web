import { test as baseTest, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export const test = baseTest.extend({
	context: async ({ context }, use) => {
		await context.addInitScript(() =>
			window.addEventListener('beforeunload', () =>
				(window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__))
			)
		);
		await fs.promises.mkdir(path.join(process.cwd(), '.nyc_output'), { recursive: true });
		await context.exposeFunction('collectIstanbulCoverage', (coverageJSON: string) => {
			if (coverageJSON) {
				const coverage = JSON.parse(coverageJSON);
				if (Object.keys(coverage).length === 0) {
					return;
				}
				fs.writeFileSync(
					path.join(process.cwd(), `.nyc_output/coverage_${new Date().getTime()}.json`),
					JSON.stringify(coverage)
				);
			}
		});
		await use(context);
		for (const page of context.pages()) {
			await page.evaluate(() =>
				(window as any).collectIstanbulCoverage(JSON.stringify((window as any).__coverage__))
			);
		}
	}
});

export { expect };
