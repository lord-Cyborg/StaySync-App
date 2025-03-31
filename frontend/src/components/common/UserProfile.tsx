import React, { useState } from 'react';
import { Button, Typography, Avatar } from '@mui/material';
import EditUserProfile from './EditUserProfile';
import AvatarUpload from './AvatarUpload';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = { name: 'Edmark', email: 'edmark@staysyncsolutions.com', avatar: '/path/to/avatar.jpg' };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      {isEditing ? (
        <EditUserProfile onCancel={handleEditToggle} />
      ) : (
        <div>
          <Avatar src={user.avatar} alt={user.name} />
          <Typography variant="h5">{user.name}</Typography>
          <Typography variant="body1">{user.email}</Typography>
          <AvatarUpload />
          <Button onClick={handleEditToggle}>Edit Profile</Button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;