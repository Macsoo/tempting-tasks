<script lang="ts">
	import {PackagePlus, ShieldPlus} from "lucide-svelte";

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
		addBugfix: () => Promise<void>,
		addFeature: () => Promise<void>,
	}

	let {
		type,
		title,
		addBugfix,
		addFeature,
	}: Props = $props();
</script>
<div data-callout-metadata data-callout-fold data-callout={type} class="callout">
	<div class="callout-title" dir="auto">
		<div class="callout-title-inner">
			<div class="callout-title-left">
				<input type="checkbox"/>
				<span>{title}</span>
			</div>
			<div class="callout-title-right">
				<ShieldPlus onclick={addBugfix} class="edit-button" xlink:title="New Bugfix"/>
				<PackagePlus onclick={addFeature} class="edit-button" xlink:title="New Feature"/>
			</div>
		</div>
	</div>
	<div class="callout-content">
		<p dir="auto">Text</p>
	</div>
</div>
<style>
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
	}

	div.callout-title-right > :global(.edit-button) {
		cursor: pointer;
	}
</style>
