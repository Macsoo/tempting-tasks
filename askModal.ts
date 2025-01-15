import {type App, Modal} from "obsidian";

export abstract class AskModal<ModalResult> extends Modal {
	protected constructor(app: App, onSubmit: (result: ModalResult) => Promise<void>) {
		super(app);
	}
}
