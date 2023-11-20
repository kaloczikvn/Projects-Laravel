<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    const STATUS_WAITING_FOR_DEVELOPMENT = 0; // Fejlesztésre vár

    const STATUS_IN_PROGRESS = 1; // Folyamatban

    const STATUS_DONE = 2; // Kész

    protected $table = 'projects';

    protected $primaryKey = 'id';

    protected $guarded = ['id'];

    protected $fillable = [
        'name',
        'description',
        'status',
    ];

    protected $hidden = [];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }
}
