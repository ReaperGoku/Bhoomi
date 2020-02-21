module.exports = async (client) => {
    console.log('I am online');
    client.user.setActivity(': DM me for any issue!', { type: 'WATCHING' });
}