<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExampleClients extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('interesado')->insert([
            "dni" => "12345678X",
            "nombres" => "Julio Eduardo",
            "apellidos" => "Pereyra Garcia",
            "telefono" => "642741152"
        ]);
        
        DB::table('interesado')->insert([
            "dni" => "85445565D",
            "nombres" => "Alejandra",
            "apellidos" => "Correa Terrazas",
            "telefono" => "622412200"
        ]);

        DB::table('interesado')->insert([
            "dni" => "17253633D",
            "nombres" => "Gustavo",
            "apellidos" => "Novoa Pazos",
            "telefono" => "911256330"
        ]);
    }
}
