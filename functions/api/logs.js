export async function onRequest(context) {
    const { request, env } = context;
    const db = env.DB;

    if (request.method === "GET") {
        const { results } = await db
            .prepare("SELECT * FROM work_logs ORDER BY id DESC")
            .all();
        return new Response(JSON.stringify(results), {
            headers: { "Content-Type": "application/json" }
        });
    }

    if (request.method === "POST") {
        const body = await request.json();

        await db.prepare(`
            INSERT INTO work_logs
            (date, contact, company, method, content, follow, remark)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
            body.date,
            body.contact,
            body.company,
            body.method,
            body.content,
            body.follow,
            body.remark
        ).run();

        return new Response("OK");
    }

    return new Response("Method Not Allowed", { status: 405 });
}
