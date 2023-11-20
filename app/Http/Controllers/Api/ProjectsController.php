<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostProjectRequest;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectsController extends Controller
{
    public function getProjects(Request $request)
    {
        $statuses = $request->get('statuses');

        $projects = Project::query()
            ->withCount(['contacts'])
            ->when($statuses, function ($query) use ($statuses) {
                $query->whereIn('status', $statuses);
            })->paginate(10);

        return response()->json($projects, 200);
    }

    public function postProject(PostProjectRequest $request, Project $project)
    {
        $project->name = $request->validated('name');
        $project->description = $request->validated('description');
        $project->status = $request->validated('status');
        $project->save();

        return response()->json([], 200);
    }

    public function deleteProject(Request $request, Project $project)
    {
        $project->delete();

        return response()->json([], 200);
    }
}
