<template>
  <div id="app">
    <AddTodo v-on:add-todo="addTodo" />
    <Todos v-bind:todos="todos" v-on:del-todo="deleteTodo" v-on:update-todo="updateTodo" />
  </div>
</template>

<script>
import Todos from '../components/Todos';
import AddTodo from '../components/AddTodo';
import axios from 'axios';

export default {
  name: 'Home',
  components: {
    Todos,
    AddTodo
  },
  data() {
    return {
      todos: []
    }
  },
  methods: {
    deleteTodo(_id) {
      axios.delete(`http://localhost:3000/todo/delete/${_id}`)
        .then(() => this.todos = this.todos.filter( todo =>  todo._id !== _id ))
        .catch(err => console.error(err));
    },
    addTodo(newTodo) {
      const { title, completed } = newTodo;

      axios.post('http://localhost:3000/todo/new', {
        title,
        completed
      })
        .then(res => this.todos.push(res.data))
        .catch(err => console.error(err));

    },
    updateTodo(_id) {
      const todo = this.todos.filter( todo =>  todo._id == _id )[0];

      const completed = todo.completed;

      axios.post(`http://localhost:3000/todo/update/${_id}`, {
        completed
      })
        .then(() => {
          this.todos = [];
          axios.get('http://localhost:3000/todo/list')
            .then(res => this.todos = res.data)
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));

    }
  },
  created() {
    axios.get('http://localhost:3000/todo/list')
      .then(res => this.todos = res.data)
      .catch(err => console.error(err));
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.4;
}

.btn {
  display: inline-block;
  border: none;
  background: #555;
  color: #fff;
  padding: 7px 20px;
  cursor: pointer;
}
.btn:hover {
  background: #666;
}
</style>
