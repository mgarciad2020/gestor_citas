<?php

use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\InteresadoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get("employees", [EmpleadoController::class, "getEmployees"]);
Route::get("events/{page?}", [EventoController::class, "getEvents"]);

Route::get("interesteds", [InteresadoController::class, "getInteresteds"]);
Route::get("interesteds/{dni}", [InteresadoController::class, "getInterested"]);

Route::post("events", [EventoController::class, "addEvent"]);
Route::post("events/{id}/delete", [EventoController::class, "deleteEvent"]);
Route::post("events/{id}/edit", [EventoController::class, "editEvent"]);

//Authentication JWT
Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');
    Route::get('me', 'me');
});
