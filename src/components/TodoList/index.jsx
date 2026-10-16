import "./index.css";

function TodoList({ data }) {
  return (
    <main className="todo-list-demo">
      <div className="todo-list-container">
        <h1>{data?.title ?? ""}</h1>
        <h1 id="todayHeading">{data?.todayHeading ?? ""}</h1>
        <ul>
          {(Array.isArray(data?.todayItems) ? data.todayItems : []).map(({ text, completed }, index) => (
            <li className={completed ? "completed" : undefined} key={`${text ?? "item"}-${index}`}>{text ?? ""}</li>
          ))}
        </ul>
        <h1>{data?.tomorrowHeading ?? ""}</h1>
        <ul>
          {(Array.isArray(data?.tomorrowItems) ? data.tomorrowItems : []).map((text, index) => (
            <li key={`${text ?? "item"}-${index}`}>{text ?? ""}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default TodoList;
