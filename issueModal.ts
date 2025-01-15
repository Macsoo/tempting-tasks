import {App, Setting} from "obsidian";
import type {NewIssue} from "./dataTypes";
import {AskModal} from "./askModal";

export class IssueModal extends AskModal<NewIssue> {
	constructor(app: App, onSubmit: (newIssue: NewIssue) => Promise<void>) {
		super(app, onSubmit);
		this.setTitle("Add Issue");
		let title = "";
		let customer = "";
		new Setting(this.contentEl)
			.setName("Title")
			.addText(text =>
				text.onChange(value => {
					title = value;
				}));
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
					this.close();
					await onSubmit({
						title,
						customer,
					});
				}));
	}
}
