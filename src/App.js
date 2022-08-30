import './App.css';
import {useState, useReducer, createContext, useContext} from "react";

function App() {
    const initialState = {
        todoList: []
    };

    const actions = {
        ADD_TODO_ITEM: "ADD_TODO_ITEM",
        REMOVE_TODO_ITEM: "REMOVE_TODO_ITEM",
        TOGGLE_COMPLETED: "TOGGLE_COMPLETED"
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case actions.ADD_TODO_ITEM:
                return {
                    todoList: [
                        ...state.todoList,
                        {
                            id: new Date().valueOf(),
                            label: action.todoItemLabel,
                            completed: false
                        }
                    ]
                };
            case actions.REMOVE_TODO_ITEM: {
                const filteredTodoItem = state.todoList.filter(
                    (todoItem) => todoItem.id !== action.todoItemId
                );
                return {todoList: filteredTodoItem};
            }
            case actions.TOGGLE_COMPLETED: {
                const updatedTodoList = state.todoList.map((todoItem) =>
                    todoItem.id === action.todoItemId
                        ? {...todoItem, completed: !todoItem.completed}
                        : todoItem
                );
                return {todoList: updatedTodoList};
            }
            default:
                return state;
        }
    };

    const TodoListContext = createContext();

    const Provider = ({children}) => {
        const [state, dispatch] = useReducer(reducer, initialState);

        const value = {
            todoList: state.todoList,
            addTodoItem: (todoItemLabel) => {
                dispatch({type: actions.ADD_TODO_ITEM, todoItemLabel});
            },
            removeTodoItem: (todoItemId) => {
                dispatch({type: actions.REMOVE_TODO_ITEM, todoItemId});
            },
            markAsCompleted: (todoItemId) => {
                dispatch({type: actions.TOGGLE_COMPLETED, todoItemId});
            }
        };

        return (
            <TodoListContext.Provider value={value}>
                {children}
            </TodoListContext.Provider>
        );
    };

    const AddTodo = () => {
        const [inputValue, setInputValue] = useState("");
        const {addTodoItem} = useContext(TodoListContext);

        return (
            <>
                <input
                    type="text"
                    value={inputValue}
                    placeholder="name"
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                    onClick={() => {
                        addTodoItem(inputValue);
                        setInputValue("");
                    }}
                >
                    Add
                </button>
            </>
        );
    };

    const TodoList = () => {
        const {todoList, removeTodoItem, markAsCompleted} = useContext(
            TodoListContext
        );
        return (
            <ul>
                {todoList.map((todoItem) => (
                    <li
                        className={`todoItem ${todoItem.completed ? "completed" : ""}`}
                        key={todoItem.id}
                        onClick={() => markAsCompleted(todoItem.id)}
                    >
                        {todoItem.label}
                        <button
                            className="delete"
                            onClick={() => removeTodoItem(todoItem.id)}
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
        );
    };


    return (
        <div className="App">
            <Provider>
                <AddTodo/>
                <TodoList/>
            </Provider>
        </div>
    );
}

export default App;
