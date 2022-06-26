import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../Command";

const Hello: Command = {
    name: "hello",
    description: "returns a greeting",
    type: "CHAT_INPUT",
    ephemeral: true,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        await interaction.followUp({
            content: "Hello There!"
        });
    }
};

export default Hello;