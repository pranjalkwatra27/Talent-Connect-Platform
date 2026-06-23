import { useEffect, useState } from 'react';

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`notification notification-${type}`}>
      <p>{message}</p>
      <button onClick={() => {
        setVisible(false);
        if (onClose) onClose();
      }}>×</button>
    </div>
  );
};

export default Notification;
