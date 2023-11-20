@extends('layouts.base')

@php
    $title = $project->name;
@endphp

@section('content')
    <div class="react-page-project-edit" data-cast-json-project='@json($project)'></div>
@endsection
