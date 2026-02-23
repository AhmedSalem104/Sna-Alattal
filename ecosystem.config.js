module.exports = {
  apps: [
    {
      name: 'sna-alattal',
      script: 'server.js',
      cwd: '/home/deploy/apps/sna-alattal',

      // Prevent crash loop - wait for port release
      kill_timeout: 5000,           // Wait 5 seconds before force kill
      wait_ready: false,            // Don't wait for ready signal
      listen_timeout: 30000,        // Wait 30 seconds for port binding

      // Restart limits to prevent infinite loop
      max_restarts: 10,
      min_uptime: 10000,
      restart_delay: 3000,
      exp_backoff_restart_delay: 100,
      autorestart: true,

      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },

      // Logs with rotation
      error_file: '/home/deploy/apps/sna-alattal/logs/error.log',
      out_file: '/home/deploy/apps/sna-alattal/logs/out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_size: '50M',
      retain: 5,

      // Auto restart on memory limit
      max_memory_restart: '500M',

      // Cron restart: restart every day at 4 AM
      cron_restart: '0 4 * * *',

      // Watch disabled in production
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs'],
    },
  ],
};
