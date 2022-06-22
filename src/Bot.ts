import { get_tweet } from './twitter';
import { Client } from "discord.js";
import dotenv from 'dotenv';

dotenv.config();

console.log("Bot is starting...");

const client = new Client({
    intents: []
});
client.login(process.env.DISCORD_TOKEN);

console.log(client);
