import {type App, Setting} from "obsidian";
import type {Bugfix} from "./dataTypes";
import {AskModal} from "./askModal";

export class NewBugfixModal extends AskModal<Bugfix> {
	constructor(app: App, onSubmit: (newBugfix: Bugfix) => Promise<void>) {
		super(app, onSubmit);
		this.setTitle("Add new bugfix");
		let description = "";
		new Setting(this.contentEl)
			.setName("Description")
			.addTextArea(text => text
				.onChange(value => {
					description = value;
				}));
		new Setting(this.contentEl)
			.addButton(btn => btn
				.setButtonText("Submit")
				.setCta()
				.onClick(async () => {
					if (description.length == 0) return;
					this.close();
					await onSubmit({
						description,
					});
				}));
	}
}
