const { Event } = require("sheweny");

module.exports = class ReadyEvent extends Event {
  constructor(client) {
    super(client, "ready", {
      description: "Client is logged in",
      once: true,
      emitter: client,
    });
  }

  execute() {
    console.log(`connecter en tant que ${this.client.user.tag} \nje suis prêt`);

    this.client.user.setPresence({
      activities: [{
        name: 'Fait /help pour voir les commandes',
        state: 'Made by mogigame', 
        type: 'WATCHING',
      }],
      status: 'dnd',
    });
  }
};
