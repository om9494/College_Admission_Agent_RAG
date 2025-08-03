import React from 'react'
import { AdminContext, CollegeContext } from "../App";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { useState, useEffect } from "react";

export default function AdminNotifications() {
    const { admin } = useContext(AdminContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (!admin || !admin.email) {
                    setError("Admin not logged in.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(import.meta.env.VITE_BACKEND_API + 'notification/get', {
                    params: {
                        recipient: admin.email
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

        fetchNotifications();
    }, [admin]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!admin) {
        return <div>Please log in to view notifications.</div>;
    }

    return (
        <div className="bg-white p-8 mt-20 rounded-lg w-90 ml-72">
            <h1 className="text-2xl font-bold mb-4 text-blue-700">Admin Notifications</h1>
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-blue-100 text-gray-800">
                            <th className="p-2 text-left">Sender</th>
                            <th className="p-2 text-left">Message</th>
                            <th className="p-2 text-left">Read</th>
                            <th className="p-2 text-left">Timestamp</th>
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
                                <td className="p-2">{notification.message}</td>
                                <td className="p-2">{notification.read ? 'Yes' : 'No'}</td>
                                <td className="p-2">
                                    {notification.timestamp || 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
