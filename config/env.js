require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://db_embuchamento_user:HRM1fL8ngYAgL6nJ4UKARzew0xvrUDdt@dpg-d0vfjs0gjchc7384nbqg-a.oregon-postgres.render.com/db_embuchamento',
  NODE_ENV: process.env.NODE_ENV || 'development'
}
