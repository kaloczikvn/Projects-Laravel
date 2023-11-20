<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostContactRequest;
use App\Models\Contact;
use App\Models\Project;
use Illuminate\Http\Request;

class ContactsController extends Controller
{
    public function postContact(PostContactRequest $request, Project $project, Contact $contact)
    {
        if (! $contact) {
            $contact = new Contact();
        }

        $contact->project_id = $project->id;
        $contact->name = $request->validated('name');
        $contact->email = $request->validated('email');
        $contact->save();

        return response()->json($project->contacts()->get(), 200);
    }

    public function deleteContact(Request $request, Project $project, Contact $contact)
    {
        $contact->delete();

        return response()->json($project->contacts()->get(), 200);
    }
}
