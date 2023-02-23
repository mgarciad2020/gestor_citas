<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Interesado;

use Illuminate\Support\Facades\Auth;

class InteresadoController extends Controller
{

    //Enter DNI without dash '-' here
    private function formatDni($dni){
        //Format DNI as prettier
        $verifierLetter = substr($dni, strlen($dni) - 1); 
        return substr($dni, 0, strlen($dni) - 1) . '-' . $verifierLetter;
    }
    
    public function getInteresteds()
    {
        if (!Auth::check())
            return response()->json(["success" => false, "message" => "Unauthorized!"], 401);

        $interesteds = Interesado::all();
        foreach ($interesteds as $interested)
            $interested->dni = $this->formatDni($interested->dni);

        return response()->json($interesteds);
    }
    
    public function getInterested($dni)
    {
        if (!Auth::check())
            return response()->json(["success" => false, "message" => "Unauthorized!"], 401);

        $dniFormatted = str_replace('-', "", $dni);
        $interested = Interesado::where('dni', $dniFormatted);

        if ($interested->count() <= 0)
            return response()->json(["success" => false, "message" => "Interesado no encontrado."]);

        $interested = $interested->firstOrFail();
        $interested->dni = $this->formatDni($interested->dni);
        return response()->json($interested);
    }
}