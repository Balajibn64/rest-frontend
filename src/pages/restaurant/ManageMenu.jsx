import React, { useEffect, useState } from 'react';
import '../../styles/manageMenu.css';

const mockDishes = [
  {
    id: 'dish001',
    name: 'Chicken Biryani',
    description: 'Traditional Hyderabadi biryani',
    price: 180,
    type: 'non-veg',
    isAvailable: true,
    imageUrl: 'https://cdn.example.com/chicken-biryani.jpg',
  },
  {
    id: 'dish002',
    name: 'Paneer Butter Masala',
    description: 'Rich and creamy curry with paneer',
    price: 160,
    type: 'veg',
    isAvailable: true,
    imageUrl: 'https://cdn.example.com/paneer.jpg',
  },
    {
    id: 'dish002',
    name: 'Paneer Butter Masala',
    description: 'Rich and creamy curry with paneer',
    price: 160,
    type: 'veg',
    isAvailable: true,
    imageUrl: 'https://cdn.example.com/paneer.jpg',
  },
];

const ManageMenu = () => {
  const [dishes, setDishes] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    type: 'veg',
    isAvailable: true,
    imageUrl: '',
  });
  const [imageFileName, setImageFileName] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setDishes(mockDishes);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setDishes((prev) =>
        prev.map((dish) =>
          dish.id === editingId ? { ...dish, ...form } : dish
        )
      );
    } else {
      const newDish = {
        ...form,
        id: `dish${Date.now()}`,
      };
      setDishes((prev) => [...prev, newDish]);
    }

    setForm({
      name: '',
      description: '',
      price: '',
      type: 'veg',
      isAvailable: true,
      imageUrl: '',
    });
    setImageFileName('');
    setEditingId(null);
  };

  const handleEdit = (dish) => {
    setForm(dish);
    setImageFileName('');
    setEditingId(dish.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this dish?')) {
      setDishes((prev) => prev.filter((dish) => dish.id !== id));
    }
  };

  return (
    <div className="menu-container">
      <h2>🍽️ Manage Menu</h2>

      <form className="menu-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Dish Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          placeholder="Price"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>

        {/* 🖼 File input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {form.imageUrl && (
          <>
            <img src={form.imageUrl} alt="Preview" className="preview-image" />
            <p className="file-name">📁 {imageFileName}</p>
          </>
        )}

        <label className="availability-label">
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
          />
          Available
        </label>
        <button type="submit">
          {editingId ? 'Update Dish' : 'Add Dish'}
        </button>
      </form>

      <div className="menu-list">
        {dishes.length === 0 ? (
          <p>No dishes added yet.</p>
        ) : (
          dishes.map((dish) => (
            <div key={dish.id} className="dish-card">
              <img src={dish.imageUrl} alt={dish.name} />
              <div>
                <h4>{dish.name} {dish.type === 'veg' ? '🟢' : '🔴'}</h4>
                <p>{dish.description}</p>
                <p>₹ {dish.price}</p>
                <p>Status: {dish.isAvailable ? 'Available' : 'Unavailable'}</p>
              </div>
              <div className="dish-actions">
                <button onClick={() => handleEdit(dish)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(dish.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageMenu;
