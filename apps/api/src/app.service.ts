import { Injectable } from "@nestjs/common";
import type { HealthDto } from "../../../packages/config/contracts/api";

@Injectable()
export class AppService {
  getHealth(): HealthDto {
    return {
      name: "night-nest-api",
      status: "ok",
      date: "2026-07-21"
    };
  }
}
