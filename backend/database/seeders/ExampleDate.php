<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExampleDate extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('evento')->insert([
            "dni_interesado" => "12345678X",
            "fecha_evento" => date('Y-m-d H:i:s', 1661042420),
            "fecha_creacion" => date('Y-m-d H:i:s'),
            "fecha_edicion" => date('Y-m-d H:i:s'),
            "observaciones" => "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "dni_empleado_registro" => "99999999A"
        ]);

        DB::table('evento')->insert([
            "dni_interesado" => "85445565D",
            "fecha_evento" => date('Y-m-d H:i:s', 1669855220),
            "fecha_creacion" => date('Y-m-d H:i:s'),
            "fecha_edicion" => date('Y-m-d H:i:s'),
            "observaciones" => "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
            "dni_empleado_registro" => "99999999A"
        ]);

        DB::table('evento')->insert([
            "dni_interesado" => "17253633D",
            "fecha_evento" => date('Y-m-d H:i:s', 1586047220),
            "fecha_creacion" => date('Y-m-d H:i:s'),
            "fecha_edicion" => date('Y-m-d H:i:s'),
            "observaciones" => "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
            "dni_empleado_registro" => "99999999A"
        ]);
    }
}
