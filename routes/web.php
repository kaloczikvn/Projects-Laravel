<?php

use App\Http\Controllers\Web\ProjectsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [ProjectsController::class, 'getProjects'])->name('projects');
Route::get('/new', [ProjectsController::class, 'getProjectNew'])->name('project-new');
Route::get('/{project}', [ProjectsController::class, 'getProjectEdit'])->name('project-edit');
