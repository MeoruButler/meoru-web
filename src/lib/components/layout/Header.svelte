<script lang="ts">
	import { Sun, Moon, Monitor, Languages, Check } from 'lucide-svelte';
	import { mode, setMode } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, setLocale, locales, type Locale } from '$lib/paraglide/runtime.js';

	const currentLocale = $derived(getLocale());

	const themeOptions = [
		{ value: 'light', icon: Sun, labelKey: 'header_theme_light' },
		{ value: 'dark', icon: Moon, labelKey: 'header_theme_dark' },
		{ value: 'system', icon: Monitor, labelKey: 'header_theme_system' }
	] as const;

	function getLanguageLabel(locale: string): string {
		switch (locale) {
			case 'ko':
				return m.lang_korean();
			case 'en':
				return m.lang_english();
			case 'ja':
				return m.lang_japanese();
			case 'zh':
				return m.lang_chinese();
			default:
				return locale;
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

<header
	class="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
>
	<div
		class="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6"
	>
		<!-- Logo placeholder -->
		<div class="flex items-center gap-2">
			<span class="text-foreground text-lg font-semibold">Meoru</span>
		</div>

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
					{#each locales as locale (locale)}
						<DropdownMenu.Item
							onclick={() => handleLanguageChange(locale)}
							class="flex items-center justify-between"
						>
							<span>{getLanguageLabel(locale)}</span>
							{#if currentLocale === locale}
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
							{#if mode.current === option.value}
								<Check class="ml-2 size-4" />
							{/if}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</header>
