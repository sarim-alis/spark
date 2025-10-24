// Imports.
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreVertical, Edit, Trash2, Plus, Eye, EyeOff, HelpCircle, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { stripeAPI } from '@/services/api';
import toast from 'react-hot-toast';
import { Drawer } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/admin.css';


// Frontend.
const AdminStripe = () => {
  // States.
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [formData, setFormData] = useState({ title: '', stripe_api_key: '', stripe_secret_key: ''});
  const [editFormData, setEditFormData] = useState({ title: '', stripe_api_key: '', stripe_secret_key: ''});

  useEffect(() => {
    fetchKeys();
  }, []);

  // Fetch keys.
  const fetchKeys = async () => {
    try {
      setLoading(true);
      const response = await stripeAPI.getAllKeys();
      setKeys(response.data.data || []);
    } catch (error) {
      console.error('Error fetching Stripe keys:', error);
      toast.error('Failed to load Stripe keys');
    } finally {
      setLoading(false);
    }
  };

  // Handle create key.
  const handleCreateKey = async () => {
    if (!formData.title || !formData.stripe_api_key || !formData.stripe_secret_key) {toast.error('Please fill in all fields'); return;}

    // Validate key formats.
    if (!formData.stripe_api_key.startsWith('pk_')) {toast.error('Public Key must start with "pk_"');return;}
    if (!formData.stripe_secret_key.startsWith('sk_')) {toast.error('Secret Key must start with "sk_"');return;}

    try {
      await stripeAPI.createKey(formData);
      toast.success('Stripe keys created successfully');
      setDrawerOpen(false);
      setFormData({ title: '', stripe_api_key: '', stripe_secret_key: '' });
      fetchKeys();
    } catch (error) {
      console.error('Error creating Stripe keys:', error);
      toast.error(error.message || 'Failed to create Stripe keys');
    }
  };

  // Handle update key.
  const handleUpdateKey = async () => {
    if (!editFormData.title) {toast.error('Title is required'); return;}

    // Validate key formats.
    if (editFormData.stripe_api_key && !editFormData.stripe_api_key.startsWith('pk_')) {toast.error('Public Key must start with "pk_"');return;}
    if (editFormData.stripe_secret_key && !editFormData.stripe_secret_key.startsWith('sk_')) {toast.error('Secret Key must start with "sk_"');return;}

    try {
      const updateData = { title: editFormData.title };
      if (editFormData.stripe_api_key) updateData.stripe_api_key = editFormData.stripe_api_key;
      if (editFormData.stripe_secret_key) updateData.stripe_secret_key = editFormData.stripe_secret_key;

      await stripeAPI.updateKey(editingKey.id, updateData);
      toast.success('Stripe keys updated successfully');
      setEditDrawerOpen(false);
      setEditingKey(null);
      setEditFormData({ title: '', stripe_api_key: '', stripe_secret_key: '' });
      fetchKeys();
    } catch (error) {
      console.error('Error updating Stripe keys:', error);
      toast.error(error.message || 'Failed to update Stripe keys');
    }
  };

  // Handle delete key.
  const handleDeleteKey = async (keyId) => {
    if (!confirm('Are you sure you want to delete these Stripe keys?')) return;

    try {
      await stripeAPI.deleteKey(keyId);
      toast.success('Stripe keys deleted successfully');
      fetchKeys();
    } catch (error) {
      console.error('Error deleting Stripe keys:', error);
      toast.error(error.message || 'Failed to delete Stripe keys');
    }
  };

  // Handle edit click.
  const handleEditClick = (key) => {
    setEditingKey(key);
    setEditFormData({ title: key.title, stripe_api_key: key.stripe_api_key, stripe_secret_key: key.stripe_secret_key });
    setEditDrawerOpen(true);
  };

  // Mask key.
  const maskKey = (key) => {
    if (!key) return '';
    return '•'.repeat(16);
  };

  // Handle click outside.
  const handleClickOutside = (e) => {
    if (e.target.classList.contains('admin-popup-overlay')) {
      setShowHelpPopup(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Stripe</h1>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setShowHelpPopup(true)}>
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>

      <div className="border-b border-gray-200 mb-6"></div>

      {/* Popup */}
      <AnimatePresence>
        {showHelpPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="admin-popup-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleClickOutside}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", duration: 0.3 }} className="admin-popup-content bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="admin-popup-header sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">How to Connect Your Stripe Account</h2>
                <button onClick={() => setShowHelpPopup(false)} className="admin-close-button p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="admin-popup-body p-6 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <span className="admin-step-title text-lg font-semibold text-violet-600">Step 1: </span>
                  <span className="admin-step-data text-lg font-semibold text-gray-900">Create a Stripe account</span>
                  <p className="admin-step-contents mt-2 text-gray-600">
                    Go to <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">stripe.com</a> and sign up for a free account. Fill out your personal and business details to complete registration.
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <span className="admin-step-title text-lg font-semibold text-violet-600">Step 2: </span>
                  <span className="admin-step-data text-lg font-semibold text-gray-900">Verify Your Stripe Account</span>
                  <p className="admin-step-contents mt-2 text-gray-600">To start receiving payments, make sure your account is verified. You may be asked to provide business documents and bank account details.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <span className="admin-step-title text-lg font-semibold text-violet-600">Step 3: </span>
                  <span className="admin-step-data text-lg font-semibold text-gray-900">Get Your API Keys</span>
                  <p className="admin-step-contents mt-2 text-gray-600">After logging in to your Stripe Dashboard, go to <strong>Developers &gt; API Keys</strong>. Copy the <strong>Publishable Key</strong> and <strong>Secret Key</strong>. </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <span className="admin-step-title text-lg font-semibold text-violet-600">Step 4: </span>
                  <span className="admin-step-data text-lg font-semibold text-gray-900">Paste the Keys on CourseSpark</span>
                  <p className="admin-step-contents mt-2 text-gray-600">Return to CourseSpark, go to the Stripe Settings in your dashboard, and paste your <strong>Public Key</strong> and <strong>Secret Key</strong> into the provided fields.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <span className="admin-step-title text-lg font-semibold text-violet-600">Step 5: </span>
                  <span className="admin-step-data text-lg font-semibold text-gray-900">Save and You're Done!</span>
                  <p className="admin-step-contents mt-2 text-gray-600">Click the Save button. Once your keys are validated, your Stripe account will be connected and you'll be able to start accepting payments.</p>
                  <p className="admin-step-content mt-4 text-gray-500 italic">💡 Need help? Visit <a href="https://support.stripe.com" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">Stripe Support</a> or contact our team.</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keys */}
      <AnimatePresence mode="wait">
        {keys.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="empty">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">No Stripe keys configured yet</p>
                <Button onClick={() => setDrawerOpen(true)} variant="outline"><Plus className="h-4 w-4 mr-2" />Add Your First Keys</Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4" key="list">
            {keys.map((key, index) => (
              <motion.div key={key.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.1 }}>
                <Card className="hover:shadow-md transition-shadow relative">
                  <CardContent className="p-6">
                    <div className="absolute top-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-12 w-12">
                            <MoreVertical className="h-6 w-6" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(key)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteKey(key.id)} className="text-red-600 focus:text-red-600"><Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-4 pr-12">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Title</Label>
                        <Input value={key.title} readOnly onClick={() => handleEditClick(key)} className="mt-1 cursor-pointer bg-gray-50 h-10" />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Public Key</Label>
                        <Input value={maskKey(key.stripe_api_key)} readOnly onClick={() => handleEditClick(key)} className="mt-1 cursor-pointer bg-gray-50 font-mono h-10" />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Secret Key</Label>
                        <Input value={maskKey(key.stripe_secret_key)} readOnly onClick={() => handleEditClick(key)} className="mt-1 cursor-pointer bg-gray-50 font-mono h-10" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create */}
      <Drawer title={<div className="flex items-center justify-between pr-6"><span className="text-lg font-semibold">Add/Edit</span></div>} placement="right" onClose={() => { setDrawerOpen(false); setFormData({ title: '', stripe_api_key: '', stripe_secret_key: '' });}} open={drawerOpen} width={480}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">Title <span className="text-red-500">*</span></Label>
              <Input id="title" placeholder="My Keys" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="mt-1 h-10" />
            </div>

            <div>
              <Label htmlFor="public_key" className="text-sm font-medium">Public Key <span className="text-red-500">*</span></Label>
              <div className="relative mt-1">
                <Input id="public_key" type={showPublicKey ? 'text' : 'password'} placeholder="pk_test_..." value={formData.stripe_api_key} onChange={(e) => setFormData({ ...formData, stripe_api_key: e.target.value })} className="pr-10 h-10" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10" onClick={() => setShowPublicKey(!showPublicKey)} >
                  {showPublicKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="secret_key" className="text-sm font-medium">Secret Key <span className="text-red-500">*</span></Label>
              <div className="relative mt-1">
                <Input id="secret_key" type={showSecretKey ? 'text' : 'password'} placeholder="sk_test_..." value={formData.stripe_secret_key} onChange={(e) => setFormData({ ...formData, stripe_secret_key: e.target.value })} className="pr-10 h-10" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10" onClick={() => setShowSecretKey(!showSecretKey)}>
                  {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={handleCreateKey} className="w-full admin-btn-primary py-6 text-base">
              <Plus className="h-5 w-5 mr-2" />Add New Stripe Keys
            </Button>
          </motion.div>
        </motion.div>
      </Drawer>

      {/* Edit */}
      <Drawer title={<div className="flex items-center justify-between pr-6"><span className="text-lg font-semibold">Edit Stripe Keys</span></div>} placement="right" onClose={() => {setEditDrawerOpen(false);setEditingKey(null);setEditFormData({ title: '', stripe_api_key: '', stripe_secret_key: '' });}} open={editDrawerOpen} width={480}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_title" className="text-sm font-medium">Title <span className="text-red-500">*</span></Label>
              <Input id="edit_title" placeholder="My Keys" value={editFormData.title} onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} className="mt-1 h-10" />
            </div>

            <div>
              <Label htmlFor="edit_public_key" className="text-sm font-medium">Public Key<span className="text-red-500"> *</span></Label>
              <div className="relative mt-1">
                <Input id="edit_public_key" type={showPublicKey ? 'text' : 'password'} placeholder="pk_test_..." value={editFormData.stripe_api_key} onChange={(e) => setEditFormData({ ...editFormData, stripe_api_key: e.target.value })} className="pr-10" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10" onClick={() => setShowPublicKey(!showPublicKey)}>
                  {showPublicKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="edit_secret_key" className="text-sm font-medium">Secret Key<span className="text-red-500"> *</span></Label>
              <div className="relative mt-1">
                <Input id="edit_secret_key" type={showSecretKey ? 'text' : 'password'} placeholder="sk_test_..." value={editFormData.stripe_secret_key} onChange={(e) => setEditFormData({ ...editFormData, stripe_secret_key: e.target.value })} className="pr-10" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10" onClick={() => setShowSecretKey(!showSecretKey)}>
                  {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={handleUpdateKey} className="w-full admin-btn-primary py-6 text-base">
              <Edit className="h-5 w-5 mr-2" />
              Update Stripe Keys
            </Button>
          </motion.div>
        </motion.div>
      </Drawer>
    </div>
  );
};

export default AdminStripe;
