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
            for (let i in TAUNTS_TO_TEXT) {
                if (TAUNTS_TO_TEXT[i].toLowerCase().includes(textToFind)) {
                    msg += i + '\\. ' + TAUNTS_TO_TEXT[i] + '\n';
                }
            }
        } else {
            textToFind = '';
            for (let i=1; i<51; i++) {
                msg += i + '. ' + TAUNTS_TO_TEXT[i] + '\n';
            }
            await interaction.reply({ content: msg, ephemeral: true});
            msg = '';
            for (let i=51; i<100; i++) {
                msg += i + '. ' + TAUNTS_TO_TEXT[i] + '\n';
            }
            await interaction.followUp({ content: msg, ephemeral: true});
            msg = '';
            for (let i=101; i<106; i++) {
                msg += i + '. ' + TAUNTS_TO_TEXT[i] + '\n';
            }
            await interaction.followUp({ content: msg, ephemeral: true});
            return;
        }


        if (msg.length >= 2000) {
            msg = msg.substring(0,1950) + '...';
        }
        if (msg.length == 0) {
            msg = 'There aren\'t any taunts that contain the phrase "' + textToFind +'"!';
        }

		await interaction.reply({ content: msg, ephemeral: true});
	},
};
