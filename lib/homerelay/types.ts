export type Member={id:string;name:string;color:string;preferences:string[];availability:{start:string;end:string}[]};
export type Task={id:string;title:string;description:string;category:string;priority:string;owner:string;creator:string;due:string;status:string;version:number;createdAt:string;updatedAt:string;completedAt:string|null;completionNote:string};
export type Handoff={id:string;taskId:string;memberId:string;requestedBy:string;status:string;reason:string;expiresAt:string;createdAt:string};
export type Activity={id:string;actor:string;taskId:string|null;type:string;detail:string;at:string};
export type Suggestion={memberId:string;name:string;reason:string;workload:number;window:{start:string;end:string}};
export type Message={id:string;actor:string;question:string;text:string;trace:string[];taskIds:string[];candidates?:Suggestion[];at:string;mode?:string};
export type Snapshot={name:string;timezone:string;actor:string;members:Member[];tasks:Task[];handoffs:Handoff[];events:Activity[];messages:Message[];assistantMode:string};
