export default async function handler(req, res) {

    req.body = JSON.parse(req.body)
    if (req.method === 'POST') {
        var root = req.body.root
        var method = req.body.method
        var body = req.body.body
        if (method === "POST") {
            var rese = await fetch(root, {
                method: "POST",
                body: JSON.stringify(body),
            })
        } else {
            var rese = await fetch(root)
        }
        var my_resp = await rese.json()
        res.status(rese.status).json(my_resp)
    } else {
        res.status(400).json({ result: 'only post allowed' })

    }

}
