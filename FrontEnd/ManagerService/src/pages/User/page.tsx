import  { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import { UsersSelector, TotalPageUser } from "@/Store/Selector.tsx";
import {MiddleGetAllUser, MiddleUpdateUser} from "@/Store/Thunk/UserThunk.tsx";
import {UserTableSection} from "@/components/Admin/User/UserTableSection.tsx";
import UserThumbnail from "@/components/Admin/User/UserThumbnail.tsx";
import {pageApi} from "@/Api/UrlApi.tsx";
import {UserData, UserCreate, setUserList} from "@/Store/UserSlice.tsx";
import UserModal from "@/components/Admin/User/UserModal.tsx";

const UserPage = () => {
  const dispatch = useDispatch();
  const users = useSelector(UsersSelector);
  const totalPage = useSelector(TotalPageUser);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<UserCreate>({
    userName: "",
    fullName: "",
    email: "",
    urlImage: "",
    phoneNumber: "",
    warehouses: "",
  });
  const isSidebarCollapsed = localStorage.getItem("theme") === "light";

  useEffect(() => {
    const PageApi: pageApi = { pageNumber: page - 1, pageSize: 10 };
    const fetch=async()=>{
        dispatch(setUserList([]));
        setLoading(true)
      if(formData?.warehouses!=""){
        await (dispatch as any)(MiddleGetAllUser(formData?.warehouses,PageApi));
      }
      setLoading(false)
    }
    fetch()

  }, [page, dispatch,formData?.warehouses]);

  const handleUserSelect = (userId: string) => {
    const user = users.find((u:UserData) => u.userId === userId);
    setSelectedUser(user);
  };
  const handleRoleUpdate = async (userId: string, newRole: string[]) => {
    try {
      if(newRole?.find((role: any) => role.includes("MANAGER"))){
        await (dispatch as any)(MiddleUpdateUser(userId,true))
      }else{
        await (dispatch as any)(MiddleUpdateUser(userId,false))
      }
      setSelectedUser(null)
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };
  const handleOpenModal = (open: boolean) => {
    setIsModalOpen(open);
  };

  const handleFormChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <BreadcrumbsUI isDarkMode={isSidebarCollapsed} />
            </div>
            <div className="sm:text-right">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                Quản lý nhân sự kho
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Chọn nhân viên để xem thông tin chi tiết
              </p>
            </div>
          </div>

          {/* Layout 2 cột */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bên trái: User Table (2/3) */}
            <div className="lg:col-span-2">
              <UserTableSection
                  loading={loading}
                  formData={formData}
                  onFormChange={handleFormChange}
                  selectedUser={selectedUser}
                  onUserClick={handleUserSelect}
                  onOpenModal={handleOpenModal}
                  isModalOpen={isModalOpen}
                  users={users}
                  totalPage={totalPage}
                  currentPage={page}
                  onPageChange={setPage}
              />
            </div>

            {/* Bên phải: User Thumbnail (1/3) */}
            <div className="lg:col-span-1">
              <UserThumbnail onRoleUpdate={handleRoleUpdate} user={selectedUser} />
            </div>
          </div>
        </div>

        {/* Modal */}
        <UserModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            formData={formData}
            onFormChange={handleFormChange}
        />
      </div>
  );
};

export default UserPage;