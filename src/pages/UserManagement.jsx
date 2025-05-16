import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import AddEditUser from "../component/AddEditUser";
import LogoutModal from "../component/LogoutModal";
import AccessModal from "../component/AccessModal";
import DeleteModal from "../component/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import {
  checkUser,
  getAllFirms,
  updateFirmsAccess,
} from "../redux/slices/adminSlice";
import PaginationControls from "../component/PaginationControls";
import useSortableData from "../hooks/useSortableData";
import CsvDownloader from "react-csv-downloader";
import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
import NotificationModal from "../component/NotificationModal";

const UserManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allFirmsUsers } = useSelector((state) => state.admin);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [filteredData, setFilteredData] = useState(usersData);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userAccsess, setUserAccsess] = useState({});
  const [selectedUserToEdit, setSelectedUserToEdit] = useState("");
  const [deleteItemId, setDeleteItemId] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [adduser, setAdduser] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const convertToISOString = (date) => {
    return new Date(date).toISOString();
  };
  const filterByDateRange = (data, startDate, endDate) => {
    if (!startDate || !endDate) return data;

    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);

    return data.filter((item) => {
      const itemDate = new Date(
        convertToISOString(item.sign_up_date)
      ).getTime();
      return itemDate >= start && itemDate <= end;
    });
  };

  useEffect(() => {
    const user = localStorage.getItem("trust-superAdmin");
    if (user) {
      dispatch(checkUser());
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    dispatch(getAllFirms());
  }, [dispatch]);

  useEffect(() => {
    if (allFirmsUsers) {
      setUsersData(allFirmsUsers);
    }
  }, [allFirmsUsers]);

  // 🔹 Apply Search
  useEffect(() => {
    let result = usersData;
    if (search) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase()) ||
          item.phone.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (Array.isArray(dateRange) && dateRange[0] && dateRange[1]) {
      result = filterByDateRange(result, dateRange[0], dateRange[1]);
    }
    setFilteredData(result);
    setCurrentPage(1);
  }, [usersData, search, dateRange]);

  // 🔹 Apply Sort
  const { sortedData, sortConfig, handleSort } = useSortableData(filteredData);
  const getSortArrow = (key) =>
    sortConfig.key === key
      ? sortConfig.direction === "asc"
        ? " ↑"
        : " ↓"
      : "";

  const paginatedData = useMemo(() => {
    if (!Array.isArray(sortedData)) return [];
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleAccessUpdate = async (status, id) => {
    const newStatus = status ? "denied" : "granted";
    const userAccsessModal = {
      id: id,
      access_status: newStatus,
    };
    setUserAccsess(userAccsessModal);
  };

  const columns =
    usersData && usersData.length
      ? Object.keys(usersData[0]).map((key) => ({
          id: key,
          displayName: key,
        }))
      : [];

  const addUser = () => {
    setSelectedUserToEdit("");
  };

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} />
      <section id="content">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="dashboard-wrap">
            <div className="influ-strip-2">
              <form>
                <div className="influ-search">
                  <label htmlFor="">
                    <input
                      type="text"
                      name=""
                      placeholder="Search"
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button>
                      <img src="images/menu-icons/search-icon.svg" alt="" />
                    </button>
                  </label>
                </div>
                <div className="influ-btns">
                  <label className="daterange-btn">
                    <img
                      src="images/menu-icons/calender-icon.svg"
                      alt=""
                      style={{ zIndex: 1 }}
                    />
                    <DateRangePicker
                      ranges={dateRange}
                      onChange={(item) => setDateRange(item)}
                      placeholder="Sign Up Date Range"
                      className="no-border-picker"
                    />
                  </label>

                  <button className="influ-btn">
                    <CsvDownloader
                      filename="report"
                      extension=".csv"
                      columns={columns}
                      datas={usersData}
                    >
                      <img src="images/menu-icons/export-icon.svg" alt="" />
                      Export CSV
                    </CsvDownloader>
                  </button>

                  <button
                    type="button"
                    className="influ-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#create-newuser-popup"
                    onClick={addUser}
                  >
                    <img
                      src="images/jungleballers-imgs/request-icon.svg"
                      alt=""
                    />
                    Add user
                  </button>
                </div>
              </form>
            </div>
            <div className="page-table">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th
                        onClick={() => handleSort("name")}
                        style={{ cursor: "pointer" }}
                      >
                        Name {getSortArrow("name")}
                      </th>
                      <th
                        onClick={() => handleSort("email")}
                        style={{ cursor: "pointer" }}
                      >
                        Email {getSortArrow("email")}
                      </th>
                      <th
                        onClick={() => handleSort("phone")}
                        style={{ cursor: "pointer" }}
                      >
                        Phone {getSortArrow("phone")}
                      </th>
                      <th
                        onClick={() => handleSort("sign_up_date")}
                        style={{ cursor: "pointer" }}
                      >
                        Sign Up Date {getSortArrow("sign_up_date")}
                      </th>
                      <th>Subscription Type</th>
                      <th>Access</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((tableData, index) => (
                        <tr key={tableData?.id}>
                          <td>{String(index + 1).padStart(2, "0")}</td>
                          <td>{tableData?.name}</td>
                          <td>{tableData?.email}</td>
                          <td>{tableData?.phone}</td>
                          <td>{formatDate(tableData?.sign_up_date)}</td>
                          <td>
                            {tableData?.subscription_type?.toLowerCase() ==
                            "basic"
                              ? "Basic"
                              : tableData?.subscription_type?.toLowerCase() ==
                                "premium"
                              ? "Premium"
                              : ""}
                          </td>

                          <td>
                            <div className="toggle-wrap">
                              <p
                                style={{
                                  color:
                                    tableData?.access_status === "granted"
                                      ? "green"
                                      : "#454545",
                                }}
                              >
                                Granted
                              </p>

                              <div className="toggle">
                                <input
                                  type="checkbox"
                                  checked={
                                    tableData?.access_status !== "granted"
                                  }
                                  onChange={(e) =>
                                    handleAccessUpdate(
                                      e.target.checked,
                                      tableData.id
                                    )
                                  }
                                  data-bs-toggle="modal"
                                  data-bs-target={
                                    tableData?.access_status
                                      ? "#suspend-popup"
                                      : "#suspend-popup"
                                  }
                                />
                                <label></label>
                              </div>

                              <p
                                style={{
                                  color:
                                    tableData?.access_status !== "granted"
                                      ? "red"
                                      : "#454545",
                                }}
                              >
                                Denied
                              </p>
                            </div>
                          </td>

                          <td>
                            <a
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#create-newuser-popup"
                              onClick={() => setSelectedUserToEdit(tableData)}
                            >
                              <img
                                src="images/menu-icons/edit.svg"
                                alt="Edit"
                              />
                            </a>

                            <a
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#delete-popup"
                              onClick={() => setDeleteItemId(tableData?.id)}
                              style={{ marginLeft: "20px" }}
                            >
                              <img
                                src="images/menu-icons/trash.svg"
                                alt="Delete"
                              />
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: "center" }}>
                          No users found....
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <PaginationControls
              data={usersData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              rowsPerPage={rowsPerPage}
            />
          </div>
        </main>
        <AddEditUser editData={selectedUserToEdit} />
        <LogoutModal />
        <AccessModal updateStatus={userAccsess} />
        <DeleteModal deletedId={deleteItemId} />
      </section>
    </>
  );
};

export default UserManagement;
