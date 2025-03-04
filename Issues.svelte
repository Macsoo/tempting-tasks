<script lang="ts">
	import type {Bugfix, ID, Issue, Task} from "./dataTypes";
	import IssueTag from './Issue.svelte';

	interface Props {
		initialIssues: Issue[];
		newIssue: () => Promise<Issue[]>;
		addBugfix: (issue: Issue) => Promise<Issue[]>;
		addFeature: (issue: Issue) => Promise<Issue[]>;
		getTasks: (issue: Issue) => Task[];
		onTaskChange: (issueId: ID, taskId: ID | null, checked: boolean) => Promise<void>;
	}

	let {
		initialIssues,
		newIssue,
		addBugfix,
		addFeature,
		getTasks,
		onTaskChange,
	}: Props = $props();
	let issues = $state(initialIssues);

	function updateIssuesWith<T>(func: (arg: T) => Promise<Issue[]>) {
		return (theArg: T) => async () => {
			issues = await func(theArg);
		};
	}

	const askNewIssue = updateIssuesWith<void>(newIssue);
	const askNewBugfix = updateIssuesWith(addBugfix);
	const askNewFeature = updateIssuesWith(addFeature);
</script>

<div class="issue">
	{#each issues as issue (issue.id)}
		<IssueTag
			type="todo"
			title={issue.title}
			isDone={issue.done}
			addBugfix={askNewBugfix(issue)}
			addFeature={askNewFeature(issue)}
			tasks={getTasks(issue)}
			onChecked={async (taskId, checked) => await onTaskChange(issue.id, taskId, checked)}
		/>
	{/each}
	<button onclick={askNewIssue()}>Add Issue</button>
</div>
<style>
	:global(div.setting-item.conditions) {
		display: grid;
	}

	:global(div.setting-item.conditions > :nth-child(-n + 2)) {
		padding-bottom: 0.75em;
		grid-column: 1;
		grid-row: 1;
		align-self: center;
	}

	div.issue {
		font-size: calc(var(--font-text-size) / 2);
		font-family: var(--font-text) monospace;
		line-height: var(--line-height-normal);
		max-width: var(--file-line-width);
		margin-left: auto;
		margin-right: auto;
	}
</style>
