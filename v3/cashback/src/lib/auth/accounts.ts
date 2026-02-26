export type Role = 'user' | 'company';

export interface DemoAccount {
	id: string;
	role: Role;
	name: string;
	subtitle: string;
	emoji: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
	{
		id: 'user_1',
		role: 'user',
		name: 'Ardi Hoxha',
		subtitle: 'ardi@email.com',
		emoji: '👤',
	},
	{
		id: 'comp_1',
		role: 'company',
		name: 'Cafe Tirana',
		subtitle: 'NIPT: L62203504M',
		emoji: '☕',
	},
];
