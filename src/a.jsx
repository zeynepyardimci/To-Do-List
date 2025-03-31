<div className="filters">
  <button 
    className={filter === 'all' ? 'active' : ''}
    onClick={() => setFilter('all')}
  >
    Tümü
  </button>
  <button 
    className={filter === 'active' ? 'active' : ''}
    onClick={() => setFilter('active')}
  >
    Aktif
  </button>
  <button 
    className={filter === 'completed' ? 'active' : ''}
    onClick={() => setFilter('completed')}
  >
    Tamamlanan
  </button>
  <TransitionGroup component="ul" className="todo-list">
  {filteredTodos.map(todo => (
    <CSSTransition key={todo.id} timeout={300} classNames="fade">
      <li className={todo.completed ? 'completed' : ''}>
        <span onClick={() => toggleComplete(todo.id)}>
          {todo.text}
        </span>
        <div className="actions">
          <button onClick={() => startEdit(todo)}>✏️</button>
          <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
        </div>
      </li>
    </CSSTransition>
  ))}
</TransitionGroup>
</div>