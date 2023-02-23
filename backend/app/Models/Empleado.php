<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as UserContract;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Empleado extends Authenticatable implements JWTSubject
{
    public $timestamps = false;
    public $primaryKey = "dni";
    public $keyType = 'string';

    protected $table = "empleado";
    protected $fillable = ["dni", "nombres", "apellidos", "telefono", "clave", "fecha_alta", "estado"];
    protected $hidden = ["clave", "fecha_alta", "estado"];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->clave;
    }

}
