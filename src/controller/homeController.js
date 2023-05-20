import pool from "../configs/connectDB";
let getHomePage = async (req, res) => {
    //logic
    const [row, fields] = await pool.execute('SELECT * FROM users');
    return res.render('index.ejs', { dataUser: row });
    console.log('>>> Check row', row);
};
let getDetailPage = async (req, res) => {
    let userId = req.params.userId;
    let user = await pool.execute('SELECT * FROM `users` WHERE `id` = ?', [userId]);
    console.log(">>> Check params: ", user);
    return res.send(JSON.stringify(user[0]));
}
let createNewUser = async (req, res) => {
    console.log(">>> Check: ", req.body);
    let nameUser = req.body.name;
    let emailUser = req.body.email;
    let createdAt = req.body.created_at;
    await pool.execute('INSERT INTO users(name, email, created_at) values (?,?,?)', [nameUser, emailUser, createdAt]);
    return res.send("Call post new user");
}
let deleteUser = async (req, res) => {
    //let userId = req.params.userId;
    await pool.execute('DELETE FROM users WHERE `id` = ?', [req.body.userId]);
    return res.send(`Call delete user ${req.body.userId}`);
}
let editUser = async (req, res) => {
    let userId = req.params.userId;
    let [user] = await pool.execute('SELECT * FROM `users` WHERE `id` = ?', [userId]);
    return res.render('update.ejs', { dataUser: user[0] });
}
let updateUser = async (req, res) => {
    let nameUser = req.body.name;
    let emailUser = req.body.email;
    let createdAt = req.body.created_at;
    let id = req.body.id;
    await pool.execute(`UPDATE users SET name=?, email=?, created_at=? WHERE id=?`, [nameUser, emailUser, createdAt, id]);
    return res.send('Call update user');
}
module.exports = {
    getHomePage, getDetailPage, createNewUser, deleteUser, editUser, updateUser
}