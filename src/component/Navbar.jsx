import React, { useEffect, useState } from 'react'
import { getAllNotification, markAsRead } from '../redux/slices/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import NotificationModal from './NotificationModal';

const Navbar = ({ setSidebarOpen, sidebarOpen }) => {
	const dispatch = useDispatch();
	const { notification } = useSelector((state) => state.admin);
	const [onNotification, setOnNotification] = useState(true)
	const [allNotification, setAllNotification] = useState([])
	const [openNotification, setOpenNotification] = useState(false)
	const [notificationData, setNotificationData] = useState(false);
	const [openNotificationModal, setOpenNotificationModal] = useState(false);

	useEffect(() => {
		dispatch(getAllNotification());
	}, []);
	useEffect(() => {
		notification ? setAllNotification(notification) : ''
	}, [notification])

	const handleDateAgo = (dateString) => {
		const now = new Date();
		const date = new Date(dateString);

		const diffMs = now - date;

		const seconds = Math.floor(diffMs / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		let timeAgo = "";
		if (days > 0) {
			timeAgo = `${days} day${days > 1 ? "s" : ""} ago`;
		} else if (hours > 0) {
			timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
		} else if (minutes > 0) {
			timeAgo = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
		} else {
			timeAgo = "Just now";
		}

		const formattedTime = new Intl.DateTimeFormat('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		}).format(date);

		return `${timeAgo} ${formattedTime}`;
	};

	const markAsReadFunction = async (notificationDaitles) => {
		setNotificationData(notificationDaitles)
		setOpenNotificationModal(true)
	}


	return (
		<>
			<nav>
				{/* <i className='bx bx-menu' id='menubtn'><img src="images/menu-icons/hamburger.svg" alt="" /></i> */}
				<i className='bx bx-menu' onClick={() => setSidebarOpen(!sidebarOpen)}><img src="images/menu-icons/hamburger.svg" alt="" /></i>

				<div className="notification-in" >
					<button type="button" onClick={() => setOpenNotification(!openNotification)}><img src="images/menu-icons/notification.svg" alt="" /></button>

					<div className="notification-list" style={{
						display: openNotification ? 'block' : 'none',
						opacity: openNotification ? 1 : 0,
						overflow: 'hidden',
						transition: 'all 1.5s ease-in-out'
					}}>
						<div className="notification-heading">
							<h1>Notifications</h1>
							<label className="switch">
								<input
									type="checkbox"
									defaultChecked={true}
									onClick={(e) => {
										setOnNotification(e.target.checked)
									}}
								/>
								<span className="slider round"></span>
							</label>
						</div>
						{
							onNotification ? (
								<div className="notification-list-inner">
									{
										onNotification ? (
											allNotification?.map((item, index) => (
												<div className="notification-list-item" key={item?.id || index} onClick={() => markAsReadFunction(item)} style={{ cursor: 'pointer' }}>
													<div className="notification-list-item-text">
														<p>{item?.message?.length > 30 ? item?.message?.slice(0, 30) + "..." : item?.message}, {item?.title?.length > 15 ? item?.title?.slice(0, 15) + "..." : item?.title} </p>
														<span>{handleDateAgo(item?.created_at)}</span>
														{
															item?.is_read ? (
																<button type='submit' className='btn ' style={{ color: 'ButtonHighlight' }} >
																	Mark as read
																</button>
															) : (
																''
															)
														}
													</div>
												</div>
											))
										) : (
											""
										)
									}
								</div>
							) : (
								<div className="notification-list-item"
									style={{
										padding: '1rem',
										minHeight: '60px',
										borderBottom: '1px solid #ddd',
										display: 'flex',
										alignItems: 'center'
									}}>
									<div className="notification-list-item-text">
										<p>There are no new notifications</p>
										<span></span>
									</div>
								</div>
							)
						}

					</div>
				</div>
				<div className="admin-icon">
					<img src="images/menu-icons/admin.png" alt="" />
				</div>
			</nav>
			{
				notificationData && <NotificationModal
					show={openNotificationModal}
					handleClose={() => setOpenNotificationModal(false)}
					notification={notificationData}

				/>
			}

		</>

	)
}

export default Navbar
