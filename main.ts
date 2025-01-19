import {Plugin, WorkspaceLeaf} from 'obsidian';
import {ISSUES_VIEW_TYPE, IssuesView} from "./issuesView";
import type {Issue, ID, Task, New} from "./dataTypes";

export interface TemptingTasksSettings {
	issues: Issue[];
	tasks: Task[];
	maxId: ID;
}

const DEFAULT_SETTINGS: TemptingTasksSettings = {
	issues: [],
	tasks: [],
	maxId: 0,
};

export default class TemptingTasksPlugin extends Plugin {
	settings: TemptingTasksSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(
			ISSUES_VIEW_TYPE,
			leaf => new IssuesView(leaf, this)
		);

		this.addRibbonIcon('dice', 'Tempting Tasks', (evt: MouseEvent) => {
			this.activateView();
		});

		this.registerMarkdownPostProcessor((element, context) => {
			const codeblocks = element.findAll('code');

			for (const codeblock of codeblocks) {
				const text = codeblock.innerText.trim();
				if (text === ":Y:") {
					const emojiEl = codeblock.createSpan({
						text: "YIPPEE",
					});
					codeblock.replaceWith(emojiEl);
				}
			}
		});
		this.register
	}

	async activateView() {
		const {workspace} = this.app;

		let leaf: WorkspaceLeaf | null;
		const leaves = workspace.getLeavesOfType(ISSUES_VIEW_TYPE);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getLeaf('tab');
			await leaf.setViewState({
				type: ISSUES_VIEW_TYPE,
				active: true,
			});
		}

		await workspace.revealLeaf(leaf);
	}

	async onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		console.log("LOADED SETTINGS");
		console.log(this.settings);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async getNewId(): Promise<ID> {
		const id = this.settings.maxId;
		this.settings.maxId += 1;
		await this.saveSettings();
		return id;
	}

	async newTask(issueId: ID, task: New<Task>) {
		const newId = await this.getNewId();
		this.settings.tasks.push(Object.assign({
			id: newId,
			done: false,
		}, task));
		const issue = this.settings.issues.find(issue => issue.id === issueId);
		if (issue) {
			issue.taskIDs.push(newId);
			issue.events.push({
				when: new Date(),
				what: {
					type: 'addedTask',
					taskId: newId,
				}
			});
		}
		await this.saveSettings();
	}

	getBugfixesForIssue(issue: Issue) {
		return issue.taskIDs
			.map(taskID => this.settings.tasks.find(task => task.id === taskID))
			.filter(task => task !== undefined);
	}

	async changeTaskStatus(issueId: ID, taskId: ID | null, checked: boolean) {
		const issue = this.settings.issues.find(issue => issue.id === issueId);
		if (issue) {
			if (taskId !== null) {
				issue.events.push({
					when: new Date(),
					what: {
						type: checked ? 'closedTask' : 'reopenedTask',
						taskId: taskId,
					},
				});
			} else {
				issue.events.push({
					when: new Date(),
					what: {
						type: checked ? 'closedIssue' : 'reopenedIssue',
					}
				});
				issue.done = checked;
			}
		}
		if (taskId !== null) {
			const task = this.settings.tasks.find(task => task.id === taskId);
			if (task) {
				task.done = checked;
			}
		}
		await this.saveSettings();
	}
}
