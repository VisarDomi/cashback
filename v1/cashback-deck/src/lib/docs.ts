const modules = import.meta.glob('/src/docs/*.md', { query: '?raw', import: 'default', eager: true });

export const docs: Record<string, string> = {};

for (const [path, content] of Object.entries(modules)) {
	const name = path.split('/').pop()!.replace('.md', '');
	docs[name] = content as string;
}
