<script lang="ts">
	import type {Bugfix, ID, Issue, Task} from "./dataTypes";
	import IssueTag from './Issue.svelte';

	interface Props {
		initialIssues: Issue[];
		newIssue: () => Promise<Issue[]>;
		addBugfix: (issue: Issue) => Promise<Issue[]>;
		addFeature: (issue: Issue) => Promise<Issue[]>;
		getBugfixes: (issue: Issue) => Extract<Task, { type: 'bugfix' }>[];
		onTaskChange: (issueId: ID, taskId: ID, checked: boolean) => Promise<void>;
	}

	let {
		initialIssues,
		newIssue,
		addBugfix,
		addFeature,
		getBugfixes,
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
			addBugfix={askNewBugfix(issue)}
			addFeature={askNewFeature(issue)}
			bugfixes={getBugfixes(issue)}
			onChecked={async (taskId, checked) => await onTaskChange(issue.id, taskId, checked)}
		/>
	{/each}
	<button onclick={askNewIssue()}>Add Issue</button>
</div>
<style>
	div.issue {
		font-size: var(--font-text-size);
		font-family: var(--font-text) monospace;
		line-height: var(--line-height-normal);
		max-width: var(--file-line-width);
		margin-left: auto;
		margin-right: auto;
	}
</style>
