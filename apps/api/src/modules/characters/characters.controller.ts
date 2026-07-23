import { Controller, Get, Post, Put, Delete, Param, Body, Req, Res } from "@nestjs/common";
import { CharactersService } from "./characters.service";
import * as fs from "fs";
import * as path from "path";

@Controller("v1/characters")
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  findAll() { return this.charactersService.findAll(); }

  @Get(":id")
  findOne(@Param("id") id: string) { return this.charactersService.findOne(id); }

  @Post()
  create(@Body() body: any) { return this.charactersService.create(body); }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: any) { return this.charactersService.update(id, body); }

  @Delete(":id")
  remove(@Param("id") id: string) { return this.charactersService.remove(id); }

  @Post("upload")
  async uploadImage(@Req() req: any, @Res() res: any) {
    try {
      const multer = require("multer");
      const uploadDir = path.resolve(__dirname, "..", "..", "..", "..", "..", "..", "..", "..", "apps", "web", "public", "characters");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      multer({ dest: uploadDir, limits: { fileSize: 10 * 1024 * 1024 } }).single("file")(req, res, (err: any) => {
        if (err) return res.json({ error: err.message });
        const file = req.file;
        if (!file) return res.json({ error: "No file" });
        const ext = path.extname(file.originalname) || ".png";
        const newName = "user-" + Date.now() + ext;
        fs.renameSync(file.path, path.join(uploadDir, newName));
        return res.json({ imageUrl: "/characters/" + newName });
      });
    } catch (e: any) { return res.json({ error: e.message }); }
  }

  @Post(":id/background")
  async uploadBackground(@Param("id") id: string, @Req() req: any, @Res() res: any) {
    try {
      const multer = require("multer");
      const bgDir = path.resolve(__dirname, "..", "..", "..", "..", "..", "..", "..", "..", "apps", "web", "public", "backgrounds");
      if (!fs.existsSync(bgDir)) fs.mkdirSync(bgDir, { recursive: true });
      const storage = multer.diskStorage({
        destination: function(_req: any, _file: any, cb: any) { cb(null, bgDir); },
        filename: function(_req: any, file: any, cb: any) {
          const ext = path.extname(file.originalname) || ".jpg";
          cb(null, "bg-" + id + "-" + Date.now() + ext);
        }
      });
      const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }).single("file");
      upload(req, res, async (err: any) => {
        if (err) return res.json({ error: err.message });
        const file = req.file;
        if (!file) return res.json({ error: "No file" });
        const bgUrl = "/backgrounds/" + file.filename;
        await this.charactersService.update(id, { imageUrl: bgUrl });
        return res.json({ backgroundUrl: bgUrl });
      });
    } catch (e: any) { return res.json({ error: e.message }); }
  }
}
