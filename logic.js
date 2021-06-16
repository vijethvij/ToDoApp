$(document).ready(() => {
    const form = $("#form");
    const display = $("#display");
    const todoUserInput = $("#todoUserInput");
    
    const getTodos = () => {
        console.log("In gt todos");
        fetch("/getTodos", { method: "GET" })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                buildTodos(data);
            });
    };

    getTodos();

    const editTodo = (todo, todoID, editID) => {
        let editBtn = $(`#${editID}`);
        let value = todoUserInput.val();
        editBtn.click(() => {
            console.log(value);
            fetch(`/${todo._id}`, {
                method: "PUT",
                body: JSON.stringify({ todo: todoUserInput.val() }),
                headers: {
                    "content-type": "application/json; charset = utf-8",
                },
            }).then((response) => {
                    return response.json();
            }).then((data) => {
                if (data.ok == 1) {
                    console.log(data);
                    let todoIndex = $(`#${todoID}`);
                    todoIndex.html(data.value.todo);
                    resetTodosInput();
                }
            });
        });
    };

    const deleteTodo = (todo, listItemID, deleteID) => {
        let delteBtn = $(`#${deleteID}`);
        delteBtn.click(() => {
            fetch("/del", {
                method: "delete",
                body: JSON.stringify({ id: todo._id }),
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.ok == 1) {
                        $(`#${listItemID}`).remove();
                    }
                });
        });
    };

    const resetTodosInput = () => {
        todoUserInput.val("");
    };

    const buildID = (todo) => {
        return {
            editID: "edit_" + todo._id,
            deleteID: "delete_" + todo._id,
            listItemID: "listItem_" + todo._id,
            todoID: "todo_" + todo._id,
        };
    };

    const buildTemplate = (todo, ids) => {
        return `<li class="list-group-item" id="${ids.listItemID}">
                    <div class="row">
                        <div class="col-md-4" id="${ids.todoID}">${todo.todo}</div>
                        <div class="col-md-4"></div>  
                        <div class="col-md-4 text-right">
                            <button type="button" class="btn btn-secondary" id="${ids.editID}">Edit</button>     
                            <button type="button" class="btn btn-danger" id="${ids.deleteID}">Delete</button>     
                        </div>      
                    </div>
                </li>`;
    };

    const buildTodos = (data) => {
        console.log(data);
        data.forEach((todo) => {
            let ids = buildID(todo);
            display.append(buildTemplate(todo, ids));
            editTodo(todo, ids.todoID, ids.editID);
            deleteTodo(todo, ids.listItemID, ids.deleteID);
        });
    };

    form.submit((e) => {
        e.preventDefault();
        let todoItem = todoUserInput.val();
        console.log(todoItem);
        fetch("/add", {
            method: "POST",
            body: JSON.stringify({ todo: todoItem }),
            headers: {
                "Content-type": "application/json; charset = utf-8",
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.result.ok == 1 && data.result.n == 1) {
                    let todo = data.document;
                    console.log(todo);
                    let ids = buildID(todo);
                    display.append(buildTemplate(todo, ids));
                    editTodo(todo, ids.todoID, ids.editID);
                    deleteTodo(todo, ids.listItemID, ids.deleteID);
                }
                resetTodosInput();
            });
    });
});
