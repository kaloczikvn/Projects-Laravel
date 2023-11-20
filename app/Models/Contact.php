<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contact extends Model
{
    use HasFactory;

    protected $table = 'contacts';

    protected $primaryKey = 'id';

    protected $guarded = ['id'];

    protected $fillable = [
        'name',
        'email',
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

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
