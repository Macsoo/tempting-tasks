import {type App, Setting} from "obsidian";
import type {Feature} from "./dataTypes";
import {AskModal} from "./askModal";

export class NewFeatureModal extends AskModal<Feature> {

	constructor(app: App, onSubmit: (newFeature: Feature) => Promise<void>) {
		super(app, onSubmit);
		this.setTitle("Add new feature");
		let event = "";
		const conditions: string[] = [];
		const conditionSettings: Setting[] = [];
		const actions: string[] = [];
		const actionSettings: Setting[] = [];
		new Setting(this.contentEl)
			.setName("Event")
			.addText(text => text
				.onChange(value => event = value));
		const conditionsSetting = new Setting(this.contentEl);
		conditionsSetting
			.setName("Conditions")
			.setClass("conditions")
			.addExtraButton(btn => btn
				.setIcon('plus')
				.onClick(this.addRow.bind(this, conditionsSetting, conditionSettings, conditions)));
		this.addRow(conditionsSetting, conditionSettings, conditions);
		const actionsSetting = new Setting(this.contentEl);
		actionsSetting
			.setName("Action")
			.setClass("conditions")
			.addExtraButton(btn => btn
				.setIcon('plus')
				.onClick(this.addRow.bind(this, actionsSetting, actionSettings, actions)));
		this.addRow(actionsSetting, actionSettings, actions);
		new Setting(this.contentEl)
			.addButton(btn => btn
				.setButtonText("Submit")
				.setCta()
				.onClick(async () => {
					console.log(conditions);
					if (event.length == 0) return;
					if (conditions.filter(c => c.trim().length > 0).length == 0) return;
					if (actions.filter(c => c.trim().length > 0).length == 0) return;
					this.close();
					await onSubmit({
						event,
						conditions,
						actions,
					});
				}));
	}

	addRow(setting: Setting, settings: Setting[], values: string[]) {
		const row = new Setting(setting.settingEl)
			.addText(text => text
				.onChange(value => {
					const index = settings.findIndex(s => s == row);
					values[index] = value;
				}))
			.addExtraButton(btn => btn
				.setIcon('move-up')
				.onClick(() => {
					const index = settings.findIndex(s => s == row);
					if (index < 1) return;
					settings[index].settingEl.parentElement?.insertBefore(
							settings[index].settingEl,
							settings[index - 1].settingEl,
					);
					[settings[index], settings[index - 1]] = [settings[index - 1], settings[index]];
					[values[index], values[index - 1]] = [values[index - 1], values[index]];
				}))
			.addExtraButton(btn => btn
				.setIcon('move-down')
				.onClick(() => {
					const index = settings.findIndex(s => s == row);
					if (index >= settings.length - 1) return;
					settings[index].settingEl.parentElement?.insertAfter(
						settings[index].settingEl,
						settings[index + 1].settingEl,
					);
					[settings[index], settings[index + 1]] = [settings[index + 1], settings[index]];
					[values[index], values[index + 1]] = [values[index + 1], values[index]];
				}))
			.addExtraButton(btn => btn
				.setIcon('trash')
				.onClick(() => {
					if (values.length <= 1) return;
					const index = settings.findIndex(s => s == row);
					row.settingEl.remove();
					settings.splice(index, 1);
					values.splice(index, 1);
				}))
			.then(s => {
				settings.push(s);
				values.push('');
			});
	}
}
