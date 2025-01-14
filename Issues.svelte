<script lang="ts">
	import type {Issue} from "./dataTypes";
	interface Props {
		initialIssues: Issue[];
		newIssue: () => Promise<Issue[]>;
		renderMarkdown: (element: HTMLElement, markdown: string) => Promise<void>;
	}
	let {
		initialIssues,
		newIssue,
		renderMarkdown,
	}: Props = $props();
	let issues = $state(initialIssues);
	async function askNewIssue() {
		issues = await newIssue();
	}
	const onload = (el: HTMLElement, issue: Issue) => {
		renderMarkdown(el, `
		> [!warning] ${issue.title}
		> Customer: ${issue.customer}
		`);
	};
</script>

<div>
	{#each issues as issue}
		<div use:onload={issue}></div>
	{/each}
	<button onclick={askNewIssue}>Add Issue</button>
</div>
<style>
</style>
