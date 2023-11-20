<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectsController extends Controller
{
    public function getProjects(Request $request)
    {
        return view('projects');
    }

    public function getProjectNew(Request $request)
    {
        return view('project_new');
    }

    public function getProjectEdit(Project $project)
    {
        return view('project_edit', [
            'project' => $project->load(['contacts']),
        ]);
    }
}
