<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('admin_plans', function (Blueprint $table) {
            $table->decimal('annual_price', 10, 2)->nullable()->after('price');
            $table->json('billing_cycle')->nullable()->after('annual_price');
            $table->json('stripe_price_id')->nullable()->after('billing_cycle');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('admin_plans', function (Blueprint $table) {
            $table->dropColumn(['annual_price', 'billing_cycle', 'stripe_price_id']);
        });
    }
};
