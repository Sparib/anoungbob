import { Client } from "discord.js";
import dotenv from 'dotenv';
import ready from './listeners/ready';
import interactionCreate from './listeners/interactionCreate';
import { readFileSync, existsSync } from "fs";

var env!: string | Buffer;

if (process.env.ENV_FILE === undefined) {
    if (!existsSync("./.env")) {
        throw new Error("There is no .env file!");
    }
    env = readFileSync("./.env");
} else {
    env = process.env.ENV_FILE;
}

interface env_config {
    DISCORD_TOKEN: string,
    TWITTER_TOKEN: string,
    DISCORD_USER_ID: number,
    DISCORD_GUILD_ID: number,
    DISCORD_CHANNEL_ID: number
}

export var config = dotenv.parse(env);

console.log("Bot is starting...");

const client = new Client({
    intents: ['GUILD_MESSAGES', 'GUILD_MESSAGE_TYPING', 'GUILDS']
});

ready(client);
interactionCreate(client);

client.login(config.DISCORD_TOKEN);

// Handle SIGINT and kill process
process.on('SIGINT', () => {
    client.destroy();
    process.exit(0);
});
