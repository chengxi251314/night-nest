import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { ScriptController } from "./script.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [ScriptController],
})
export class ScriptModule {}
