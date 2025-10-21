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
        Schema::create('portfolio', function (Blueprint $table) {
            $table->id();
            $table->string('user_email');
            $table->string('custom_slug')->unique();
            $table->string('display_name');
            $table->string('headline')->nullable();
            $table->text('bio')->nullable();
            $table->text('profile_image')->nullable();
            $table->json('featured_projects')->nullable();
            $table->json('skills')->nullable();
            $table->json('certificates')->nullable();
            $table->json('social_links')->nullable();
            $table->boolean('is_public')->default(true);
            $table->integer('view_count')->default(0);
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('user_email')->references('email')->on('users')->onDelete('cascade');
            
            // Index for faster queries
            $table->index('user_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolio');
    }
};
