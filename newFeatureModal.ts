import {type App} from "obsidian";
import type {Feature} from "./dataTypes";
import {AskModal} from "./askModal";

export class NewFeatureModal extends AskModal<Feature> {
	constructor(app: App, onSubmit: (newFeature: Feature) => Promise<void>) {
		super(app, onSubmit);
		this.setTitle("Add new feature");
	}
}
