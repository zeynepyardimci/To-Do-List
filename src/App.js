import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  // State'ler
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('pink-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [celebrate, setCelebrate] = useState(false);

  // CRUD Operasyonları
  const handleSubmit = () => {
    if (!input.trim()) return;

    if (editingId) {
      // Güncelleme modu
      setTodos(todos.map(todo => 
        todo.id === editingId ? { ...todo, text: input } : todo
      ));
      setEditingId(null);
    } else {
      // Yeni ekleme modu
      setTodos([{
        id: Date.now(),
        text: input,
        completed: false,
        date: new Date().toLocaleString('tr-TR', { 
          day: 'numeric', 
          month: 'long', 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }, ...todos]);
    }
    setInput('');
  };

  const handleComplete = (id) => {
    const updated = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    setTodos(updated);
    if (!todos.find(t => t.id === id).completed) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 3000);
    }
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEdit = (todo) => {
    setInput(todo.text);
    setEditingId(todo.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setInput('');
  };

  // Efektler
  useEffect(() => {
    localStorage.setItem('pink-todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (editingId) {
      document.querySelector('input').focus();
    }
  }, [editingId]);

  // Filtrelenmiş Todolar
  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  return (
    <div className="app">
      {celebrate && (
        <div className="confetti">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="confetti-piece"
              initial={{ y: -10, opacity: 1 }}
              animate={{ 
                y: [0, 500],
                x: Math.random() * 400 - 200,
                rotate: Math.random() * 360,
                opacity: [1, 0]
              }}
              transition={{ 
                duration: 3,
                ease: "linear"
              }}
              style={{
                background: ['#ff85a2', '#ff4785', '#ff9eb5'][Math.floor(Math.random() * 3)],
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`
              }}
            />
          ))}
        </div>
      )}
      
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <h1>🌸 To-do List 🌸</h1>
        
        <motion.div 
          className="input-container"
          whileHover={{ scale: 1.02 }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={editingId ? "Görevi güncelle..." : "Yeni görev ekle..."}
          />
          <motion.button
            onClick={handleSubmit}
            whileTap={{ scale: 0.95 }}
            className={`submit-btn ${editingId ? 'editing' : ''}`}
          >
            {editingId ? 'Güncelle' : 'Ekle'}
          </motion.button>
          {editingId && (
            <motion.button
              onClick={handleCancelEdit}
              whileTap={{ scale: 0.95 }}
              className="cancel-btn"
            >
              İptal
            </motion.button>
          )}
        </motion.div>
      </motion.header>

      <div className="filters">
        {['all', 'active', 'completed'].map((f) => (
          <motion.button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? 'active' : ''}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {f === 'all' ? 'Tümü' : f === 'active' ? 'Aktif' : 'Tamamlanan'}
          </motion.button>
        ))}
      </div>

      <motion.div className="todo-list">
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <motion.div
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: 'spring', damping: 25 }}
              layout
            >
              <motion.div
                className="checkbox"
                onClick={() => handleComplete(todo.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {todo.completed && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    ✓
                  </motion.span>
                )}
              </motion.div>

              <div className="todo-content">
                <p className={todo.completed ? 'completed-text' : ''}>
                  {todo.text}
                </p>
                <small>{todo.date}</small>
              </div>

              <div className="actions">
                <motion.button
                  onClick={() => handleEdit(todo)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  className="edit-btn"
                >
                  ✏️
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(todo.id)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  className="delete-btn"
                >
                  🗑️
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;