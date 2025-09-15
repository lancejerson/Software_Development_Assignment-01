const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

let users = [];

function generateRandomUsers(count) {
  const newUsers = [];
  for (let i = 0; i < count; i++) {
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const firstNames = {
      male: ['James', 'John', 'Robert', 'Michael', 'William'],
      female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth']
    };
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
    const domains = ['example.com', 'test.com', 'demo.com', 'mail.com'];
    
    const firstName = firstNames[gender][Math.floor(Math.random() * firstNames[gender].length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;
    const country = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'][Math.floor(Math.random() * 5)];
    
    newUsers.push({
      gender: gender,
      name: {
        title: gender === 'male' ? 'Mr' : 'Ms',
        first: firstName,
        last: lastName
      },
      location: {
        street: {
          number: Math.floor(Math.random() * 1000) + 1,
          name: ['Main St', 'Oak Ave', 'Maple Rd', 'Cedar Ln', 'Elm St'][Math.floor(Math.random() * 5)]
        },
        city: ['New York', 'London', 'Sydney', 'Toronto', 'Berlin'][Math.floor(Math.random() * 5)],
        state: ['NY', 'CA', 'TX', 'FL', 'IL'][Math.floor(Math.random() * 5)],
        country: country,
        postcode: Math.floor(Math.random() * 90000) + 10000
      },
      email: email,
      phone: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      picture: {
        large: `https://randomuser.me/api/portraits/${gender === 'male' ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
        medium: `https://randomuser.me/api/portraits/med/${gender === 'male' ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
        thumbnail: `https://randomuser.me/api/portraits/thumb/${gender === 'male' ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
      }
    });
  }
  return newUsers;
}

users = generateRandomUsers(100);

// Routes
app.get('/api', (req, res) => {
  const results = parseInt(req.query.results) || 1;
  const count = Math.min(Math.max(results, 1), 1000);
  
  if (count === 1) {
    res.json({
      results: [users[Math.floor(Math.random() * users.length)]]
    });
  } else {
    const randomUsers = [];
    for (let i = 0; i < count; i++) {
      randomUsers.push(users[Math.floor(Math.random() * users.length)]);
    }
    res.json({
      results: randomUsers
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});