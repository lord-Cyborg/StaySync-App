import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import AvatarUpload from './AvatarUpload';

const EditUserProfile = ({ onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    // Logic to save user profile
    onCancel();
  };

  return (
    <div>
      <AvatarUpload />
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button onClick={handleSave}>Save</Button>
      <Button onClick={onCancel}>Cancel</Button>
    </div>
  );
};

export default EditUserProfile;
