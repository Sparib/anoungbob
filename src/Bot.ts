import { Client } from "discord.js";
import dotenv from 'dotenv';
import ready from './listeners/ready';
import interactionCreate from './listeners/interactionCreate';

dotenv.config();

console.log("Bot is starting...");

const client = new Client({
    intents: ['GUILD_MESSAGES', 'GUILD_MESSAGE_TYPING', 'GUILDS']
});

ready(client);
interactionCreate(client);

client.login(process.env.DISCORD_TOKEN);

// Handle SIGINT and kill process
process.on('SIGINT', () => {
    client.destroy();
    process.exit(0);
});
