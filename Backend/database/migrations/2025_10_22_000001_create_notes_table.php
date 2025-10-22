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
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->string('topic');
            $table->string('depth')->default('comprehensive');
            $table->longText('content');
            $table->unsignedBigInteger('created_by');
            $table->timestamps();
            
            // Add foreign key constraint
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            
            // Add index for faster queries
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
