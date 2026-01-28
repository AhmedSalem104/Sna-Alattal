module.exports = {
  apps: [
    {
      name: 'sna-alattal',
      script: 'npm',
      args: 'start',
      cwd: '/home/deploy/apps/sna-alattal',

      // Prevent crash loop - wait for port release
      kill_timeout: 5000,           // Wait 5 seconds before force kill
      wait_ready: true,             // Wait for ready signal
      listen_timeout: 10000,        // Wait 10 seconds for port binding

      // Restart limits to prevent infinite loop
      max_restarts: 10,             // Max 10 restarts in restart_delay window
      min_uptime: 5000,             // Consider app started after 5 seconds
      restart_delay: 5000,          // Wait 5 seconds between restarts
      exp_backoff_restart_delay: 100, // Exponential backoff

      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Logs
      error_file: '/home/deploy/apps/sna-alattal/logs/error.log',
      out_file: '/home/deploy/apps/sna-alattal/logs/out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Auto restart on memory limit (prevent memory exhaustion)
      max_memory_restart: '500M',

      // Watch disabled in production
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs'],
    },
  ],
};
