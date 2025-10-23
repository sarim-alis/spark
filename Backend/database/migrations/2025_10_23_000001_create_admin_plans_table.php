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
        Schema::create('admin_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Basic, Premium, Pro
            $table->string('icon')->nullable(); // Icon URL
            $table->enum('type', ['monthly', 'annual'])->default('monthly');
            $table->decimal('price', 10, 2)->default(0); // Plan price
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Admin who created the plan
            $table->integer('course_nos')->default(3); // Number of courses allowed
            $table->integer('lectures_nos')->default(10); // Number of lectures allowed
            $table->decimal('platform_fee', 5, 2)->default(0); // Platform fee percentage taken by admin
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['user_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_plans');
    }
};
