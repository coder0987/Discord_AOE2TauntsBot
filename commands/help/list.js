const { SlashCommandBuilder } = require('discord.js');
const { TAUNTS_TO_TEXT } = require('./../../enums.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('Lists ALL taunts and their numbers')
		.addStringOption(option =>
        		option.setName('text')
        		.setDescription('Find a taunt that contains the specified text')),
	async execute(interaction) {
		let msg = '';
        let textToFind = interaction.options.getString('text');
        if (textToFind) {
            textToFind = textToFind.toLowerCase();
        } else {
            textToFind = '';
        }
        for (let i in TAUNTS_TO_TEXT) {
            if (TAUNTS_TO_TEXT[i].toLowerCase().includes(textToFind)) {
                msg += i + '. ' + TAUNTS_TO_TEXT[i] + '\n';
            }
        }

        if (msg.length >= 2000) {
            msg = msg.substring(0,1950) + '...';
        }

		await interaction.reply({ content: msg, ephemeral: true});
	},
};
