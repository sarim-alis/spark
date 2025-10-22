// Imports.
import { useState, useEffect } from 'react';
import { Table, Avatar, Tag, Drawer, Form, Input, Button, Popconfirm, message, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import { Users, ShieldCheck } from 'lucide-react';
import { adminAPI } from '@/services/api';


// Frontend.
const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

//   Fetch users.
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers();
      // Filter out admin.
      const nonAdminUsers = response.data.filter(user => user.role !== 'admin');
      setUsers(nonAdminUsers);
    } catch (error) {
      message.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit.
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio
    });
    setDrawerVisible(true);
  };

//   Handle delete.
  const handleDelete = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
      console.error(error);
    }
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setEditingUser(null);
    setProfilePictureFile(null);
    form.resetFields();
  };

  // Handle update
  const handleUpdate = async (values) => {
    try {
      const updateData = { ...values };
      if (profilePictureFile) {
        updateData.profile_picture_url = profilePictureFile;
      }
      
      await adminAPI.updateUser(editingUser.id, updateData);
      message.success('User updated successfully');
      handleDrawerClose();
      fetchUsers();
    } catch (error) {
      message.error('Failed to update user');
      console.error(error);
    }
  };

  const handleFileChange = (info) => {
    if (info.file.originFileObj) {
      setProfilePictureFile(info.file.originFileObj);
    }
  };

  const columns = [
    {
      title: 'Profile',
      dataIndex: 'profile_picture_url',
      key: 'profile_picture_url',
      width: 80,
      render: (url, record) => (
        <Avatar size={48} src={url} icon={<UserOutlined />}className="border-2 border-violet-200">
          {!url && record.name?.[0]?.toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name) => <span className="font-semibold text-gray-800">{name}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [{ text: 'Admin', value: 'admin' },{ text: 'User', value: 'user' },{ text: 'Creator', value: 'creator' },],
      onFilter: (value, record) => record.role === value,
      render: (role) => {
        let color = 'default';
        if (role === 'admin') color = 'red';
        else if (role === 'creator') color = 'blue';
        else if (role === 'user') color = 'green';
        
        return (
          <Tag color={color} className="font-semibold uppercase">
            {role}
          </Tag>
        );
      },
    },
    {
      title: 'Bio',
      dataIndex: 'bio',
      key: 'bio',
      ellipsis: true,
      render: (bio) => bio || <span className="text-gray-400 italic">No bio</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} className="bg-blue-500 hover:bg-blue-600" />
          <Popconfirm title="Delete User" description="Are you sure you want to delete this user?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No" okButtonProps={{ danger: true }} >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-violet-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-violet-600">
              User Management
            </h1>
          </div>
          <p className="text-gray-600">Manage all users in the system</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Table columns={columns} dataSource={users} loading={loading} rowKey="id" pagination={{pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} users`,}} scroll={{ x: 1000 }} />
        </div>

        {/* Edit Drawer */}
        <Drawer
          title={
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-violet-600" />
              <span className="text-lg font-bold text-violet-600">Edit User</span>
            </div>
          }
          placement="right"
          onClose={handleDrawerClose}
          open={drawerVisible}
          width={500}
        >
          <Form form={form} layout="vertical" onFinish={handleUpdate}>
            <Form.Item label="Profile Picture" name="profile_picture">
              <Upload beforeUpload={() => false} onChange={handleFileChange} maxCount={1} accept="image/*" className="w-full">
                <Button icon={<UploadOutlined />} className="w-full h-10">Upload Picture</Button>
              </Upload>
              {editingUser?.profile_picture_url && !profilePictureFile && (
                <div className="mt-2">
                  <Avatar size={64} src={editingUser.profile_picture_url} />
                </div>
              )}
            </Form.Item>

            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter name' }]}>
              <Input placeholder="Enter name" className="h-10" />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter email' },{ type: 'email', message: 'Please enter valid email' }]}>
              <Input placeholder="Enter email" className="h-10" />
            </Form.Item>

            <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select role' }]}>
              <Input placeholder="Enter role (admin, user, creator)" className="h-10" />
            </Form.Item>

            <Form.Item label="Bio" name="bio">
              <Input.TextArea rows={2} placeholder="Enter bio" />
            </Form.Item>

            <Form.Item>
              <div className="flex gap-2 justify-end">
                <Button onClick={handleDrawerClose}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" className="bg-violet-600 hover:bg-violet-700">
                  Update User
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </div>
  );
};

export default AdminUser;