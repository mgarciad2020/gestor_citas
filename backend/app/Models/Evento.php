<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    public $timestamps = false;
    
    protected $table = "evento";
    protected $fillable = ["dni_interesado", "fecha_evento", "fecha_creacion", "fecha_edicion", "dni_empleado_registro"];
}
