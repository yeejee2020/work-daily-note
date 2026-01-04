export async function checkAuth(requiredRole = null) {
    const res = await fetch("/api/me");
    if (res.status !== 200) {
        location.href = "/login.html";
        return;
    }
    const user = await res.json();

    if (requiredRole && user.role !== requiredRole) {
        alert("无权限访问");
        location.href = "/index.html";
    }

    return user;
}
