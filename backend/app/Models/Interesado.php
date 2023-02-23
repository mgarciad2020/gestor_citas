<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interesado extends Model
{
    public $timestamps = false;
    
    protected $table = "interesado";
    protected $fillable = ["dni", "nombres", "apellidos", "telefono"];
}
