import React, { useState } from 'react';
import { users as initialUsers } from '../lib/users';

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

const updateUserInLocalStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  // Update users array in localStorage
  let users = JSON.parse(localStorage.getItem('users') || 'null') || initialUsers;
  users = users.map(u => u.username === user.username ? user : u);
  localStorage.setItem('users', JSON.stringify(users));
};

const Profile = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    password: user?.password || '',
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = e => {
    e.preventDefault();
    const updatedUser = { ...user, ...form };
    setUser(updatedUser);
    updateUserInLocalStorage(updatedUser);
    setEdit(false);
    setMessage('Profile updated!');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      {!edit ? (
        <div>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl mr-4">{user.avatar}</div>
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
          <div className="mb-2"><b>Username:</b> {user.username}</div>
          <div className="mb-2"><b>Role:</b> {user.role}</div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setEdit(true)}>Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label>Avatar (one letter)</label>
            <input name="avatar" value={form.avatar} maxLength={1} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
          </div>
          <div>
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
