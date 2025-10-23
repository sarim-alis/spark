// Imports.
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2, Plus, DollarSign, Users, BookOpen, Video} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { adminAPI } from '@/services/api';
import toast from 'react-hot-toast';
import { Drawer, Form, Input, InputNumber, Segmented, Select } from 'antd';
import { menu } from '@/api/menu.js';


// Frontend.
const AdminSubscription = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [billingType, setBillingType] = useState('Monthly');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPlans();
  }, []);

  // Fetch plans.
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllPlans();
      console.log('Fetched plans:', response.data);
      setPlans(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load subscription plans');
      setLoading(false);
    }
  };

  // Handle delete plan.
  const handleDeletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      await adminAPI.deletePlan(planId);
      toast.success('Plan deleted successfully');
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    }
  };

  const getPlanIcon = (icon, name) => {
    // If icon is an emoji (single character or emoji), return it
    if (icon && icon.length <= 4 && !icon.includes('an-')) {
      return icon;
    }
    // If icon is a class name, render as <i> tag
    if (icon && icon.includes('an-')) {
      return <i className={icon} style={{ fontSize: '32px', color: 'white' }}></i>;
    }
    // Fallback to emoji based on name
    const iconMap = {
      'Basic': '🎯',
      'Premium': '⭐',
      'Pro': '💎',
      'Enterprise': '🚀'
    };
    return iconMap[name] || '📦';
  };

  // Handle create plan.
  const handleCreatePlan = async (values) => {
    try {
      console.log('Form values:', values);
      const planData = {
        name: values.packageName,
        icon: values.icon || '📦',
        type: values.packageType || 'monthly',
        price: billingType === 'Monthly' ? values.monthlyPrice : 0,
        annual_price: billingType === 'Annual' ? values.annualPrice : null,
        billing_cycle: billingType === 'Monthly' ? ['monthly'] : ['annual'],
        stripe_price_id: [],
        course_nos: values.courseNos || 0,
        lectures_nos: values.lecturesNos || 0,
        platform_fee: values.platformFee || 0,
        is_active: true
      };

      console.log('Sending plan data:', planData);
      const response = await adminAPI.createPlan(planData);
      console.log('Create response:', response);
      
      // Close drawer and reset form first
      setDrawerOpen(false);
      form.resetFields();
      setBillingType('Monthly');
      
      // Show success toast
      toast.success('Plan created successfully!', {
        duration: 3000,
        position: 'top-right',
      });
      
      // Refresh the plans list
      await fetchPlans();
    } catch (error) {
      console.error('Error creating plan:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create plan';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  // Handle drawer close.
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    form.resetFields();
    setBillingType('Monthly');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
            <p className="text-gray-600 mt-1">Manage your subscription plans</p>
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white" onClick={() => setDrawerOpen(true)}><Plus className="w-4 h-4 mr-2" />Create Subscription</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><MoreVertical className="w-8 h-8 text-gray-400" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePlan(plan.id)}><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardHeader className="text-center pt-8 pb-4">
                {/* Plan Icon */}
                <div className="w-20 h-20 mx-auto mb-4 bg-black rounded-full flex items-center justify-center text-3xl">
                  {getPlanIcon(plan.icon, plan.name)}
                </div>

                {/* Pricing */}
                <div className="mb-2">
                  <span className="text-lg font-bold">${plan.price}/mo</span>
                  {plan.annual_price && parseFloat(plan.annual_price) > 0 && (
                    <>
                      <span className="mx-2 text-gray-400"> | </span>
                      <span className="text-lg font-bold">${plan.annual_price}/yr</span>
                    </>
                  )}
                </div>

                {/* Savings Badge or Free Plan Note */}
                {parseFloat(plan.price) === 0 ? (
                  <p className="text-sm text-green-600 font-medium">
                    Free for 1st month, then switch to paid plan
                  </p>
                ) : plan.annual_price && parseFloat(plan.annual_price) > 0 && parseFloat(plan.price) > 0 ? (
                  <p className="text-sm text-green-600 font-medium">
                    Save ${((plan.price * 12) - plan.annual_price).toFixed(2)} (
                    {Math.round(((plan.price * 12 - plan.annual_price) / (plan.price * 12)) * 100)}% off) on yearly plan
                  </p>
                ) : (
                  <p className="text-sm text-transparent font-medium">
                    &nbsp;
                  </p>
                )}
                {/* Plan Name */}
                <CardTitle className="text-xl mt-3">{plan.name}</CardTitle>
              </CardHeader>

              <div className="flex items-center justify-center border-gray-200"><div className="w-1/2 border-t border-gray-200 mb-6"></div></div>
              <CardContent className="space-y-3 pb-6">
                {/* Features List */}
                <div className="space-y-2 text-sm text-gray-600 flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>{plan.course_nos} Courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-indigo-600" />
                    <span>{plan.lectures_nos} Lectures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-indigo-600" />
                    <span>{plan.platform_fee}% Platform Fee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {plans.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No subscription plans yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first subscription plan to get started
            </p>
          </div>
        )}
      </div>

      {/* Drawer for Adding Subscription */}
      <Drawer
        title="Add Subscription Package"
        placement="right"
        width={400}
        onClose={handleDrawerClose}
        open={drawerOpen}
        footer={
          <div className="flex justify-end">
            <Button 
              onClick={() => form.submit()} 
              className="w-full bg-black hover:bg-gray-800 text-white h-12 mb-4 mt-4"
            >
              Save
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreatePlan}
          className="[&_.ant-form-item-label>label]:font-semibold"
        >
          {/* Package Name */}
          <Form.Item
            label="Package Name"
            name="packageName"
            rules={[{ required: true, message: 'Please enter package name' }]}
          >
            <Input placeholder="Enter package Name" className="h-10" />
          </Form.Item>

          {/* Select Icon */}
          <Form.Item
            label="Select Icon"
            name="icon"
            rules={[{ required: true, message: 'Please select an icon' }]}
          >
            <Select
              showSearch
              placeholder="Select Icon"
              optionFilterProp="label"
              className="h-10"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {menu.map(item => (
                <Select.Option key={item.name} value={item.iconClass} label={item.name}>
                  <div className="flex items-center gap-2">
                    <i className={item.iconClass} style={{ fontSize: '18px' }}></i>
                    <span>{item.name}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Billing Type Segmented */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-3">Package type</p>
            <Segmented
              options={['Monthly', 'Annual']}
              value={billingType}
              onChange={setBillingType}
              block
              className="bg-gray-100"
            />
          </div>

          {/* Monthly Price */}
          {billingType === 'Monthly' && (
            <Form.Item
              label="Monthly Price"
              name="monthlyPrice"
              rules={[{ required: true, message: 'Please enter monthly price' }]}
            >
              <InputNumber
                placeholder="Enter monthly price"
                className="w-full h-10"
                min={0}
                prefix="$"
              />
            </Form.Item>
          )}

          {/* Annual Price */}
          {billingType === 'Annual' && (
            <Form.Item
              label="Annual Price"
              name="annualPrice"
              rules={[{ required: true, message: 'Please enter annual price' }]}
            >
              <InputNumber
                placeholder="Enter annual price"
                className="w-full h-10"
                min={0}
                prefix="$"
              />
            </Form.Item>
          )}

          {/* Number of Courses */}
          <Form.Item 
            label="Number of Courses" 
            name="courseNos"
            rules={[{ required: true, message: 'Please enter number of courses' }]}
          >
            <InputNumber
              placeholder="Enter number of courses"
              className="w-full h-10"
              min={0}
            />
          </Form.Item>

          {/* Number of Lectures */}
          <Form.Item 
            label="Number of Lectures" 
            name="lecturesNos"
            rules={[{ required: true, message: 'Please enter number of lectures' }]}
          >
            <InputNumber
              placeholder="Enter number of lectures"
              className="w-full h-10"
              min={0}
            />
          </Form.Item>

          {/* Platform Fee */}
          <Form.Item label="Platform Fee (%)" name="platformFee">
            <InputNumber
              placeholder="Enter platform fee percentage"
              className="w-full h-10"
              min={0}
              max={100}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default AdminSubscription;