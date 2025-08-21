import React, { useState } from 'react';

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('users') || 'null');
  } catch {
    return null;
  }
};

const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

const AddUser = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    avatar: '',
    role: 'viewer',
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    let users = getUsers() || [];
    if (users.find(u => u.username === form.username)) {
      setMessage('Username already exists!');
      return;
    }
    users.push(form);
    saveUsers(users);
    setMessage('User added!');
    setForm({ username: '', password: '', name: '', email: '', avatar: '', role: 'viewer' });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Add User</h2>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label>Username</label>
          <input name="username" value={form.username} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
        </div>
        <div>
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
        </div>
        <div>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
        </div>
        <div>
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
        </div>
        <div>
          <label>Avatar (one letter)</label>
          <input name="avatar" value={form.avatar} maxLength={1} onChange={handleChange} className="w-full border px-2 py-1 rounded" required />
        </div>
        <div>
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange} className="w-full border px-2 py-1 rounded">
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;
