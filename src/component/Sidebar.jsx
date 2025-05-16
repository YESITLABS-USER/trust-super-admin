import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = ({ sidebarOpen }) => {
	return (
		<section id="sidebar" className={`${sidebarOpen ? 'hide' : ''}`}>
			<a href="#" className="brand">
				<img src="images/menu-icons/MENU-LOGO.svg" alt="" />
				<h3>Trust Account <br />
					Reconciliation</h3>
			</a>
			<ul className="side-menu">
				<li className="active">
					<Link to="/user-management">
						<img src="images/menu-icons/1.svg" alt="" />
						<span className="text">Manage Firms</span>
					</Link>
				</li>
				<li>
					<a href="#" data-bs-toggle="modal" data-bs-target="#logout" data-dismiss="modal">
						<img src="images/menu-icons/2.svg" alt="" />
						<span className="text">Logout</span>
					</a>
				</li>
			</ul>
		</section>
	)
}

export default Sidebar
