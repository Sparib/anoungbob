import { BaseCommandInteraction, Client, GuildResolvable, IntegrationApplication, Interaction } from "discord.js";
import { Commands } from "../Commands";
import { Command } from "../Command";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    if (client.application == null) {
        await interaction.reply({content: "An error has occurred.", ephemeral: true});
        return;
    }

    const slashCommand = (await Commands()).find(c => c.name === interaction.commandName);

    if (!slashCommand) {
        await interaction.reply({content: "An error has occurred.", ephemeral: true});
        return;
    }

    await interaction.deferReply({ephemeral: slashCommand.ephemeral});

    try {
        await slashCommand.run(client, interaction);
    } catch (e) {
        console.error(e);
        await interaction.followUp({content: "An error occurred running the command"});
    }
};