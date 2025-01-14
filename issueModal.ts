import {App, ButtonComponent, Modal, Setting} from "obsidian";
import type {NewIssue, Task} from "./dataTypes";

export class IssueModal extends Modal {
	constructor(app: App, onSubmit: (newIssue: NewIssue) => Promise<void>) {
		super(app);
		this.setTitle("Add Issue");
		let title = "";
		let customer = "";
		let issueType = "";
		new Setting(this.contentEl)
			.setName("Title")
			.addText(text =>
				text.onChange(value => {
					title = value;
				}));
		let taskTypeSetting = new Setting(this.contentEl)
			.setName("Issue Type");
		const types = {
			bugfix: 'Bugfix',
			feature: 'Feature',
		}
		const buttons: ButtonComponent[] = [];
		for (const taskType in types) {
			taskTypeSetting = taskTypeSetting
				.addButton(btn => {
					buttons.push(btn);
					return btn
						.setButtonText(types[taskType as keyof typeof types])
						.onClick(() => {
							for (const button of buttons) {
								button.removeCta();
							}
							issueType = taskType;
							btn.setCta();
						});
				});
		}
		new Setting(this.contentEl)
			.setName("Customer")
			.addText(text => text
				.onChange(value => {
					customer = value;
				}));
		new Setting(this.contentEl)
			.addButton(btn => btn
				.setButtonText("Create")
				.setCta()
				.onClick(async () => {
					if (title.length == 0) return;
					if (customer.length == 0) return;
					if (issueType.length == 0) return;
					this.close();
					await onSubmit(<NewIssue>{
						title,
						customer,
						issueType,
					});
				}));
	}
}
