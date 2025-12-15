@extends('layouts.admin')

@section('title', 'Usuarios del Sistema')

@section('content')
    <div id="users-admin"></div>
@endsection

@section('scripts')
    @vite('resources/js/Admin/Users.jsx')
    <script>
        $(function() {
            ReactAppend('users-admin', 'Users');
        });
    </script>
@endsection
