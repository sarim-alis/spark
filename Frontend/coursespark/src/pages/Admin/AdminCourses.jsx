// Imports.
import { useState, useEffect } from 'react';
import { Table, Tag, Popconfirm, Button, message, Image, Drawer, Form, Input, InputNumber, Select, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { BookOpen, ShieldCheck } from 'lucide-react';
import { adminAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';

// Frontend.
const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch courses.
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllCourses();
      console.log('Courses API Response:', response.data);
      
      // Handle different response structures
      let coursesData = [];
      if (response.data.data) {
        coursesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        coursesData = response.data;
      }
      
      // Filter only published courses and sort by latest
      const publishedCourses = coursesData
        .filter(course => course.is_published === 1 || course.is_published === true)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      console.log('Published courses:', publishedCourses);
      setCourses(publishedCourses);
    } catch (error) {
      message.error('Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete.
  const handleDelete = async (courseId) => {
    try {
      await adminAPI.deleteCourse(courseId);
      message.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      message.error('Failed to delete course');
      console.error(error);
    }
  };

  // Handle view.
  const handleView = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  // Handle edit.
  const handleEdit = (course) => {
    setEditingCourse(course);
    form.setFieldsValue({
      title: course.title,
      description: course.description,
      audience: course.audience,
      level: course.level,
      duration_hours: course.duration_hours,
      category: course.category,
      price: course.price,
    });
    setDrawerVisible(true);
  };

  // Handle drawer close.
  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setEditingCourse(null);
    setThumbnailFile(null);
    form.resetFields();
  };

  // Handle update.
  const handleUpdate = async (values) => {
    try {
      const updateData = { ...values };
      if (thumbnailFile) {
        updateData.thumbnail_url = thumbnailFile;
      }
      
      await adminAPI.updateCourse(editingCourse.id, updateData);
      message.success('Course updated successfully');
      handleDrawerClose();
      fetchCourses();
    } catch (error) {
      message.error('Failed to update course');
      console.error(error);
    }
  };

  // Handle file change.
  const handleFileChange = (info) => {
    if (info.file.originFileObj) {
      setThumbnailFile(info.file.originFileObj);
    }
  };

  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail_url',
      key: 'thumbnail_url',
      width: 100,
      render: (url) => (
        <Image
          src={url || 'https://via.placeholder.com/80'}
          alt="Course thumbnail"
          width={80}
          height={60}
          className="rounded object-cover"
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title) => <span className="font-semibold text-gray-800">{title}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
      render: (desc) => desc || <span className="text-gray-400 italic">No description</span>,
    },
    {
      title: 'Creator',
      dataIndex: 'creator',
      key: 'creator',
      render: (creator) => creator?.name || 'Unknown',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Programming', value: 'Programming' },
        { text: 'Design', value: 'Design' },
        { text: 'Business', value: 'Business' },
        { text: 'Marketing', value: 'Marketing' },
      ],
      onFilter: (value, record) => record.category === value,
      render: (category) => (
        <Tag color="blue" className="font-semibold">
          {category || 'Uncategorized'}
        </Tag>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      filters: [
        { text: 'Beginner', value: 'Beginner' },
        { text: 'Intermediate', value: 'Intermediate' },
        { text: 'Advanced', value: 'Advanced' },
      ],
      onFilter: (value, record) => record.level === value,
      render: (level) => {
        let color = 'default';
        if (level === 'Beginner') color = 'green';
        else if (level === 'Intermediate') color = 'orange';
        else if (level === 'Advanced') color = 'red';
        
        return (
          <Tag color={color} className="font-semibold">
            {level || 'N/A'}
          </Tag>
        );
      },
    },
    {
      title: 'Duration',
      dataIndex: 'duration_hours',
      key: 'duration_hours',
      sorter: (a, b) => (a.duration_hours || 0) - (b.duration_hours || 0),
      render: (hours) => `${hours || 0}h`,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
      render: (price) => `$${price || 0}`,
    },
    {
      title: 'Lessons',
      dataIndex: 'lessons',
      key: 'lessons',
      render: (lessons) => {
        try {
          const parsed = typeof lessons === 'string' ? JSON.parse(lessons) : lessons;
          return Array.isArray(parsed) ? parsed.length : 0;
        } catch {
          return 0;
        }
      },
    },
    // {
    //   title: 'Created At',
    //   dataIndex: 'created_at',
    //   key: 'created_at',
    //   sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    //   render: (date) => new Date(date).toLocaleDateString(),
    // },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} className="bg-blue-500 hover:bg-blue-600" />
          <Popconfirm title="Delete Course" description="Are you sure you want to delete this course?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No" okButtonProps={{ danger: true }}>
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
            <BookOpen className="w-8 h-8 text-violet-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-violet-600">
              Course Management
            </h1>
          </div>
          <p className="text-gray-600">Manage all published courses in the system</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Table columns={columns} dataSource={courses} loading={loading} rowKey="id" pagination={{pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} courses`,}} scroll={{ x: 1400 }} />
        </div>

        {/* Edit Drawer */}
        <Drawer
          title={
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-violet-600" />
              <span className="text-lg font-bold text-violet-600">Edit Course</span>
            </div>
          }
          placement="right"
          onClose={handleDrawerClose}
          open={drawerVisible}
          width={500}
        >
          <Form form={form} layout="vertical" onFinish={handleUpdate}>
            <Form.Item label="Thumbnail" name="thumbnail">
              <Upload beforeUpload={() => false} onChange={handleFileChange} maxCount={1} accept="image/*" className="w-full">
                <Button icon={<UploadOutlined />} className="w-full h-10">Upload Thumbnail</Button>
              </Upload>
              {editingCourse?.thumbnail_url && !thumbnailFile && (
                <div className="mt-2">
                  <Image src={editingCourse.thumbnail_url} width={100} />
                </div>
              )}
            </Form.Item>

            <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter title' }]}>
              <Input placeholder="Enter title" className="h-10" />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} placeholder="Enter description" />
            </Form.Item>

            <Form.Item label="Category" name="category">
              <Select placeholder="Select category" className="h-10">
                <Select.Option value="Programming">Programming</Select.Option>
                <Select.Option value="Design">Design</Select.Option>
                <Select.Option value="Business">Business</Select.Option>
                <Select.Option value="Marketing">Marketing</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Level" name="level">
              <Select placeholder="Select level" className="h-10">
                <Select.Option value="Beginner">Beginner</Select.Option>
                <Select.Option value="Intermediate">Intermediate</Select.Option>
                <Select.Option value="Advanced">Advanced</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Audience" name="audience">
              <Input placeholder="Enter target audience" className="h-10" />
            </Form.Item>

            <Form.Item label="Duration (hours)" name="duration_hours">
              <InputNumber min={0} placeholder="Enter duration" className="w-full h-10" />
            </Form.Item>

            <Form.Item label="Price ($)" name="price">
              <InputNumber min={0} placeholder="Enter price" className="w-full h-10" />
            </Form.Item>

            <Form.Item>
              <div className="flex gap-2 justify-end">
                <Button onClick={handleDrawerClose}>Cancel</Button>
                <Button type="primary" htmlType="submit" className="bg-violet-600 hover:bg-violet-700">
                  Update Course
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </div>
  );
};

export default AdminCourses;