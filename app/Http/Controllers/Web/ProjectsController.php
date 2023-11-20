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

    public function getProject(Project $project)
    {
        return view('project', [
            'project' => $project->load(['contacts']),
        ]);
    }
}
