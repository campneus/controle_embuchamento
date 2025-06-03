require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgresql://db_embuchamento_user:HRM1fL8ngYAgL6nJ4UKARzew0xvrUDdt@dpg-d0vfjs0gjchc7384nbqg-a.oregon-postgres.render.com/db_embuchamento',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Necessário para algumas conexões remotas como Render
      }
    }
  },
  test: {
    url: process.env.DATABASE_URL || 'postgresql://db_embuchamento_user:HRM1fL8ngYAgL6nJ4UKARzew0xvrUDdt@dpg-d0vfjs0gjchc7384nbqg-a.oregon-postgres.render.com/db_embuchamento',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  production: {
    url: process.env.DATABASE_URL || 'postgresql://db_embuchamento_user:HRM1fL8ngYAgL6nJ4UKARzew0xvrUDdt@dpg-d0vfjs0gjchc7384nbqg-a.oregon-postgres.render.com/db_embuchamento',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
