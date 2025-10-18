// Imports.
import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '@/services/api';
const { Title } = Typography;


// Frontend.
export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // On finish.
  const onFinish = (values) => {
    setLoading(true);
    authAPI.register(values)
      .then(({ data }) => {message.success('Account created');if (data.token) {localStorage.setItem('api_token', data.token);}navigate('/login');})
      .catch(error => {console.error(error);message.error(error.message);})
      .finally(() => {setLoading(false);});
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
            <Title level={3} className="!mb-0 !text-[#a78bfa] font-bold text-center">Create account</Title>
          </div>

          <Form name="register" layout="vertical" onFinish={onFinish} autoComplete="off">
            <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
              <Input placeholder="Name" className="rounded-lg py-2" />
            </Form.Item>

            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
              <Input placeholder="Email" className="rounded-lg py-2" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Please enter password' }]}>
              <Input.Password placeholder="Password" className="rounded-lg py-2" />
            </Form.Item>

              <Form.Item>
                <Button loading={loading} type="primary" htmlType="submit" className="w-full h-12 bg-[#a78bfa] hover:!bg-[#3c315e] rounded-lg py-2 font-semibold mt-2 transition-all duration-300">Register</Button>
              </Form.Item>

            <div className="mt-2">
                <span className='text-md text-left'>Already have an account?</span> <Link to="/login" className="text-[#a78bfa]">Login Now</Link>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
}