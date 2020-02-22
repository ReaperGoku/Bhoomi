module.exports = {
    getMember: function(message, toFind = ""){
        toFind = toFind.toLowerCase();

        let target = message.guild.members.get(toFind);

        if(!target && message.mentions.members)
          target = message.mentions.members.first();
          
        if(!target && toFind){
            target = message.guild.members.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }
        if(!target)
          target = message.member;
        return target;
    },
    formatDate: function(date){
        return new Intl.DateTimeFormat('en-GB').format(date);
    },
    joinedPosition: function(message, member){

      let guild = message.member.guild;
      let ID = member.id;
      if (!guild.member(ID)) return; // It will return undefined if the ID is not valid

     let arr = guild.members.array(); // Create an array with every member
     arr.sort((a, b) => a.joinedAt - b.joinedAt); // Sort them by join date

     for (let i = 0; i < arr.length; i++) {
       //Loop though every element
       if (arr[i].id == ID) return ++i;// When you find the user, return it's position
      }
  },
}