import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: "postgres",
			host: "tsa-canvas-db-1",
			port: 5432,
			username: "postgres",
			password: "password",
			database: "tsa-canvas-db",
			autoLoadEntities: true,
			synchronize: true,
		}),
		UsersModule,
	],
})
export class AppModule {}
