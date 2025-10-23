// Imports.
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2, Plus, DollarSign, Users, BookOpen, Video} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import api from '@/services/api';
import { toast } from 'sonner';


// Frontend.
const AdminSubscription = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  // Fetch plans.
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin-plans');
      setPlans(response.data.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete plan.
  const handleDeletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      await api.delete(`/admin-plans/${planId}`);
      toast.success('Plan deleted successfully');
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    }
  };

  const getPlanIcon = (name) => {
    const iconMap = {
      'Basic': '🎯',
      'Premium': '⭐',
      'Pro': '💎',
      'Enterprise': '🚀'
    };
    return iconMap[name] || '📦';
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
          <Button className="bg-black hover:bg-gray-800 text-white"><Plus className="w-4 h-4 mr-2" />Create Subscription</Button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative hover:shadow-lg transition-shadow">
              {/* Card Header with Actions */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
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
                  {getPlanIcon(plan.name)}
                </div>

                {/* Pricing */}
                <div className="mb-2">
                  <span className="text-2xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/mo</span>
                  {plan.annual_price && (
                    <>
                      <span className="mx-2 text-gray-400">or</span>
                      <span className="text-2xl font-bold">${plan.annual_price}</span>
                      <span className="text-gray-600">/yr</span>
                    </>
                  )}
                </div>

                {/* Savings Badge */}
                {plan.annual_price && plan.annual_price > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    Save ${((plan.price * 12) - plan.annual_price).toFixed(2)} (
                    {Math.round(((plan.price * 12 - plan.annual_price) / (plan.price * 12)) * 100)}% off) on yearly plan
                  </p>
                )}

                {/* Plan Name */}
                <CardTitle className="text-xl mt-3">{plan.name}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 pb-6">
                {/* Features List */}
                <div className="space-y-2 text-sm text-gray-600">
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
                  {plan.billing_cycle && plan.billing_cycle.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>
                        {plan.billing_cycle.map(cycle => 
                          cycle.charAt(0).toUpperCase() + cycle.slice(1)
                        ).join(', ')} Billing
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="pt-3 border-t">
                  <Badge 
                    variant={plan.is_active ? "default" : "secondary"}
                    className={plan.is_active ? "bg-green-500" : ""}
                  >
                    {plan.is_active ? 'Active' : 'Inactive'}
                  </Badge>
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
    </div>
  );
};

export default AdminSubscription;