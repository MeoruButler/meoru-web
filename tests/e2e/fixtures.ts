import { test as baseTest, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Istanbul coverage를 위한 window 타입 확장
interface IstanbulWindow extends Window {
	collectIstanbulCoverage: (coverageJSON: string) => void;
	__coverage__: Record<string, unknown>;
}

export const test = baseTest.extend({
	context: async ({ context }, use) => {
		await context.addInitScript(() =>
			window.addEventListener('beforeunload', () =>
				(window as unknown as IstanbulWindow).collectIstanbulCoverage(
					JSON.stringify((window as unknown as IstanbulWindow).__coverage__)
				)
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
				(window as unknown as IstanbulWindow).collectIstanbulCoverage(
					JSON.stringify((window as unknown as IstanbulWindow).__coverage__)
				)
			);
		}
	}
});

export { expect };
