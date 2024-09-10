const mongoose = require('mongoose');
const Event = require('./eventModel');
const Tickets = require('./ticketModel');

const events = [
    {
        image: "liveshow1.png",
        name: "The Tiger Who Came to Tea",
        description: "'The Tiger Who Came to Tea' is a delightful West End musical based on the beloved children's book by Judith Kerr.",
        category: 'Live Show',
        date: new Date("2024-09-18"), // Correct date format
        venue: "M Theatre (New Pechburi Rd.)",
        tickets: [
            { ticketType: 'Standard', price: 1500 },
            { ticketType: 'VIP', price: 2500 },
        ]
    },
    {
        image: "liveshow2.png",
        name: "4MINUTES FANCON 'TRUTH BEHIND THE TIME'",
        description: "4MINUTES FANCON 'TRUTH BEHIND THE TIME' will be held on 12 October 2024 at Paragon Hall.",
        category: 'Live Show',
        date: new Date("2024-10-12"), // Correct date format
        venue: "Paragon Hall",
        tickets: [
            { ticketType: 'Standard', price: 1500 },
            { ticketType: 'VIP', price: 7000 },
        ]
    },
    {
        image: "liveshow3.png",
        name: "The Trainee Final EP. Fan Meeting",
        description: "The Trainee Final EP. Fan Meeting will be held on 14 September 2024 at Nimibutr Stadium.",
        category: 'Live Show',
        date: new Date("2024-09-15"), // Correct date format
        venue: "Siam Pavalai Theatre (6th Fl. Siam Paragon)",
        tickets: [
            { ticketType: 'Standard', price: 1500 },
            { ticketType: 'VIP', price: 2500 },
        ]
    }
];

// Insert many documents
mongoose.connect('mongodb+srv://caelumz1121:CzYy11210819@cluster0.62nvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
      console.log('Connected to MongoDB');
      return Event.insertMany(events);
  })
  .then(() => {
      console.log('Many events are saved');
      mongoose.connection.close(); // Close connection after the operation
  })
  .catch((error) => {
      console.error('Error:', error.message);
      mongoose.connection.close(); // Close connection on error
  });


