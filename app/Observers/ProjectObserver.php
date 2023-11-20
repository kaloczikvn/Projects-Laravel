<?php

namespace App\Observers;

use App\Models\Project;
use Illuminate\Support\Facades\Mail;

class ProjectObserver
{
    /**
     * Handle the Project "created" event.
     */
    public function created(Project $project): void
    {
        //
    }

    /**
     * Handle the Project "updated" event.
     */
    public function updated(Project $project): void
    {
        $project = $project->load('contacts');
        $changed_values = $project->getChanges();

        if (count($changed_values) === 0) {
            return;
        }

        if (count($project->contacts) === 0) {
            return;
        }

        $recipients = [];
        foreach ($project->contacts as $contact) {
            $recipients[] = $contact->email;
        }

        Mail::send('emails.project_updated', ['changes' => $changed_values, 'project' => $project], function ($message) use ($project, $recipients) {
            $message->to($recipients)->subject($project->name ?? 'Project'.' updated');
        });
    }

    /**
     * Handle the Project "deleted" event.
     */
    public function deleted(Project $project): void
    {
        //
    }

    /**
     * Handle the Project "restored" event.
     */
    public function restored(Project $project): void
    {
        //
    }

    /**
     * Handle the Project "force deleted" event.
     */
    public function forceDeleted(Project $project): void
    {
        //
    }
}
