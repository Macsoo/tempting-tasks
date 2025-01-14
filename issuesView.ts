import {ItemView, MarkdownRenderer, type MarkdownViewModeType, WorkspaceLeaf} from "obsidian";
import Issues from "./Issues.svelte";
import {mount, unmount} from "svelte";
import TemptingTasksPlugin from "./main";
import {IssueModal} from "./issueModal";
import type {Issue, NewIssue} from "./dataTypes";

export const ISSUES_VIEW_TYPE = 'example-view';

export class IssuesView extends ItemView {
	counter: ReturnType<typeof Issues> | undefined;

	constructor(leaf: WorkspaceLeaf, private plugin: TemptingTasksPlugin) {
		super(leaf);
	}

	getViewType(): string {
		return ISSUES_VIEW_TYPE;
	}

	getDisplayText(): string {
		return "Example view";
	}

	renderMarkdown(element: HTMLElement, markdown: string): Promise<void> {
		const processedMd = markdown
			.split('\n')
			.map(r => r.trim())
			.filter(r => r !== '')
			.join('\n');
		return MarkdownRenderer.render(this.app, processedMd, element, "", this);
	}

	async onOpen() {
		this.counter = mount(Issues, {
			target: this.contentEl,
			props: {
				initialIssues: this.plugin.settings.issues,
				newIssue: () => new Promise<Issue[]>(resolve => {
					new IssueModal(this.app, async newIssue => {
						this.plugin.settings.issues.push(Object.assign({
							id: await this.plugin.getNewId(),
							tasks: [],
							events: [{
								when: new Date(),
								what: {
									type: 'created'
								}
							}],
							status: "open",
						} satisfies Omit<Issue, keyof NewIssue>, newIssue));
						await this.plugin.saveSettings();
						resolve(this.plugin.settings.issues);
					}).open();
				}),
				renderMarkdown: this.renderMarkdown.bind(this),
			}
		});
	}

	async onClose() {
		if (this.counter) {
			await unmount(this.counter);
		}
	}
}
