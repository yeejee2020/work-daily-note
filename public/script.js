document.getElementById("date").value =
    new Date().toISOString().split("T")[0];

async function loadRecords() {
    const res = await fetch("/api/logs");
    const data = await res.json();

    const container = document.getElementById("records");
    container.innerHTML = "";

    data.forEach(r => {
        const div = document.createElement("div");
        div.className = "record";
        div.innerHTML = `
            <strong>日期：</strong>${r.date}<br>
            <strong>对接人：</strong>${r.contact}<br>
            <strong>公司：</strong>${r.company || ""}<br>
            <strong>方式：</strong>${r.method}<br>
            <strong>内容：</strong>${r.content || ""}<br>
            <strong>后续：</strong>${r.follow || ""}<br>
            <strong>备注：</strong>${r.remark || ""}
        `;
        container.appendChild(div);
    });
}

loadRecords();

document.getElementById("workForm").addEventListener("submit", async e => {
    e.preventDefault();

    const payload = {
        date: date.value,
        contact: contact.value,
        company: company.value,
        method: method.value,
        content: content.value,
        follow: follow.value,
        remark: remark.value
    };

    await fetch("/api/logs", {
        method: "POST",
        body: JSON.stringify(payload)
    });

    e.target.reset();
    date.value = new Date().toISOString().split("T")[0];
    loadRecords();
});
