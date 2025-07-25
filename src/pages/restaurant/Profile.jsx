import React, { useState, useEffect } from 'react';
import { getRestaurantProfile, updateRestaurantProfile } from '../../api/restaurantApi';
import '../../styles/profile.css';

const defaultProfile = {
  name: '',
  email: '',
  phone: '',
  address: '',
  cuisineTypes: [],
  resturantPic: '',
  openStatus: true,
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(defaultProfile);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getRestaurantProfile()
      .then(res => {
        // The backend returns { token, r } where r is RestaurantDetailsDTO
        const data = res.data.r || res.data;
        setProfile(data);
        setForm({
          ...defaultProfile,
          ...data,
          cuisineTypes: Array.isArray(data.cuisineTypes) ? data.cuisineTypes : (data.cuisineTypes ? data.cuisineTypes.split(',') : []),
        });
        setImagePreview(data.resturantPic || '');
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load profile.');
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCuisineChange = (e) => {
    const cuisines = e.target.value.split(',').map((c) => c.trim());
    setForm((prev) => ({ ...prev, cuisineTypes: cuisines }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        cuisineTypes: Array.isArray(form.cuisineTypes) ? form.cuisineTypes : (form.cuisineTypes ? form.cuisineTypes.split(',') : []),
      };
      const res = await updateRestaurantProfile(payload, imageFile);
      const data = res.data.r || res.data;
      setProfile(data);
      setForm({
        ...defaultProfile,
        ...data,
        cuisineTypes: Array.isArray(data.cuisineTypes) ? data.cuisineTypes : (data.cuisineTypes ? data.cuisineTypes.split(',') : []),
      });
      setImagePreview(data.resturantPic || '');
      setEditing(false);
      alert('✅ Profile updated!');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="profile-container"><p>Loading...</p></div>;
  }
  if (error) {
    return <div className="profile-container"><p style={{color:'red'}}>{error}</p></div>;
  }
  if (!profile) {
    return <div className="profile-container"><p>No profile data found.</p></div>;
  }

  return (
    <div className="profile-container">
      <h2>🧾 Restaurant Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            disabled={!editing}
            required
          />
        </label>
        <label>
          Email:
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled
          />
        </label>
        <label>
          Phone:
          <input
            name="phone"
            type="text"
            value={form.phone}
            onChange={handleChange}
            disabled={!editing}
          />
        </label>
        <label>
          Address:
          <input
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            disabled={!editing}
          />
        </label>
        <label>
          Cuisine Types:
          <input
            type="text"
            value={form.cuisineTypes.join(', ')}
            onChange={handleCuisineChange}
            disabled={!editing}
            placeholder="e.g., Biryani, South Indian"
          />
        </label>
        <label>
          Cover Image:
          {editing && (
            <input type="file" accept="image/*" onChange={handleImageChange} />
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Cover"
              className="preview-img"
              style={{ maxWidth: '200px', marginTop: '10px' }}
            />
          )}
        </label>
        <label className="open-status">
          <input
            type="checkbox"
            name="openStatus"
            checked={form.openStatus}
            onChange={handleChange}
            disabled={!editing}
          />
          Open for Orders
        </label>
        <div className="profile-actions">
          {editing ? (
            <>
              <button type="submit">Save</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setForm(profile);
                  setEditing(false);
                  setImagePreview(profile.resturantPic || '');
                  setImageFile(null);
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setEditing(true)}>
                Edit
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile; 