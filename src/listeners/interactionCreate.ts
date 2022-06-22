import { BaseCommandInteraction, Client, Interaction } from "discord.js";
import { Commands } from "src/Commands";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction) => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({content: "An error has occurred.", ephemeral: true});
        return;
    }

    await interaction.deferReply();

    slashCommand.run(client, interaction);
};