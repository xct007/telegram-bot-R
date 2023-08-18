export default (text, entities) => {
	const [{ type }] = entities || [{ type: null }];
	return {
		is_command: type ? true : /\//.test(text),
		text: text?.replace(/\//, "") || text,
	};
};
