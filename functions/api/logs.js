export async function onRequest(context) {
    const { request, env } = context;
    const db = env.DB;
    const url = new URL(request.url);

    if (request.method === "GET") {
        const date = url.searchParams.get("date");
        const contact = url.searchParams.get("contact");

        let sql = "SELECT * FROM work_logs WHERE 1=1";
        const params = [];

        if (date) {
            sql += " AND date = ?";
            params.push(date);
        }

        if (contact) {
            sql += " AND contact LIKE ?";
            params.push(`%${contact}%`);
        }

        sql += " ORDER BY id DESC";

        const { results } = await db
            .prepare(sql)
            .bind(...params)
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
