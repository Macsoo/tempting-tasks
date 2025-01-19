<script lang="ts">
	import {PackagePlus, ShieldPlus} from "lucide-svelte";
	import type {Bugfix, ID, Task} from "./dataTypes";

	interface Props {
		type: 'note'
			| 'abstract'
			| 'info'
			| 'todo'
			| 'tip'
			| 'success'
			| 'question'
			| 'warning'
			| 'failure'
			| 'danger'
			| 'bug'
			| 'example'
			| 'quote',
		title: string,
		isDone: boolean,
		bugfixes: Extract<Task, { type: "bugfix" }>[],
		addBugfix: () => Promise<void>,
		addFeature: () => Promise<void>,
		onChecked: (taskId: ID | null, checked: boolean) => Promise<void>,
	}

	let {
		type,
		title,
		isDone,
		addBugfix,
		addFeature,
		bugfixes,
		onChecked,
	}: Props = $props();
	let tasksDone: boolean[] = $state([]);
	let issueDisabled = $derived(tasksDone.some(done => !done));
	let issueDone = $state(isDone);
	const registerBugfix = (node: HTMLInputElement, bugfix: Task) => {
		tasksDone.push(bugfix.done);
	};

	async function newBugfix() {
		await addBugfix();
		issueDone = false;
	}

	$effect(() => {
		console.log($state.snapshot(tasksDone));
	});
</script>
<div data-callout-metadata data-callout-fold data-callout={type} class="callout">
	<div class="callout-title" dir="auto">
		<div class="callout-title-inner">
			<div class="callout-title-left">
				<input
					type="checkbox"
					disabled={issueDisabled}
					class={{issueDisabled}}
					bind:checked={issueDone}
					onchange={async () => await onChecked(null, issueDone)}
				/>
				<span>{title}</span>
			</div>
			<div class="callout-title-right">
				<span title="Add bugfix" class="edit-button">
					<ShieldPlus onclick={newBugfix} xlink:title="New Bugfix"/>
				</span>
				<span title="Add feature" class="edit-button">
					<PackagePlus onclick={addFeature} xlink:title="New Feature"/>
				</span>
			</div>
		</div>
	</div>
	<div class="callout-content">
		<ul class="contains-task-list">
			{#each bugfixes as bugfix, i (bugfix.id)}
				<li data-line={i + 1} data-task class="task-list-item" dir="auto">
					<input
						data-line={i + 1}
						type="checkbox"
						class={{'task-list-item-checkbox': true, issueDone}}
						disabled={issueDone}
						use:registerBugfix={bugfix}
						bind:checked={tasksDone[i]}
						onchange={async () => await onChecked(bugfix.id, tasksDone[i])}
					/>
					<span>{bugfix.description}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
<style>
	div.callout {
		--callout-padding: var(--size-4-3) var(--size-4-4) var(--size-4-3) var(--size-4-6);
	}

	div.callout-title-inner {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	div.callout-title-left {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-inline-start: calc(var(--checkbox-size) * -1.5 + var(--list-indent));
	}

	li.task-list-item {
		display: flex;
		align-items: center;
		justify-content: start;
	}

	div.callout-title-right > :global(.edit-button) {
		cursor: pointer;
	}

	ul.contains-task-list {
		padding-inline-start: 0;
		margin-block-start: var(--p-spacing);
		margin-block-end: var(--p-spacing);
	}

	ul.contains-task-list > li.task-list-item {
		margin-inline-start: var(--list-indent);
		padding-top: var(--list-spacing);
		padding-bottom: var(--list-spacing);
	}

	ul.contains-task-list > li.task-list-item input.task-list-item-checkbox {
		margin-inline-start: calc(var(--checkbox-size) * -1.5);
	}

	input[type=checkbox]:hover.issueDisabled,
	input[type=checkbox]:active.issueDisabled,
	input[type=checkbox]:focus.issueDisabled {
		outline: 0;
		border-color: var(--checkbox-border-color);
	}

	input[type=checkbox].issueDisabled {
		background-color: var(--checkbox-border-color);
		border-color: var(--checkbox-border-color);
	}

	input[type=checkbox]:checked.issueDone {
		background-color: var(--color-green);
		border-color: var(--color-green);
	}

	input[type=checkbox].issueDisabled::after {
		content: '';
		top: -1px;
		inset-inline-start: -1px;
		position: absolute;
		width: var(--checkbox-size);
		height: var(--checkbox-size);
		display: block;
		background-color: var(--checkbox-marker-color);
		mask-position: unset;
		-webkit-mask-position: 52% 52%;
		mask-size: unset;
		-webkit-mask-size: 65%;
		mask-repeat: unset;
		-webkit-mask-repeat: no-repeat;
		mask-image: unset;
		-webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXgiPjxwYXRoIGQ9Ik0xOCA2IDYgMTgiLz48cGF0aCBkPSJtNiA2IDEyIDEyIi8+PC9zdmc+);
	}
</style>
