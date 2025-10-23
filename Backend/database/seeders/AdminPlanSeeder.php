<?php

namespace Database\Seeders;

use App\Models\AdminPlan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a default admin user if none exists
        $admin = User::where('role', 'admin')->first();
        
        if (!$admin) {
            $admin = User::create([
                'name' => 'Admin',
                'email' => 'admin@coursespark.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]);
        }

        // Create default plans based on the image
        $plans = [
            [
                'name' => 'Basic',
                'icon' => '/icons/basic-plan.svg',
                'type' => 'monthly',
                'price' => 0.00,
                'annual_price' => 0.00,
                'billing_cycle' => ['monthly'],
                'stripe_price_id' => [],
                'user_id' => $admin->id,
                'course_nos' => 3,
                'lectures_nos' => 10,
                'platform_fee' => 0.00,
                'is_active' => true,
            ],
            [
                'name' => 'Premium',
                'icon' => '/icons/premium-plan.svg',
                'type' => 'monthly',
                'price' => 10.00,
                'annual_price' => 100.00,
                'billing_cycle' => ['monthly', 'annual'],
                'stripe_price_id' => [],
                'user_id' => $admin->id,
                'course_nos' => 10,
                'lectures_nos' => 30,
                'platform_fee' => 10.00,
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'icon' => '/icons/pro-plan.svg',
                'type' => 'monthly',
                'price' => 50.00,
                'annual_price' => 500.00,
                'billing_cycle' => ['monthly', 'annual'],
                'stripe_price_id' => [],
                'user_id' => $admin->id,
                'course_nos' => 3,
                'lectures_nos' => 40,
                'platform_fee' => 15.00,
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            AdminPlan::create($plan);
        }

        $this->command->info('Admin plans seeded successfully!');
        $this->command->info('Admin credentials: admin@coursespark.com / admin123');
    }
}
