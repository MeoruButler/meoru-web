<script lang="ts">
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import Monitor from '@lucide/svelte/icons/monitor';
	import Languages from '@lucide/svelte/icons/languages';
	import Check from '@lucide/svelte/icons/check';
	import { userPrefersMode, setMode } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, setLocale, type Locale } from '$lib/paraglide/runtime.js';

	const currentLocale = $derived(getLocale());

	const themeOptions = [
		{ value: 'light', icon: Sun, labelKey: 'header_theme_light' },
		{ value: 'dark', icon: Moon, labelKey: 'header_theme_dark' },
		{ value: 'system', icon: Monitor, labelKey: 'header_theme_system' }
	] as const;

	const languageOptions = [
		{ value: 'ko' as Locale, flag: '🇰🇷', labelKey: 'lang_korean' },
		{ value: 'en' as Locale, flag: '🇺🇸', labelKey: 'lang_english' },
		{ value: 'ja' as Locale, flag: '🇯🇵', labelKey: 'lang_japanese' },
		{ value: 'zh' as Locale, flag: '🇨🇳', labelKey: 'lang_chinese' }
	] as const;

	function getLanguageLabel(key: string): string {
		switch (key) {
			case 'lang_korean':
				return m.lang_korean();
			case 'lang_english':
				return m.lang_english();
			case 'lang_japanese':
				return m.lang_japanese();
			case 'lang_chinese':
				return m.lang_chinese();
			default:
				return key;
		}
	}

	function handleThemeChange(newMode: 'light' | 'dark' | 'system') {
		setMode(newMode);
	}

	function handleLanguageChange(locale: Locale) {
		setLocale(locale);
	}

	function getThemeLabel(key: string): string {
		switch (key) {
			case 'header_theme_light':
				return m.header_theme_light();
			case 'header_theme_dark':
				return m.header_theme_dark();
			case 'header_theme_system':
				return m.header_theme_system();
			default:
				return key;
		}
	}
</script>

<header class="border-border/40 bg-background sticky top-0 z-50 w-full border-b">
	<div
		class="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6"
	>
		<!-- Logo -->
		<a href="/" class="flex items-center gap-2">
			<span class="text-foreground text-lg font-semibold">{m.seo_site_name()}</span>
		</a>

		<!-- Controls -->
		<div class="flex items-center gap-2">
			<!-- Language Selector -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="ghost" size="icon" aria-label={m.header_language_toggle()}>
							<Languages class="size-5" />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					{#each languageOptions as option (option.value)}
						<DropdownMenu.Item
							onclick={() => handleLanguageChange(option.value)}
							class="flex items-center justify-between"
						>
							<div class="flex items-center gap-2">
								<span>{option.flag}</span>
								<span>{getLanguageLabel(option.labelKey)}</span>
							</div>
							{#if currentLocale === option.value}
								<Check class="ml-2 size-4" />
							{/if}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<!-- Theme Toggle -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="ghost" size="icon" aria-label={m.header_theme_toggle()}>
							<Sun class="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
							<Moon
								class="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
							/>
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					{#each themeOptions as option (option.value)}
						<DropdownMenu.Item
							onclick={() => handleThemeChange(option.value)}
							class="flex items-center justify-between"
						>
							<div class="flex items-center gap-2">
								<option.icon class="size-4" />
								<span>{getThemeLabel(option.labelKey)}</span>
							</div>
							{#if userPrefersMode.current === option.value}
								<Check class="ml-2 size-4" />
							{/if}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</header>
