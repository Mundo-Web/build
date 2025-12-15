@extends('layouts.admin')

@section('title', 'Clientes')

@section('content')
    <div id="clients-admin"></div>
@endsection

@section('scripts')
    @vite('resources/js/Admin/Clients.jsx')
    <script>
        $(function() {
            ReactAppend('clients-admin', 'Clients');
        });
    </script>
@endsection
