<?php

use App\Http\Controllers\Api\ContactsController;
use App\Http\Controllers\Api\ProjectsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/projects', [ProjectsController::class, 'getProjects']);

Route::post('/project/{project?}', [ProjectsController::class, 'postProject']);
Route::delete('/project/{project}', [ProjectsController::class, 'deleteProject']);

Route::post('/contact/{project}/{contact?}', [ContactsController::class, 'postContact']);
Route::delete('/contact/{project}/{contact}', [ContactsController::class, 'deleteContact']);
