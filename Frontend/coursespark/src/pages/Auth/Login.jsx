// Imports.
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthProvider';
import { authAPI } from '@/services/api';
const { Title } = Typography;


// Frontend.
export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Handle login.
  const handleLogin = (values) => {
    setLoading(true);
    console.log('Login attempt with:', values);
    authAPI.login(values)
      .then(({ data }) => {
        console.log('Login response:', data);
        if (data.access_token) {localStorage.setItem('api_token', data.access_token);message.success('Login successful');login({ ...data.user, token: data.access_token });navigate('/');} 
        else {message.error('Invalid server response');}
      })
      .catch(error => {console.error('Login error:', error);const errorMessage = error.message || (error.response?.data?.message) || 'Failed to login';message.error(errorMessage);})
      .finally(() => {setLoading(false);});
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
            <Title level={3} className="!mb-0 !text-[#a78bfa] font-bold text-center">
              Spark 👋
            </Title>
          </div>

          <Form name="login" layout="vertical" onFinish={handleLogin} autoComplete="off" initialValues={{ email: 'admin@gmail.com', password: '123456' }}>
            <Form.Item name="email" rules={[{ required: true, message: 'Please enter email!' }]}>
              <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Email" className="rounded-lg py-2" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Please enter password!' }]}>
              <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Password" className="rounded-lg py-2" />
            </Form.Item>

            <Form.Item>
              <Button loading={loading} type="primary" htmlType="submit" className="w-full h-12 bg-[#a78bfa] hover:!bg-[#3c315e] rounded-lg py-2 font-semibold mt-2 transition-all duration-300">
                Login
              </Button>
            </Form.Item>
          
            <div className="mt-2">
                <span className='text-md text-left'>Don't have an account?</span> <Link to="/register" className="text-[#a78bfa]">Create one</Link>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
}