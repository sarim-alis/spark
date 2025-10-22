import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ShieldCheck } from 'lucide-react';
import { AuthContext } from '@/context/AuthProvider';
import { authAPI } from '@/services/api';
const { Title } = Typography;

export default function AdminLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (values) => {
    setLoading(true);
    console.log('Admin login attempt with:', values);
    authAPI.login(values)
      .then(({ data }) => {
        console.log('Login response:', data);
        if (data.access_token) {
          // Check if user is admin
          if (data.user.role !== 'admin') {
            message.error('Access denied. Admin privileges required.');
            setLoading(false);
            return;
          }
          
          localStorage.setItem('api_token', data.access_token);
          message.success('Admin login successful');
          login({ ...data.user, token: data.access_token });
          navigate('/admin/dashboard');
        } else {
          message.error('Invalid server response');
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        const errorMessage = error.message || (error.response?.data?.message) || 'Failed to login';
        message.error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <Title level={3} className="!mb-0 !text-[#a78bfa] font-bold text-center">
              Admin Panel
            </Title>
            <p className="text-gray-500 text-sm mt-2">Sign in to access admin dashboard</p>
          </div>

          <Form 
            name="admin-login" 
            layout="vertical" 
            onFinish={handleLogin} 
            autoComplete="off"
          >
            <Form.Item 
              name="email" 
              rules={[{ required: true, message: 'Please enter email!' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="Admin Email" 
                className="rounded-lg py-2" 
              />
            </Form.Item>

            <Form.Item 
              name="password" 
              rules={[{ required: true, message: 'Please enter password!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />} 
                placeholder="Password" 
                className="rounded-lg py-2" 
              />
            </Form.Item>

            <Form.Item>
              <Button 
                loading={loading} 
                type="primary" 
                htmlType="submit" 
                className="w-full h-12 bg-[#a78bfa] hover:!bg-[#3c315e] rounded-lg py-2 font-semibold mt-2 transition-all duration-300"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
}