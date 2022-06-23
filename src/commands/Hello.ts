import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../Command";

const Hello: Command = {
    name: "hello",
    description: "returns a greeting",
    type: "CHAT_INPUT",
    ephemeral: true,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const content = "Hello there!";

        await interaction.followUp({
            content
        });
    }
};

export default Hello;