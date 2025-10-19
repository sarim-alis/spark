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
        // Clean up existing data - extract numbers from strings like "4 hours"
        $courses = DB::table('course')->whereNotNull('duration_hours')->get();
        foreach ($courses as $course) {
            $cleanValue = preg_replace('/[^0-9.]/', '', $course->duration_hours);
            $floatValue = $cleanValue ? (float)$cleanValue : null;
            DB::table('course')->where('id', $course->id)->update(['duration_hours' => $floatValue]);
        }
        
        // Change duration_hours to float
        DB::statement('ALTER TABLE course MODIFY duration_hours FLOAT(8,2) NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Change back to string
        DB::statement('ALTER TABLE course MODIFY duration_hours VARCHAR(255) NULL');
    }
};
