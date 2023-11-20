<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Projects {{ $title ? '- ' . $title : '' }}</title>

    @viteReactRefresh
    @vite(['resources/ts/app.ts'])
</head>

<body style="background: #0f131a">
    @yield('content')
</body>

</html>
