import { Avatar } from '@mantine/core';
import React from 'react';

// Utility function to get initials from a name
const getInitials = (name: string): string => {
  const nameParts = name.split(' ');
  const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  return initials;
};

// Component to display user details with avatar
const UserAvatar: React.FC<{ userDetails?: { picture?: string; name: string } | null }> = ({ userDetails }) => {
  if (!userDetails) {
    return null; // Handle case where userDetails is null or undefined
  }

  return (
    <Avatar style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: '#cccccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: '#fff',
      }}>
      {userDetails?.picture ? (
        <img src={userDetails.picture} width={40} alt="User Avatar" />
      ) : (
        <div >
          {}
        </div>
      )}
    </Avatar>
  );
};

export default UserAvatar;
