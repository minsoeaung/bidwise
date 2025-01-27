import React, { Component, useEffect, useState } from "react";
import axios from "axios";

export const Home = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [todoName, setTodoName] = useState("Do soemthing");
    const [todoDate, setTodoDate] = useState("2021-03-01");

    useEffect(()=> {
        populateTodos();
    })

    const populateTodos = async () => {
        const res = await axios.get("api/catalog/private", {headers: {"X-CSRF": 1}});
        setError(JSON.stringify(response));
        //  if (response.ok) {
        //  const data = await response.json();
        //  this.setState({ todos: data, loading: false, error: null });
        //} else if (response.status !== 401) {
        //  this.setState({ error: response.status });
        //}
    }

    const createTodo = async (e) => {
        e.preventDefault();
        const response = await fetch("todos", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-csrf": "1",
            },
            body: JSON.stringify({
                name: todoName,
                date: todoDate,
            }),
        });

        if (response.ok) {
            var item = await response.json();
            setTodos([...todos, item]);
            setTodoName("Do something");
            setTodoDate("2021-03-02");
        } else {
            setError(response.status);
        }
    }

    const deleteTodo = async (id) => {
        const response = await fetch(`todos/${id}`, {
            method: "DELETE",
            headers: {
                "x-csrf": 1,
            },
        });
        if (response.ok) {
            const todos = todos.filter((x) => x.id !== id);
            setTodos(todos);
        } else {
            setError(response.status);
        }
    }

    return (
        <>
                <div className="banner">
                    <h1>TODOs</h1>
                </div>

                <div className="row">
                    <div className="col">
                        <h3>Add New</h3>
                    </div>

                    <form className="form-inline">
                        <div className="row g-3">
                            <div className="col-6">
                                <label htmlFor="date" className="form-label">Todo Date</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    value={todoDate}
                                    onChange={(e) => setTodoDate(e.target.value)}
                                />
                            </div>
                            <div className="col-6">
                                <label htmlFor="name" className="form-label">Todo Name</label>
                                <input
                                    className="form-control"
                                    value={todoName}
                                    onChange={(e) => setTodoName(e.target.value)}
                                />
                            </div>

                            <div className="col-12">
                                <button
                                    className="btn btn-primary"
                                    onClick={createTodo}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                {error !== null && (
                    <div className="row">
                        <div className="col">
                            <div className="alert alert-warning hide">
                                <strong>Error: </strong>
                                <span>{error}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th />
                                <th>Id</th>
                                <th>Date</th>
                                <th>Note</th>
                                <th>User</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todos.map((todo) => (
                                <tr key={todo.id}>
                                    <td>
                                        <button
                                            onClick={async () => deleteTodo(todo.id)}
                                            className="btn btn-danger"
                                        >
                                            delete
                                        </button>
                                    </td>
                                    <td>{todo.id}</td>
                                    <td>{todo.date}</td>
                                    <td>{todo.name}</td>
                                    <td>{todo.user}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
    )
}