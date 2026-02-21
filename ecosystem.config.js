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
      listen_timeout: 15000,        // Wait 15 seconds for port binding

      // Restart limits to prevent infinite loop
      max_restarts: 15,             // Max 15 restarts
      min_uptime: 10000,            // Consider app started after 10 seconds
      restart_delay: 5000,          // Wait 5 seconds between restarts
      exp_backoff_restart_delay: 100, // Exponential backoff
      autorestart: true,            // Always restart on crash

      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Logs with rotation
      error_file: '/home/deploy/apps/sna-alattal/logs/error.log',
      out_file: '/home/deploy/apps/sna-alattal/logs/out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_size: '50M',              // Rotate logs at 50MB
      retain: 5,                    // Keep 5 rotated log files

      // Auto restart on memory limit (prevent memory exhaustion)
      max_memory_restart: '500M',

      // Cron restart: restart every day at 4 AM to prevent memory leaks
      cron_restart: '0 4 * * *',

      // Watch disabled in production
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs'],
    },
  ],
};
