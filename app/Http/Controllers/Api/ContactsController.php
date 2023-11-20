<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PostContactRequest;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactsController extends Controller
{
    public function postContact(PostContactRequest $request, Contact $contact)
    {
        if (! $contact) {
            $contact = new Contact();
        }

        $contact->name = $request->validated('name');
        $contact->email = $request->validated('email');
        $contact->save();

        return response()->json([], 200);
    }

    public function deleteContact(Request $request, Contact $contact)
    {
        $contact->delete();

        return response()->json([], 200);
    }
}
