//This controller file is not actually used in passport logic, but will be
//present in any practical application and is helpful for testing

// import pg from 'pg';
import { connectionString } from './util.js';

export const getAllUsers = (req, res) => {
  const client = new pg.Client(connectionString);
  client.connect(err => {
    client.query("SELECT * FROM users")
      .then(data => {
        res.status(200).json({ users: data.rows });
        client.end();
      })
  });
};

export const fetchUser = (req, res) => {
  const client = new pg.Client(connectionString);
  const { userId } = req.params;
  client.connect(err => {
    client.query(`SELECT * FROM users WHERE id=\'${userId}\'`) //very important to use single quotes for userId
      .then(data => {
        res.status(200).json({ user: data.rows[0] });
        client.end();
      });
  });
};