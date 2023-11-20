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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description');
            // Az ok, hogy miért lett tinyInt, mert ez később bővíthető migráció nélkül, míg az enum típus nem.
            $table->unsignedTinyInteger('status')->comment('0 - Fejlesztésre vár, 1 - Folyamatban, 2 - Kész');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
