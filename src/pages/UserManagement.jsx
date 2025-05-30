import { useEffect, useMemo, useState } from "react";
import CsvDownloader from "react-csv-downloader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "rsuite/DateRangePicker/styles/index.css";
import AccessModal from "../component/AccessModal";
import AddEditUser from "../component/AddEditUser";
import DeleteModal from "../component/DeleteModal";
import DesignerDateRangePicker from "../component/DesignerDateRangePicker";
import LogoutModal from "../component/LogoutModal";
import Navbar from "../component/Navbar";
import PaginationControls from "../component/PaginationControls";
import Sidebar from "../component/Sidebar";
import { useDateRangeFilter } from "../hooks/useDateRangeFilter";
import useSortableData from "../hooks/useSortableData";
import {
  checkUser,
  getAllFirms
} from "../redux/slices/adminSlice";

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

  console.log(allFirmsUsers)

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
  const itemsPerPage = 10;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData?.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);
  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);

  const handleAccessUpdate = async (status, id) => {
    const newStatus = status ? "denied" : "granted";
    const userAccsessModal = {
      id: id,
      access_status: newStatus,
    };
    setUserAccsess(userAccsessModal);
  };

  // Required fields
  const requiredKeys = ['serial_no', 'name', 'email', 'phone', 'sign_up_date', 'subscription_type', 'access_status'];

  // Format users and columns
  const formattedUsers = usersData?.map((user) => {
    const filtered = {};
    requiredKeys.forEach((key) => {
      if (key === 'sign_up_date') {
        const date = new Date(user[key]);
        const formattedDate = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        filtered[key] = formattedDate;
      } else {
        filtered[key] = user[key];
      }
    });
    return filtered;
  });


  const addUser = () => {
    setSelectedUserToEdit("");
  };


  const { handleApply, handleCancel } = useDateRangeFilter({
    data: allFirmsUsers,
    dateKey: 'sign_up_date',
    onFilter: setFilteredData,
  });

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} />
      <section id="content">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="dashboard-wrap">
            <div className="influ-strip-2">
              <div className="influ-strip-row">
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
                    <DesignerDateRangePicker onApply={handleApply} onCancel={handleCancel} placeholder="Sign Up Date Range" />

                  </label>
                  <button type="button" className="influ-btn">
                    <CsvDownloader filename="users" extension=".csv" columns={requiredKeys} datas={formattedUsers}>
                      <img src="images/menu-icons/export-icon.svg" alt="" />
                      <img src="images/filter-icons/export.svg" alt="" /> Export CSV
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
              </div>
            </div>
            <div className="page-table">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('serial_no')} style={{ cursor: "pointer" }}>S.No. {getSortArrow("serial_no")}</th>
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
                          <td>{tableData.serial_no}</td>
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
            {/* <PaginationControls
              data={usersData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              rowsPerPage={rowsPerPage}
            /> */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={10} // or your actual page size
              totalItems={allFirmsUsers.length} // or however you calculate total items
              onPageChange={(page) => {
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page);
                }
              }}
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
