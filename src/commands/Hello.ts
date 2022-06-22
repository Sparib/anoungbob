import { Base, BaseCommandInteraction, Client } from "discord.js";
import { Command } from "src/Command";

export const Hello: Command = {
    name: "hello",
    description: "returns a greeting",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const content = "Hello there!";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};