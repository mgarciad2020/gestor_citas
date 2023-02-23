<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Support\Facades\Auth;

class EmpleadoController extends Controller
{
    public function getEmployees()
    {
        if (!Auth::check())
            return response()->json(["success" => false, "message" => "Unauthorized!"], 401);
            
        $result = [];
        $employees = Empleado::orderBy('dni', 'asc')->get();
        foreach ($employees as $employee)
        {
            //Group by DNI
            $result[$employee->dni] = $employee;
        }
        return response()->json($result);
    }
}
