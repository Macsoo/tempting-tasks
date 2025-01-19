export type TaskType = {
	type: 'bugfix'
} & Bugfix | {
	type: 'feature'
} & Feature;

export type Task = {
	id: ID,
	done: boolean,
} & TaskType;

export interface Bugfix {
	description: string;
}

export interface Feature {
	event: string;
	conditions: string[];
	action: string;
}

export type IssueEventType = {
	type: 'created';
} | {
	type: 'addedTask';
	taskId: ID;
} | {
	type: 'closedTask';
	taskId: ID;
} | {
	type: 'reopenedTask';
	taskId: ID;
} | {
	type: 'closedIssue';
} | {
	type: 'reopenedIssue';
}

export interface IssueEvent {
	when: Date;
	what: IssueEventType;
	why?: string;
}

export type ID = number;

export type New<T> = T extends any ? Omit<T, 'id' | 'done'> : never;

export interface Issue {
	title: string;
	customer: string;
	taskIDs: ID[];
	id: ID;
	done: boolean;
	events: IssueEvent[];
	parentIssue?: ID;
}

export type NewIssue = Pick<Issue, 'title' | 'customer'>;
