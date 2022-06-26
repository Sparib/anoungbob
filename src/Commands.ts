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
                    const fP = path.replace("/out", "") + "/" + t.name.replace(".js", "");
        
                    const command: Command = (await import(fP)).default as Command;

                    if (command === undefined || command === null) {
                        console.error(`Command at path ${fP} is ${command}. Does it have a default export?`);
                        continue;
                    }
                    
                    commands.push(command);
                } else if (t.isDirectory()) {
                    await loopDir(path + `/${t.name}`)
                }
            }
        }
        
        await loopDir("./out/commands");

        cachedCommands = commands;
    }
    
    return cachedCommands;
};
