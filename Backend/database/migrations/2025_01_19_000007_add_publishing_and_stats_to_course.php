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
        Schema::table('course', function (Blueprint $table) {
            $table->boolean('is_published')->default(false)->after('thumbnail_url');
            $table->integer('total_students')->default(0)->after('is_published');
            $table->decimal('total_sales', 10, 2)->default(0)->after('total_students');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course', function (Blueprint $table) {
            $table->dropColumn(['is_published', 'total_students', 'total_sales']);
        });
    }
};
