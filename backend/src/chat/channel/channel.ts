import { ChannelType } from "@prisma/client";
import { IMessage, IMuted } from "../models/IChat";

export class Channel {
	private id: number;
	private name?: string;
	private owner: string;
    private type: ChannelType;
	private password?: string;
	private members: string[];
	private messages: IMessage[];
	private admin: string[];
	private banned: string[];
	private muted: IMuted[];

	public constructor(id: number, type: ChannelType, owner: string, name?: string, password?: string) {
		this.id = id;
		this.name = name || "direct";
		this.owner = owner;
		this.type = type;
		this.password = password || undefined;
		this.members = [];
		this.members.push(owner);
		this.messages = [];
		this.admin = [];
		this.admin.push(owner);
		this.banned = [];
		this.muted = [];
	}

	public getId(): number { return this.id; }
	public getName(): string { return this.name; }
	public getOwner(): string {	return this.owner; }
	public getType(): ChannelType { return this.type; }
	public getPassword(): string | undefined { return this.password; }
	public getMembers(): string[] { return this.members; }
	public getMessages(): IMessage[] { return this.messages; }

	public addMember(member: string): void {
		if (this.banned.includes(member)) throw new Error("You are banned from this channel");
		if (this.members.includes(member)) return;
		this.members.push(member);
	}

	public kickMember(member: string): void {
		if (this.type === ChannelType.DIRECT) throw new Error("Cannot kick member from direct channel");
		const index = this.members.indexOf(member);
		if (index > -1) {
			this.members.splice(index, 1);
		}
	}

	public banMember(whoban: string, toban: string): void {
		if (this.type === ChannelType.DIRECT) throw new Error("Cannot ban member from direct channel");
		if (!this.admin.includes(whoban)) throw new Error("You are not admin");
		if (this.banned.includes(toban)) throw new Error("User already banned");
		if (this.owner === toban) throw new Error("Cannot ban owner");
		this.kickMember(toban);
		this.banned.push(toban);
	}

	public unbanMember(whounban: string, tounban: string): void {
		if (this.type === ChannelType.DIRECT) throw new Error("Cannot unban member from direct channel");
		if (!this.admin.includes(whounban)) throw new Error("You are not admin");
		const index = this.banned.indexOf(tounban);
		if (index > -1) {
			this.banned.splice(index, 1);
		}
	}

	public muteMember(whomute: string, tomute: string, time: Date): void {
		if (this.type === ChannelType.DIRECT) throw new Error("Cannot mute member from direct channel");
		if (!this.admin.includes(whomute)) throw new Error("You are not admin");
		if (this.muted.find(m => m.id === tomute)) throw new Error("User already muted");
		this.muted.push({ id: tomute, time: time });
	}

	public unmuteMember(whounmute: string, tounmute: string): void {
		if (this.type === ChannelType.DIRECT) throw new Error("Cannot unmute member from direct channel");
		if (!this.admin.includes(whounmute)) throw new Error("You are not admin");
		const index = this.muted.findIndex(m => m.id === tounmute);
		if (index > -1) {
			this.muted.splice(index, 1);
		}
	}

	public unmuteFromTime(tounmute: string): void {
		if (this.type === ChannelType.DIRECT) throw new Error("Cannot unmute member from direct channel");
		const index = this.muted.findIndex(m => m.id === tounmute);
		if (index > -1) {
			this.muted.splice(index, 1);
		}
	}

	public setPassword(whoset: string, password: string): void {
		if (this.type === ChannelType.DIRECT) throw new Error("Cannot set password for direct channel");
		if (whoset !== this.owner) throw new Error("You are not owner");
		this.password = password;
		if (this.type === ChannelType.PUBLIC) this.type = ChannelType.PRIVATE;
	}

	public unsetPassword(whounset: string): void {
		if (this.type === ChannelType.DIRECT) throw new Error("Cannot unset password for direct channel");
		if (whounset !== this.owner) throw new Error("You are not owner");
		if (this.password === undefined) throw new Error("Channel has no password");
		this.password = undefined;
	}

	public addAdmin(whoadd: string, toadd: string): void {
		if (this.type === ChannelType.DIRECT) throw new Error("Cannot add admin to direct channel");
		if (!this.admin.includes(whoadd)) throw new Error("You are not admin");
		if (this.admin.includes(toadd)) throw new Error("User already admin");
		this.admin.push(toadd);
	}

	public removeAdmin(whoremove: string, toremove: string): void {
		if (this.type === ChannelType.DIRECT) throw new Error("Cannot remove admin from direct channel");
		if (!this.admin.includes(whoremove)) throw new Error("You are not admin");
		if (toremove === this.owner) throw new Error("Cannot remove owner");
		const index = this.admin.indexOf(toremove);
		if (index > -1) {
			this.admin.splice(index, 1);
		}
	}

	public	setType(whoset: string, type: ChannelType): void {
		if (this.type === ChannelType.DIRECT) throw new Error("Cannot set type for direct channel");
		if (!this.admin.includes(whoset)) throw new Error("You are not admin");
		this.type = type;
	}


	public addMessage(message: IMessage): void {
		this.messages.push(message);
	}

}
