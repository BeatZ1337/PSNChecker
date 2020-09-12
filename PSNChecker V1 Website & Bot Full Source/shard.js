const {ShardingManager} = require('discord.js');
const {token} = require('./Settings/config.json');

const manager = new ShardingManager('./index.js', {
    token: token,
    shardArgs: ['--ansi', '--color', '--trace-warnings']
});

manager.spawn('auto',7500);
manager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id}`);
});
manager.on('death', s => {
    console.log(`Shard ${s.id}'s ChildProcess Exited. Reason Unknown.`);
});

manager.on('reconnecting', s => {
    console.log(`Shard ${s.id} is attempting to reconnect...`);
});

manager.on('disconnect', s => {
    console.log(`Shard ${s.id} has disconnected.`);
});

manager.on('ready', s => {
    console.log(`Shard ${s.id} started successfully.`);
});