import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { Command } from "../Command";
import { get_tweet, tweetInfo } from "../twitter";
import { config } from "../Bot";

var entities = {
    'amp': '&',
    'apos': '\'',
    'lt': '<',
    'gt': '>',
    'quot': '"',
    'nbsp': '\xa0'
};
var entityPattern = /&([a-z]+);/ig;

export function decodeHTML(text: string): string {
    // A single replace pass with a static RegExp is faster than a loop
    return text.replace(entityPattern, function (match: string, entity: string) {
        entity = entity.toLowerCase();
        if (entities.hasOwnProperty(entity)) {
            return entities[entity as keyof typeof entities];
        }
        // return original string if there is no matching entity (no replace)
        return match;
    });
};

const Tweet: Command = {
    name: "tweet",
    description: "Gets a tweet and replies with it",
    type: "CHAT_INPUT",
    ephemeral: true,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        if (interaction.user.id as string !== config.DISCORD_SPARIB_ID) {
            await interaction.followUp({ content: "You do not have the permission to do this!" });
            return;
        }
        const tweet: tweetInfo | null = await get_tweet();
        if (tweet === null) {
            await interaction.followUp({ content: "An error occurred retrieving the tweet." });
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

        await interaction.followUp({ embeds: [embed] });
    }
}

export default Tweet;