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
        Schema::create('stripe_keys', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('stripe_secret_key');
            $table->string('stripe_api_key');
            $table->string('title');
            $table->json('key_history')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('role'); // 'admin' or 'creator'
            $table->foreignId('admin_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->timestamps();

            // Add indexes for better query performance
            $table->index('role');
            $table->index('user_id');
            $table->index('admin_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stripe_keys');
    }
};
