import { BaseCommandInteraction, Client, IntegrationApplication, Interaction } from "discord.js";
import { Commands } from "../Commands";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({content: "An error has occurred.", ephemeral: true});
        return;
    }

    await interaction.deferReply({ephemeral: slashCommand.ephemeral});

    slashCommand.run(client, interaction);
};