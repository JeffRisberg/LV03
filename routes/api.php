<?php

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Task;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/tasks/{task_id?}', function ($task_id) {
    $task = Task::find($task_id);

    return response()->json($task);
});

Route::post('/tasks', function (Request $request) {
    $task = Task::create($request->all());

    return response()->json($task);
});

Route::put('/tasks/{task_id?}', function (Request $request, $task_id) {
    $task = Task::find($task_id);

    $task->task = $request->task;
    $task->description = $request->description;

    $task->save();

    return response()->json($task);
});

Route::delete('/tasks/{task_id?}', function ($task_id) {
    $task = Task::destroy($task_id);

    return response()->json($task);
});
