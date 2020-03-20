module.exports = async (client) => {
    console.log('I am online');
    client.user.setActivity(' SONGS FOR YOU! <,>', { type: 'PLAYING' });
}