const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const pool = require('./connection');

//midderware
app.use(cors());
app.use(express.json());

//Routes//

//create
pool.connect();
app.post('/todos', async (req, res) => {
  try {
    const { discription } = req.body;

    const newTodo = await pool.query(
      'insert into todo(discription) values($1) returning *',
      [discription],
      (err, result) => {
        if (err) {
          console.log(err.message);
        } else {
          res.status().send(200);
        }
      }
    );
  } catch (err) {
    console.log(err.message);
  }
});

//get all data

app.get('/todos', async (req, res) => {
  try {
    const allTodo = await pool.query('select * from todo');
    res.json(allTodo.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//get a data

app.get('/todos/:id', async (req, res) => {
  try {
    const atodo = await pool.query('select * from todo where todo_id=$1', [
      req.params.id,
    ]);
    res.json(atodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
//update data

app.put('/todos/:id', async (req, res) => {
  try {
    const { discription } = req.body;
    const updateTodo = await pool.query(
      'update todo set discription = $1 where todo_id = $2 ',
      [discription, req.params.id]
    );
    res.json(updateTodo);
  } catch (err) {
    console.error(err.message);
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    // const { id } = req.body;
    let queryd = `delete from todo where todo_id = ${req.params.id}`;
    const deleteTodo = await pool.query(queryd, (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        res.send('data i deleted');
      }
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(port, () => console.log(`server listing is: ${port}`));
