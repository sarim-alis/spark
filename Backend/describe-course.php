<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$columns = DB::select('DESCRIBE course');

echo "Course Table Structure:\n";
echo "=======================\n\n";

foreach ($columns as $column) {
    echo "- {$column->Field} ({$column->Type})\n";
}

echo "\n";
