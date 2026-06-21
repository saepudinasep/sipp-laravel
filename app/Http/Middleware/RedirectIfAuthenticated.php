<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user) {
            return redirect()->route($this->dashboardRouteFor($user->role));
        }

        return $next($request);
    }

    /**
     * Tentukan nama route dashboard berdasarkan role user.
     */
    protected function dashboardRouteFor(?string $role): string
    {
        return match ($role) {
            'admin' => 'admin.dashboard',
            'petugas' => 'petugas.dashboard',
            'siswa' => 'siswa.dashboard',
            default => 'login',
        };
    }
}
