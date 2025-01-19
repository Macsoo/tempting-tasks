import {type App, Setting} from "obsidian";
import type {Feature} from "./dataTypes";
import {AskModal} from "./askModal";

export class NewFeatureModal extends AskModal<Feature> {
	constructor(app: App, onSubmit: (newFeature: Feature) => Promise<void>) {
		super(app, onSubmit);
		this.setTitle("Add new feature");
		let event = "";
		const conditions = [""];
		let action = "";
		new Setting(this.contentEl)
			.setName("Event")
			.addText(text => text
				.onChange(value => event = value));
		const conditionSetting = new Setting(this.contentEl)
			.setName("Conditions")
			.setClass("conditions")
			.addExtraButton(btn => btn
				.setIcon('plus')
				.onClick(() => {
					new Setting(conditionSetting.settingEl)
						.addText(text => text)
						.addExtraButton(btn => btn
							.setIcon('move-up'))
						.addExtraButton(btn => btn
							.setIcon('move-down'))
						.addExtraButton(btn => btn
							.setIcon('trash'))
				}));
		new Setting(this.contentEl)
			.setName("Action")
			.addText(text => text
				.onChange(value => action = value));
		new Setting(this.contentEl)
			.addButton(btn => btn
				.setButtonText("Submit")
				.setCta()
				.onClick(async () => {
					if (event.length == 0) return;
					if (action.length == 0) return;
					this.close();
					await onSubmit({
						event,
						conditions,
						action,
					});
				}));
	}
}
