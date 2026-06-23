import { getInitials } from '../utils/helpers';

const ProfileInfo = ({ user }) => {
  return (
    <div className="profile-info">
      <div className="profile-avatar">
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName} />
        ) : (
          <div className="avatar-placeholder">
            {getInitials(user.displayName)}
          </div>
        )}
      </div>
      
      <div className="profile-details">
        <h2>{user.displayName || 'User'}</h2>
        <p className="email">{user.email}</p>
        <p className="member-since">
          Member since {new Date(user.metadata?.creationTime).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ProfileInfo;
