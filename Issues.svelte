<script lang="ts">
	import type {Issue} from "./dataTypes";
	import IssueTag from './Issue.svelte';
	interface Props {
		initialIssues: Issue[];
		newIssue: () => Promise<Issue[]>;
		addBugfix: (issue: Issue) => Promise<Issue[]>;
		addFeature: (issue: Issue) => Promise<Issue[]>;
	}
	let {
		initialIssues,
		newIssue,
		addBugfix,
		addFeature,
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
	$inspect(issues);
</script>

<div class="issue">
	{#each issues as issue}
		<IssueTag
			type="todo"
			title={issue.title}
			addBugfix={askNewBugfix(issue)}
			addFeature={askNewFeature(issue)}
		/>
	{/each}
	<button onclick={askNewIssue()}>Add Issue</button>
</div>
<style>
</style>
