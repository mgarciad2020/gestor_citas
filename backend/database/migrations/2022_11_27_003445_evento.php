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
        Schema::create("evento", function(Blueprint $table){
            $table->increments("id");
            $table->string("dni_interesado", 10);
            $table->foreign("dni_interesado")->references("dni")->on("interesado");
            $table->dateTime("fecha_evento");
            $table->dateTime("fecha_creacion");
            $table->dateTime("fecha_edicion");
            $table->text("observaciones")->nullable()->default(null);
            $table->string("dni_empleado_registro", 10);
            $table->foreign("dni_empleado_registro")->references("dni")->on("empleado");
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
