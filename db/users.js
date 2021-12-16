//createUser, createActivity, createRoutine, getRoutinesWithoutActivities, getAllActivities, addActivityToRoutine
//npm run seed:dev

const { client } = require("./client");

 
  
async function createUser({ username, password } ) {
  try { const{ rows: [users], 
} = await client.query(
    `
    INSERT INTO users(username, password)
    VALUES($1, $2)
    RETURNING * ;
  `,[username, password])
  delete users.password
    return users
//make sure to hash the password before storing it to the database
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
    try {
      const user = await getUserByUsername(username);
     if ( user.password === password){
      delete user.password;
      return user;
     } else{
       return ''
     }
    //delete users.password
    } catch (error) {
      throw error;
    }
  }
  

async function getUserById(id) {
  try {
    try {
      const { rows: [users] } = await client.query(`
      SELECT * 
      FROM users
      WHERE "id"=$1
      `,[id]);
    //might need to use password
    //  delete users.password
    return users
    } catch (error) {
      throw error;
    }
//select a user using the user's ID. Return the user object.
//do NOT return the password
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT * FROM users
    WHERE username = $1;
`, [username]);

return user;
//select a user using the user's username. Return the user object.
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  getUser,
};