export type TaskType = {
	type: 'bugfix'
} & Bugfix | {
	type: 'feature'
} & Feature;

export type Task = {
	id: ID
} & TaskType;

export interface Bugfix {
	description: string;
}

export interface Feature {
	event: string;
	conditions: string[];
	action: string;
}

export type Status = 'open' | 'started' | 'pending' | 'finished' | 'closed';

export type IssueEventType = {
	type: 'created';
} | {
	type: 'changedStatus';
	from: Status;
	to: Status;
} | {
	type: 'addedTask';
	taskId: ID;
}

export interface IssueEvent {
	when: Date;
	what: IssueEventType;
	why?: string;
}

export type ID = number;

export type New<T> = T extends any ? Omit<T, 'id'> : never;

export interface Issue {
	title: string;
	customer: string;
	taskIDs: ID[];
	id: ID;
	events: IssueEvent[];
	status: Status;
	statusComment?: string;
	parentIssue?: ID;
}

export type NewIssue = Pick<Issue, 'title' | 'customer'>;
