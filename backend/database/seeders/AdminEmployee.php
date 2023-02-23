<?php

namespace Database\Seeders;

use DateTime;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

use function PHPSTORM_META\map;

class AdminEmployee extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table("empleado")->insert([
            "dni" => "T0000021Q",
            "nombres" => "Lola",
            "apellidos" => "Mento",
            "telefono" => "926788801",
            "clave" => Hash::make("lolamentolada"),
            "fecha_alta" => date('Y-m-d H:i:s'),
            "estado" => true
        ]);
    }
}
