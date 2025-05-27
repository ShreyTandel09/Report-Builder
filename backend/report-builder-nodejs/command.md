Sequelize migration commands

Generate migration:
npx sequelize-cli migration:generate --name migration-name

Run migrations:
npx sequelize-cli db:migrate

Create migration from existing model:
npx sequelize-cli model:generate --name ModelName --attributes attribute1:datatype,attribute2:datatype

Undo last migration:
npx sequelize-cli db:migrate:undo

Migration status:
npx sequelize-cli db:migrate:status
