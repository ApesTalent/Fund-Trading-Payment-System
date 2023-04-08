module.exports = {
	apps: [
		{
			name: 'crm-frontend',
			script: 'serve -s build -l 80',
			watch: true,
			watch_delay: 1000,
			max_memory_restart: '6G',
			env: {
				NODE_ENV: 'production'
			}
		}
	]
};
