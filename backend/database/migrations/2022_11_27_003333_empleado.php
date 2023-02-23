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
        Schema::create("empleado", function(Blueprint $table){
            $table->string("dni", 10);
            $table->primary("dni");
            $table->string("nombres", 40);
            $table->string("apellidos", 60);
            $table->string("telefono", 10);
            $table->string("clave", 256);
            $table->dateTime("fecha_alta");
            $table->boolean("estado");
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
