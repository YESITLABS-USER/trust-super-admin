import React, { useEffect } from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { getAllNotification, markAsRead } from '../redux/slices/adminSlice';
import { useDispatch } from 'react-redux';

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
    };
    for (const key in intervals) {
        const value = Math.floor(seconds / intervals[key]);
        if (value > 0) return `${value} ${key}${value > 1 ? 's' : ''} ago`;
    }
    return 'just now';
};

const NotificationModal = ({ show, handleClose, notification }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!notification) return;
        if (notification.is_read) {
            dispatch(markAsRead({ notification_id: notification.id }));
            dispatch(getAllNotification());
        }
    }, [notification]);

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {notification?.title}
                    {notification?.is_read && <Badge bg="primary" className="ms-2">New</Badge>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{notification?.message}</p>
                <small className="text-muted">{timeAgo(notification?.created_at)}</small>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NotificationModal;
