import { Client, MessageEmbed, TextBasedChannel } from "discord.js";
import { decodeHTML } from "../commands/Tweet";
import { get_tweet, tweetInfo } from "../twitter";
import { Commands } from "../Commands";
import { config } from '../Bot';

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) return;

        await client.application.commands.set(await Commands());

        console.log(`${client.user.username} is online`);
        await timings(client);
    })
};

async function timings(client: Client) {
    const sleep = async (time: number): Promise<void> => { await new Promise(p => setTimeout(p.bind(null), time)); };

    while (!client.isReady()) sleep(500);
    console.log("is ready");

    var date = new Date();
    console.log(date.getHours());

    const run = async () => {
        while (date.getHours() != 12) {
            console.log("not");
            await sleep(3 * 60 * 1000);
            date = new Date();
        }

        if (config.DISCORD_GUILD_ID === undefined || config.DISCORD_CHANNEL_ID === undefined) {
            return;
        }

        const guild = client.guilds.cache.get(`${config.DISCORD_GUILD_ID}`);
        if (guild === null || guild === undefined) return;

        const channel = guild.channels.cache.get(`${config.DISCORD_CHANNEL_ID}`);
        if (channel === null || channel === undefined || !channel.isText()) return;

        const textChannel = channel as TextBasedChannel;
        if (textChannel === null || textChannel === undefined) return;

        textChannel.sendTyping();
        
        const tweet: tweetInfo | null = await get_tweet();
        if (tweet === null) {
            await textChannel.send({ content: "An error occurred retrieving the tweet." });
            return;
        }
        const author = tweet.includes.users[0];

        const embed: MessageEmbed = new MessageEmbed()
            .setAuthor({ name: author.name, iconURL: author.profile_image_url, url: "https://twitter.com/" + tweet.includes.users[0].username })
            .setDescription(decodeHTML(tweet.data.text).replace(/https:\/\/t\.co\/.+/, "") + `\n\nhttps://twitter.com/${author.username}/status/${tweet.data.id}`)
            .setFooter({ text: `@${author.username} | From word: ${tweet.word}` });

        if (tweet.includes.media && tweet.includes.media[0].type === "photo") {
            embed.setImage(tweet.includes.media[0].url);
            if (tweet.includes.media.length > 1) embed.setDescription(`${embed.description}\n+ ${tweet.includes.media.length - 1} image${tweet.includes.media.length - 1 > 1 ? "s" : ""}`);
        }

        await textChannel.send({embeds: [embed]});

        await sleep(60 * 60 * 1000);

        run();
    };

    run();
}