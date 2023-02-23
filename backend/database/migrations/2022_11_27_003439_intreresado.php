<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("interesado", function(Blueprint $table){
            $table->string("dni", 10);
            $table->primary("dni");
            $table->string("nombres", 40);
            $table->string("apellidos", 60);
            $table->string("telefono", 10);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
