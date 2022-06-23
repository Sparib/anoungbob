import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "src/Command";

const Ping: Command = {
    name: "ping",
    description: "Typical ping thing",
    type: "CHAT_INPUT",
    ephemeral: true,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        await interaction.followUp({
            content: "Pong!"
        });
    }
};

export default Ping;