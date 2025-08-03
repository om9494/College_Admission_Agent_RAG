import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationSidebar = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {

                let email_recipient;
                const user = localStorage.getItem('user');
                const admin = localStorage.getItem('admin');
                const dte = localStorage.getItem('dte');


                if (user) {
                    const parsedUser = JSON.parse(user);
                    email_recipient = parsedUser.email;
                } else if (admin) {
                    const parsedAdmin = JSON.parse(admin);
                    email_recipient = parsedAdmin.email;
                } else if (dte) {
                    const parsedDte = JSON.parse(dte);
                    email_recipient = parsedDte.email;
                }

                if (!email_recipient) {
                    setNotifications([]);
                    setUnreadCount(0);
                    return; //Exit early to avoid API call
                }

                console.log(email_recipient);
                const response = await axios.get(import.meta.env.VITE_BACKEND_API + 'notification/get', {
                    params: { // Use params for query strings
                        recipient: email_recipient
                    }
                });



                if (response.status === 200) {
                    console.log(response);
                    setNotifications(response.data);
                    setUnreadCount(response.data.filter(n => !n.read).length);
                } else {
                    console.error('Error fetching notifications:', response.status);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

    }, []);

    console.log("Notifications: " + notifications);
    console.log("Unread Count: " + unreadCount);

    const markAsRead = async (notificationId) => {
        try {
            //It's more efficient to use PATCH rather than POST here as you're only updating existing data.
            const response = await axios.patch(import.meta.env.VITE_BACKEND_API + `notification/markread/${notificationId}`);
            if (response.status === 200) {
                setNotifications(notifications.map(n => n.id === notificationId ? { ...n, read: true } : n));
                setUnreadCount(prevCount => prevCount - 1); // Use functional update for prevCount
            } else {
                console.error("Error updating notification read status:", response);
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    if (!isOpen) return null;


    const NotificationCard = ({ notification, markAsRead }) => (
        <div key={`${notification.id}`} className={`notification-card ${notification.read ? 'read' : 'unread'}`}>
            <div className="notification-content">
                <h3 className="notification-sender">{notification.sender}</h3>
                <p className="notification-message">{notification.message}</p>
            </div>
            <button onClick={() => markAsRead(notification.id)} className="mark-as-read">Mark as Read</button>
        </div>
    );

    return (
        <div className="notification-sidebar" style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '300px',
            height: '100%',
            backgroundColor: 'white',
            transform: `translateX(${isOpen ? '0' : '100%'})`,
            transition: 'transform 0.3s ease-in-out',
            overflowY: 'auto',
        }}>
            <button onClick={onClose} className="close-button">Close</button>
            <h2>Notifications ({unreadCount})</h2>
            {notifications.map((notification) => ( //No need for index as keys are unique
                <NotificationCard key={notification.id} notification={notification} markAsRead={markAsRead} />
            ))}
        </div>
    );
};

export default NotificationSidebar;
