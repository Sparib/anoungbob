import { Command } from "./Command";
import fs, { existsSync } from "fs";

var cachedCommands: Command[] | null = null;

export const Commands = async (): Promise<Command[]> => {
    if (cachedCommands == null) {
        console.log("Generating command list");
        const commands: Command[] = [];

        const loopDir = async (path: string) => {
            const dir = fs.readdirSync(path, {withFileTypes: true});
            for (const t of dir) {
                if (t.isFile() && t.name.endsWith(".js")) {
                    const fP = path.replace("/src", "") + "/" + t.name.replace(".js", "");
        
                    const command: Command = (await import(fP)).default as Command;
                    
                    commands.push(command);
                } else if (t.isDirectory()) {
                    await loopDir(path + `/${t.name}`)
                }
            }
        }
        
        await loopDir("./src/commands");

        cachedCommands = commands;
    }
    
    return cachedCommands;
};
