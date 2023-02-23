<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\Evento;
use App\Models\Interesado;
use \Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;

class EventoController extends Controller
{
    //This const is a limit of total items by page
    private $MAX_ITEMS = 5;


    public function getEvents($page = 1, Request $request)
    {
        if (!Auth::check())
            return response()->json(["success" => false, "message" => "Unauthorized!"], 401);

        $response = ["pages" => ["current" => 0, "total" => 0 ], "result" => []];

        //Base query
        $events = Evento::orderBy('fecha_evento', 'desc');
        
        $filter = $request->filter;
        if ($filter != null)
        {
            if ($filter["dates"] != null)
                $events = $events->where("fecha_evento", '>=', $filter["dates"]["dateFrom"])->where("fecha_evento", '<=', $filter["dates"]["dateTo"]);

            if ($filter["owner"] != null)
                $events = $events->where("dni_empleado_registro", $filter["owner"]);
        }

        // ============= Pagination ============= 
        //Current page
        $response["pages"]["current"] = $page;

        //Calculate remaining and total pages
        $totalPages = ceil($events->count() / $this->MAX_ITEMS); 
        $remain = abs($events->count() - ($this->MAX_ITEMS * $totalPages));
        if ($totalPages == $remain)
            $response["pages"]["total"] = $remain;
        else
            $response["pages"]["total"] = $remain > $totalPages ? $totalPages : abs($remain - $totalPages);
        
        $events = $events->skip($this->MAX_ITEMS * ($response["pages"]["current"] - 1))->take($this->MAX_ITEMS)->get();
        foreach($events as $event)
        {
            $event->interested = Interesado::where("dni", '=', $event->dni_interesado)->first();
            $event->employee = Empleado::where("dni", '=', $event->dni_empleado_registro)->first();

            //Group by id
            $response["result"][$event->id] = $event;
        }
        return response()->json($response);
    }

    public function deleteEvent($id)
    {
        if (!Auth::check())
            return response()->json(["success" => false, "message" => "Unauthorized!"], 401);

        $event = Evento::where('id', $id);
        if ($event->count() <= 0)
            return response()->json(["success" => false, "message" => "Evento no encontrado."]);

        //DELETE is for the QUERY. Don't use $event->get()!
        $event->delete();
        return response()->json(["success" => true, "message" => "Evento eliminado satisfactoriamente"]);
        
    }

    public function editEvent($id, Request $request){
        if (!Auth::check())
            return response()->json(["success" => false, "message" => "Unauthorized!"], 401);

        $data = $request->data;
        if ($data == null)
            return response()->json(["success" => false, "message" => "No hay datos para reemplazar."]);

        //Modify comment itself info
        $event = Evento::find($id);
        if ($event->count() <= 0)
            return response()->json(["success" => false, "message" => "Evento no encontrado."]);

        $event->observaciones = $data["comments"];
        $event->fecha_evento = $data["dateTime"];
        $event->fecha_edicion = date("Y-m-d H:i:s");
        $event->save();

        // ------------------------------------------------------------------------------------------

        //Modify comment isuer info
        Interesado::where('dni', $event->dni_interesado)->update([
            "nombres" => $data["names"],
            "apellidos" => $data["lastnames"],
            "telefono" => $data["telephone"]
        ]);

        return response()->json(["success" => true, "message" => "Evento modificado correctamente!"]);
    }

    public function addEvent(Request $request){
        if (!Auth::check())
            return response()->json(["success" => false, "message" => "Unauthorized!"], 401);

        // First, we make sure the user have sumitted something.
        $data = $request->data;
        if ($data == null)
            return response()->json(["success" => false, "message" => "No hay datos para agregar."]);

        //Clear DNI format (remove '-')
        $dni = str_replace('-', '', $data["dni"]);
        /* Second, we make sure to find interested by it's dni.
           If doesn't exists, we will create a new one.
        */
        $interested = Interesado::where("dni", $dni);
        if ($interested->count() <= 0)
        {
            //The interested doesn't exists, so we have to create the new one.
            $interested = new Interesado();
            $interested->dni = $dni;
            $interested->nombres = $data["names"];
            $interested->apellidos = $data["lastnames"];
            $interested->telefono = $data["telephone"];
            $interested->save();
        } else {
            $interested = $interested->first();
        }

        //Then, save the event
        $event = new Evento();
        $event->dni_interesado = $dni;
        $event->fecha_evento = $data["dateTime"];
        $event->fecha_creacion = date("Y-m-d H:i:s");
        $event->fecha_edicion = date("Y-m-d H:i:s");
        $event->observaciones = $data["comments"];

        //TODO: Change this AT FUTURE when Login will be working!!
        $event->dni_empleado_registro = Empleado::first()->dni;
        $event->save();

        return response()->json(["success" => true, "message" => "Evento creado correctamente!"]);

    }
}
