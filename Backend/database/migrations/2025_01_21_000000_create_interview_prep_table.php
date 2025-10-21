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
        Schema::create('interview_prep', function (Blueprint $table) {
            $table->id();
            $table->string('user_email');
            $table->string('job_role')->nullable();
            $table->json('course_ids')->nullable();
            $table->string('difficulty')->default('intermediate');
            $table->string('interview_type')->default('mixed');
            $table->json('sessions')->nullable();
            $table->integer('total_sessions')->default(0);
            $table->float('average_score')->default(0);
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
        Schema::dropIfExists('interview_prep');
    }
};
