<h1>{{ $project->name }} frissítve lett</h1>
<ul>
    @foreach ($changes as $key => $value)
        <li><strong>{{ $key }}:</strong> {{ $value }}</li>
    @endforeach
</ul>
