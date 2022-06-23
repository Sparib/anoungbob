import { BaseCommandInteraction, Client, GuildResolvable, IntegrationApplication, Interaction } from "discord.js";
import { Commands } from "src/Commands";
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

    const commands = client.application.commands.cache;

    const slashCommand = (await Commands()).find(c => c.name === interaction.commandName);
    console.log(slashCommand);

    if (!slashCommand) {
        await interaction.reply({content: "An error has occurred.", ephemeral: true});
        return;
    }

    await interaction.reply({content: "logs", ephemeral: true});

//     await interaction.deferReply({ephemeral: slashCommand.ephemeral});

//     slashCommand.run(client, interaction);
};