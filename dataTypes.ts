export type TaskType = {
	type: 'bugfix'
} & Bugfix | {
	type: 'feature'
} & Feature;

export type Task = {
	id: ID
} & TaskType;

export interface Bugfix {
	versions: number[];
	description: string;
}

export interface Feature {
	event: string;
	condition: string;
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
	task: Task;
}

export interface IssueEvent {
	when: Date;
	what: IssueEventType;
	why?: string;
}

export type ID = number;

type GenerateIssues<T> = T extends any ? NewIssue & {
	issueType: T;
	tasks: Extract<Task, { type: T }>[];
	id: ID;
	events: IssueEvent[];
	status: Status;
	statusComment?: string;
	parentIssue?: ID;
} : never;

export type Issue = GenerateIssues<Task['type']>;

export interface NewIssue {
	title: string;
	customer: string;
	issueType: Task['type'];
}
