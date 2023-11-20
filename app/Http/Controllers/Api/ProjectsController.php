<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostProjectRequest;
use App\Models\Contact;
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
        if (! $project) {
            $project = new Project();
        }

        $project->name = $request->validated('name');
        $project->description = $request->validated('description');
        $project->status = $request->validated('status');
        $project->save();

        $contacts = $request->validated('contacts');
        if (isset($contacts) && count($contacts) > 0) {
            foreach ($contacts as $c) {
                $contact = new Contact();
                $contact->project_id = $project->id;
                $contact->name = $c['name'];
                $contact->email = $c['email'];
                $contact->save();
            }
            $project->refresh();
        }

        return response()->json($project, 200);
    }

    public function deleteProject(Request $request, Project $project)
    {
        $project->delete();

        return response()->json([], 200);
    }
}
