const { Events } = require('discord.js');

const { TAUNTS_TO_TEXT } = require('./../enums.js');

const path = require('node:path');
const prism = require('prism-media');
const fs = require('fs');
const { createAudioPlayer, joinVoiceChannel, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const player = createAudioPlayer();

let queue = [];
let playing = false;

function playAudio() {
    if (playing) {return;}
    playing = true;
    let {resource, message} = queue.shift();
    try {
        const channel = message.member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        const sub = connection.subscribe(player);

        connection.on(VoiceConnectionStatus.Ready, () => {
            player.play(resource);
        });
        player.on(AudioPlayerStatus.Idle, () => {
             if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                if (queue.length > 0) {
                    player.play(queue.shift().resource);
                } else {
                    connection.destroy();
                    playing = false;
                }
            }
        });
    } catch (err) {
        message.channel.send('There was an error loading your audio :/');
        console.log(err);
    }

}

module.exports = {
	name: Events.MessageCreate,
	once: false,
	execute(message) {
	    if (message.content == 'clear') {
	        playing = false;
	        queue = [];
	        return;
	    }
		message.content = message.content.replace(/[^0-9]/g, 'n');
		if (message.content.substring(0,1) != 'n') {
		    let theNumber = '';
		    for (let i=0; i<message.content.length && message.content.substring(i,i+1) != 'n'; i++) {
		        theNumber += message.content.substring(i,i+1);
		    }
		    if (TAUNTS_TO_TEXT[theNumber]) {

                if (!message.member.voice || !message.member.voice.channel) {
                    message.channel.send(TAUNTS_TO_TEXT[theNumber]);
                    return;
                }
		        try {

                    const resource = createAudioResource('./sounds/' + theNumber + '.ogg');
                    queue.push({resource:resource,message:message});
                    if (queue.length > 10) {
                        queue.shift(); //Prevent it from getting TOO long
                    }
                    playAudio();
                } catch (err) {
                    message.channel.send('There was an error loading your audio :/');
                    console.log(err);
                }
		    }
		}
	},
};
