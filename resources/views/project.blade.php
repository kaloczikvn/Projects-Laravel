@extends('layouts.base')

@php
    $title = $project->name;
@endphp

@section('content')
    <div class="react-page-project" data-cast-json-project='@json($project)'></div>
@endsection
