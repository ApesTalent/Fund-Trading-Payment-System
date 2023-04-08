module.exports = {
	apps: [
		{
			name: 'crm-backend',
			script: 'src/index.js',
			watch: true,
			watch_delay: 1000,
			max_memory_restart: '6G',
			env: {
				NODE_ENV: 'production'
			}
		}
	]
};
