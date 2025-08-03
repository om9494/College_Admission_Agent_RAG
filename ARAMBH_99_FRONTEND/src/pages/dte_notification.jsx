import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import axios from 'axios';

export default function DteNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dte, setDte] = useState(null);


    useEffect(() => {
        const fetchDteData = async () => {
            try {
                const storedDte = localStorage.getItem('dte');
                if (storedDte) {
                    setDte(JSON.parse(storedDte));
                } else {
                    setError("DTE not logged in.");
                    setLoading(false);
                    return;
                }
            } catch (error) {
                setError(`Error fetching DTE data: ${error.message}`);
                setLoading(false);
            }
        };

        fetchDteData();
    }, []);


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (!dte || !dte.email) {
                    setError("DTE not logged in.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(import.meta.env.VITE_BACKEND_API + 'notification/get', {
                    params: {
                        recipient: dte.email
                    }
                });

                if (response.status === 200) {
                    setNotifications(response.data);
                } else {
                    setError(`Error fetching notifications: ${response.status}`);
                }
            } catch (error) {
                setError(`Error fetching notifications: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        if(dte){
            fetchNotifications();
        }
    }, [dte]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!dte) {
        return <div>Please log in to view notifications.</div>;
    }

    return (
        <div className="bg-white p-8 mt-20 rounded-lg w-90 ml-72">
            <h1 className="text-2xl font-bold mb-4 text-blue-700">DTE Notifications</h1>
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-blue-100 text-gray-800">
                            <th className="p-2 text-left">Sender</th>
                            <th className="p-2 text-left">Message</th>
                            <th className="p-2 text-left">Date</th>
                            <th className="p-2 text-left">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((notification) => (
                            <tr
                                key={notification.id}
                                className={`${
                                    notification.read ? 'bg-gray-100' : 'bg-blue-50'
                                }`}
                            >
                                <td className="p-2">{notification.sender}</td>
                                <td className="p-2 text-left">{notification.message}</td>
                                <td className="p-2">{notification.timestamp.split('T')[0] || 'N/A'}</td>
                                <td className="p-2">
                                    {notification.timestamp.split('T')[1] || 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
