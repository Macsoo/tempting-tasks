import {type App, ItemView, WorkspaceLeaf} from "obsidian";
import Issues from "./Issues.svelte";
import {mount, unmount} from "svelte";
import TemptingTasksPlugin from "./main";
import {IssueModal} from "./issueModal";
import type {Issue} from "./dataTypes";
import {NewBugfixModal} from "./newBugfixModal";
import {NewFeatureModal} from "./newFeatureModal";
import type {AskModal} from "./askModal";

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
		return "Issues";
	}

	async onOpen() {
		this.counter = mount(Issues, {
			target: this.contentEl,
			props: {
				initialIssues: this.plugin.settings.issues,
				newIssue: this.modal(IssueModal, async (_: void, newIssue) => {
					const issue: Issue = {
						id: await this.plugin.getNewId(),
						done: false,
						title: newIssue.title,
						customer: newIssue.customer,
						taskIDs: [],
						events: [{
							when: new Date(),
							what: {
								type: 'created',
							},
						}],
					};
					this.plugin.settings.issues.push(issue);
					await this.plugin.saveSettings();
					return this.plugin.settings.issues;
				}),
				addBugfix: this.modal(NewBugfixModal, async (issue: Issue, bugfix) => {
					await this.plugin.newTask(issue.id, {
						type: "bugfix",
						description: bugfix.description,
					});
					return this.plugin.settings.issues;
				}),
				addFeature: this.modal(NewFeatureModal, async (issue: Issue, feature) => {
					await this.plugin.newTask(issue.id, {
						type: "feature",
						event: feature.event,
						conditions: feature.conditions,
						action: feature.action,
					});
					return this.plugin.settings.issues;
				}),
				getBugfixes: this.plugin.getBugfixesForIssue.bind(this.plugin),
				onTaskChange: this.plugin.changeTaskStatus.bind(this.plugin),
			}
		});
	}

	async onClose() {
		if (this.counter) {
			await unmount(this.counter);
		}
	}

	modal<Arg, ModalResult, PromiseResult, M extends AskModal<ModalResult>>(
		modalType: { new(app: App, onSubmit: (result: ModalResult) => Promise<void>): M },
		onSubmit: (arg: Arg, modalResult: ModalResult) => Promise<PromiseResult>,
	): (arg: Arg) => Promise<PromiseResult> {
		return (arg: Arg) => new Promise<PromiseResult>(resolve => {
			new modalType(this.app, async modalResult => {
				resolve(await onSubmit(arg, modalResult));
			}).open();
		});
	}
}
