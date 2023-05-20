import pool from "../configs/connectDB";

const CryptoJS = require('crypto-js');
const crypto = require('crypto');

let getAllProducts = async (req, res) => {
    const [products, fields] = await pool.execute('SELECT * FROM product');
    return res.status(200).json({
        message: 'success',
        data: products
    })
}

let getAllUsers = async (req, res) => {
    const [row, fields] = await pool.execute('SELECT * FROM users');
    return res.status(200).json({
        message: 'ok',
        data: row
    })
};

// let createNewUser = async (req, res) => {
//     let { avatar, userName, password, email, phone, address, date_create, type } = req.body;
//     if (!userName || !password || !email || !phone || !type || !date_create) {
//         return res.status(404).json({
//             message: 'failureee'
//         })
//     }
//     await pool.execute('INSERT INTO users(avatar, username, password, email, phone, address, date_create, type) values (?,?,?,?,?,?,?,?)',
//         [avatar, userName, password, email, phone, address, date_create, type]);
//     return res.status(200).json({
//         message: 'ok'
//     });
// };

//createNewUser aes
let createNewUser = async (req, res) => {
    let { avatar, userName, password, email, phone, address, date_create, type } = req.body;
    if (!userName || !password || !email || !phone || !type || !date_create) {
        return res.status(404).json({
            message: 'failureee'
        })
    }

    // Tạo khóa từ password và salt
    const salt = 'this_is_a_fixed_string';
    const iv = Buffer.alloc(16); // Khởi tạo vector khởi tạo với giá trị 0

    const key = crypto.pbkdf2Sync('password', salt, 10000, 256 / 8, 'sha256');

    // Mã hóa password bằng AES
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedPassword = cipher.update(password, 'utf8', 'hex');
    encryptedPassword += cipher.final('hex');

    // Lưu password đã được mã hóa vào cơ sở dữ liệu
    await pool.execute('INSERT INTO users(avatar, username, password, email, phone, address, date_create, type) values (?,?,?,?,?,?,?,?)',
        [avatar, userName, encryptedPassword, email, phone, address, date_create, type]);

    return res.status(200).json({
        message: 'ok'
    });
};

// let userLogin = async (req, res) => {
//     let { userName, password } = req.body;
//     if (!userName || !password) {
//         return res.status(404).json({
//             message: 'failure'
//         })
//     }
//     const [row, fields] = await pool.execute('SELECT * FROM users WHERE username=? AND password=?', [userName, password]);
//     if (row.length > 0) {
//         return res.status(200).json({
//             message: 'ok',
//             data: row
//         })
//     } else {
//         return res.status(200).json({
//             message: 'not_account',
//             data: row
//         })
//     }
// };
//login descrypt aes
let userLogin = async (req, res) => {

    let { userName, password } = req.body;
    if (!userName || !password) {
        return res.status(404).json({
            message: 'failure'
        })
    }

    // Tạo khóa từ password và salt
    const salt = 'this_is_a_fixed_string';


    // Mã hóa password bằng AES

    const iv = Buffer.alloc(16);
    const key = crypto.pbkdf2Sync(password, salt, 10000, 256 / 8, 'sha256');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedPasswordd = cipher.update(password, 'utf8', 'hex');
    encryptedPasswordd += cipher.final('hex');

    const [row, fields] = await pool.execute('SELECT * FROM users WHERE username=? AND password=?', [userName, encryptedPasswordd]);
    if (row.length > 0) {
        return res.status(200).json({
            message: 'ok',
            data: row
        })
    } else {
        return res.status(200).json({
            message: 'not_account',
            data: row
        })
    }
}


let getDataUser = async (req, res) => {
    let { idUser } = req.body;
    if (!idUser) {
        return res.status(404).json({
            message: 'failure'
        })
    } else {
        const [row, fields] = await pool.execute('SELECT * FROM users WHERE id_user=?', [idUser])
        return res.status(200).json({
            message: 'ok',
            data: row
        })
    }
}
let updateInforUser = async (req, res) => {
    let { idUser, userName, email, phone, address } = req.body;
    if (!idUser || !userName || !email || !phone || !address) {
        return res.status(404).json({
            message: 'failure'
        })
    } else {
        const [row, fields] = await pool.execute('UPDATE users SET username=?, email=?, phone=?, address=? WHERE id_user=?',
            [userName, email, phone, address, idUser])
        return res.status(200).json({
            message: 'ok'
        })
    }
}
let updatePassword = async (req, res) => {
    let { idUser, password, passNew } = req.body;
    if (!idUser || !password) {
        return res.status(404).json({
            message: 'failure'
        })
    } else {
        const [row, fields] = await pool.execute('SELECT * FROM users WHERE id_user=? AND password=?', [idUser, password])
        if (row.length > 0) {
            await pool.execute('UPDATE users SET password=? WHERE id_user=?', [passNew, idUser])
            return res.status(200).json({
                message: "ok"
            })
        } else {
            return res.status(200).json({
                message: "not_pass"
            })
        }
    }
}


let updateUser = async (req, res) => {
    let { nameUser, emailUser, createdAt, id } = req.body;
    if (!nameUser || !emailUser || !createdAt || !id) {
        return res.status(404).json({
            message: 'missing required params'
        })
    }
    await pool.execute(`UPDATE users SET name=?, email=?, created_at=? WHERE id=?`, [nameUser, emailUser, createdAt, id]);
    return res.status(200).json({
        message: 'ok'
    });
};
let deleteUser = async (req, res) => {
    let { id } = req.body;
    if (!id) {
        return res.status(404).json({
            message: 'missing required params'
        })
    }
    await pool.execute('DELETE FROM users WHERE `id` = ?', [id]);
    return res.status(200).json({
        message: 'ok'
    });
};
let insertCart = async (req, res) => {
    let { nameProduct, imageProduct, price, countProduct, idUser, idProduct } = req.body;
    if (!nameProduct || !imageProduct || !price || !countProduct || !idUser || !idProduct) {
        return res.status(404).json({
            message: 'missing'
        })
    } else {
        const [row, fields] = await pool.execute('SELECT * FROM cart WHERE id_user=? AND id_product=?', [idUser, idProduct]);
        if (row.length > 0) {
            return res.status(200).json({
                message: 'added'
            })
        } else {
            await pool.execute('INSERT INTO cart(name_product, image, price, count_product, id_user, id_product) values (?,?,?,?,?,?)', [nameProduct,
                imageProduct, price, countProduct, idUser, idProduct])
            return res.status(200).json({
                message: 'ok'
            })
        }
    }
};
let updateCart = async (req, res) => {
    let { idUser, idProduct, price, countProduct } = req.body;
    if (!idUser || !idProduct || !price || !countProduct) {
        return res.status(404).json({
            message: 'missing'
        })
    } else {
        await pool.execute('UPDATE cart SET price=?, count_product=? WHERE id_user=? AND id_product=?', [price, countProduct, idUser, idProduct])
        return res.status(200).json({
            message: 'ok'
        })
    }
}
let deleteItemCart = async (req, res) => {
    let { idUser, idProduct } = req.body;
    if (!idUser || !idProduct) {
        return res.status(404).json({
            message: "missing"
        })
    } else {
        await pool.execute('DELETE FROM cart WHERE id_user=? AND id_product=?', [idUser, idProduct])
        return res.status(200).json({
            message: 'ok'
        })
    }
}
let insertFavoriteProduct = async (req, res) => {
    let { nameProduct, imageProduct, price, idUser, idProduct } = req.body;
    if (!nameProduct || !imageProduct || !price || !idUser || !idProduct) {
        return res.status(404).json({
            message: 'missing'
        })
    } else {
        await pool.execute('INSERT INTO product_favorite(name_product, image, price, id_user, id_product) values (?,?,?,?,?)',
            [nameProduct, imageProduct, price, idUser, idProduct]);
        return res.status(200).json({
            message: 'ok'
        });
    }
};
let getDataCart = async (req, res) => {
    let { idUser } = req.body;
    if (!idUser) {
        return res.status(404).json({
            message: 'failure'
        })
    }
    const [row, fields] = await pool.execute('SELECT * FROM cart WHERE id_user=?', [idUser]);
    if (row.length > 0) {
        return res.status(200).json({
            message: 'ok',
            data: row
        })
    } else {
        return res.status(200).json({
            message: 'not_cart',
            data: row
        })
    }
}
let getDataFavorite = async (req, res) => {
    let { idUser } = req.body;
    if (!idUser) {
        return res.status(404).json({
            message: 'failure'
        })
    }
    const [row, fields] = await pool.execute('SELECT * FROM product_favorite WHERE id_user=?', [idUser]);
    if (row.length > 0) {
        return res.status(200).json({
            message: 'ok',
            data: row
        })
    } else {
        return res.status(200).json({
            message: 'not_data',
            data: row
        })
    }
}
let getDataProductFromId = async (req, res) => {
    let { idPro } = req.body;
    if (!idPro) {
        return res.status(404).json({
            message: 'failure'
        })
    } else {
        const [row, fields] = await pool.execute('SELECT * FROM product WHERE id=?', [idPro]);
        return res.status(200).json({
            message: 'ok',
            data: row
        })
    }
}
let getDataSearch = async (req, res) => {
    let { typeProduct, brandProduct, price } = req.body;
    if (!typeProduct || !brandProduct || !price) {
        return res.status(404).json({
            message: 'failure'
        })
    } else {
        if (price == "option1") {
            const [row, fields] = await pool.execute('SELECT * FROM `product` WHERE price < 1000000 AND product_code=? AND brand_code=?',
                [typeProduct, brandProduct]);
            return res.status(200).json({
                message: 'ok',
                data: row
            })
        } else if (price == "option2") {
            const [row, fields] = await pool.execute('SELECT * FROM `product` WHERE price >= 1000000 AND price < 5000000 AND product_code=? AND brand_code=?',
                [typeProduct, brandProduct]);
            return res.status(200).json({
                message: 'ok',
                data: row
            })
        } else if (price == "option3") {
            const [row, fields] = await pool.execute('SELECT * FROM `product` WHERE price >= 5000000 AND price < 10000000 AND product_code=? AND brand_code=?',
                [typeProduct, brandProduct]);
            return res.status(200).json({
                message: 'ok',
                data: row
            })
        } else if (price == "option4") {
            const [row, fields] = await pool.execute('SELECT * FROM `product` WHERE price >= 10000000 AND price < 20000000 AND product_code=? AND brand_code=?',
                [typeProduct, brandProduct]);
            return res.status(200).json({
                message: 'ok',
                data: row
            })
        } else if (price == "option5") {
            const [row, fields] = await pool.execute('SELECT * FROM `product` WHERE price >= 20000000 AND product_code=? AND brand_code=?',
                [typeProduct, brandProduct]);
            return res.status(200).json({
                message: 'ok',
                data: row
            })
        }
    }
}
let addComments = async (req, res) => {
    let { idUser, idProduct, comment, time_comment, username, avatar } = req.body
    await pool.execute('INSERT INTO comments(id_user, id_product, comment, time_comment, user_name, avatar) values (?,?,?,?,?,?)',
        [idUser, idProduct, comment, time_comment, username, avatar]);
    return res.status(200).json({
        message: 'ok'
    });
}
let getDataComments = async (req, res) => {
    let { idProduct } = req.body
    const [row, fields] = await pool.execute('SELECT * FROM `comments` WHERE id_product=?', [idProduct]);
    return res.status(200).json({
        message: 'ok',
        data: row
    })
}
let addDetailOrder = async (req, res) => {
    let { nameUser, emailUser, phoneUser, detail, price, address, date_create, status } = req.body

    // Tạo khóa từ password và salt
    const salt = 'this_is_a_fixed_string';
    const passKey = "password"
    const iv = Buffer.alloc(16); // Khởi tạo vector khởi tạo với giá trị 0
    const key = crypto.pbkdf2Sync(passKey, salt, 10000, 256 / 8, 'sha256');

    // Mã hóa email và phone bằng AES
    const cipher1 = crypto.createCipheriv('aes-256-cbc', key, iv);
    const cipher2 = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedEmail = cipher1.update(emailUser, 'utf8', 'hex');
    encryptedEmail += cipher1.final('hex');
    let encryptedPhone = cipher2.update(phoneUser, 'utf8', 'hex');
    encryptedPhone += cipher2.final('hex');

    const [row, fields] = await pool.execute('INSERT INTO detail_order(name_user, email, phone_user, detail, price, address, date_create, status) values (?,?,?,?,?,?,?,?)',
        [nameUser, encryptedEmail, encryptedPhone, detail, price, address, date_create, status]);
    return res.status(200).json({
        message: 'ok'
    })
}
let addDetailOrderZalo = async (req, res) => {
    let { nameUser, emailUser, phoneUser, detail, price, address, date_create, status } = req.body

    // Tạo khóa từ password và salt
    const salt = 'this_is_a_fixed_string';
    const passKey = "password"
    const iv = Buffer.alloc(16); // Khởi tạo vector khởi tạo với giá trị 0
    const key = crypto.pbkdf2Sync(passKey, salt, 10000, 256 / 8, 'sha256');

    // Mã hóa email và phone bằng AES
    const cipher1 = crypto.createCipheriv('aes-256-cbc', key, iv);
    const cipher2 = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedEmail = cipher1.update(emailUser, 'utf8', 'hex');
    encryptedEmail += cipher1.final('hex');
    let encryptedPhone = cipher2.update(phoneUser, 'utf8', 'hex');
    encryptedPhone += cipher2.final('hex');

    const [row, fields] = await pool.execute('INSERT INTO detail_order(name_user, email, phone_user, detail, price, address, date_create, status) values (?,?,?,?,?,?,?,?)',
        [nameUser, encryptedEmail, encryptedPhone, detail, price, address, date_create, status]);
    return res.status(200).json({
        message: 'ok'
    })
}
let updateTokenZaloPay = async (req, res) => {
    let { idOrder, token } = req.body;
    if (!idOrder || !token) {
        return res.status(404).json({
            message: 'missing'
        })
    } else {
        await pool.execute('UPDATE detail_order SET token_zalo_pay=? WHERE id=?', [token, idOrder])
        return res.status(200).json({
            message: 'ok'
        })
    }
}
let getFromProductCode = async (req, res) => {
    let { productCode } = req.body
    const [row, fields] = await pool.execute("SELECT * FROM `product` WHERE product_code=?", [productCode]);
    return res.status(200).json({
        message: 'ok',
        data: row
    })
}
let getAllUsersAdmin = async (req, res) => {
    const salt = 'this_is_a_fixed_string';
    const iv = Buffer.alloc(16); // Khởi tạo vector khởi tạo với giá trị 0
    const [rows, fields] = await pool.execute('SELECT * FROM users');

    // Giải mã các phần tử được mã hóa


    rows.forEach(row => {
        const key = crypto.pbkdf2Sync('hieu123', salt, 10000, 256 / 8, 'sha256');
        const decipherPass = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decryptedPass = decipherPass.update(row.password, 'hex', 'utf8');
        decryptedPass += decipherPass.final('utf8');
        row.password = decryptedPass;
    });

    // Trả về mảng các phần tử đã được giải mã
    return res.status(200).json({
        message: 'ok',
        data: rows
    });
}
let getOneUserFromId = async (req, res) => {
    let { idUser } = req.body
    if (!idUser) {
        return res.status(404).json({
            message: 'failuree'
        })
    }
    else {
        const salt = 'this_is_a_fixed_string';
        const iv = Buffer.alloc(16); // Khởi tạo vector khởi tạo với giá trị 0
        const [rows, fields] = await pool.execute('SELECT * FROM `users` WHERE id_user=?', [idUser]);
        // Giải mã các phần tử được mã hóa
        rows.forEach(row => {
            const key = crypto.pbkdf2Sync('hieu123', salt, 10000, 256 / 8, 'sha256');
            const decipherPass = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decryptedPass = decipherPass.update(row.password, 'hex', 'utf8');
            decryptedPass += decipherPass.final('utf8');
            row.password = decryptedPass;
        });
        return res.status(200).json({
            data: rows
        })
    }
}
let deleteAccountByAdmin = async (req, res) => {
    let { idUser } = req.body;
    if (!idUser) {
        return res.status(404).json({
            message: "missing"
        })
    } else {
        await pool.execute('DELETE FROM users WHERE id_user=?', [idUser])
        return res.status(200).json({
            message: 'ok'
        })
    }
}

let getAllProductAdmin = async (req, res) => {
    const [row, fields] = await pool.execute('SELECT * FROM product');
    return res.status(200).json({
        data: row
    })
}

let getOneProductFromId = async (req, res) => {
    let { idProduct } = req.body
    if (!idProduct) {
        return res.status(404).json({
            message: 'failuree'
        })
    }
    else {
        const [row, fields] = await pool.execute('SELECT * FROM `product` WHERE id=?', [idProduct]);
        return res.status(200).json({
            data: row
        })
    }
}

let deleteProductByAdmin = async (req, res) => {
    let { idPro } = req.body;
    if (!idPro) {
        return res.status(404).json({
            message: "missing"
        })
    } else {
        await pool.execute('DELETE FROM product WHERE id=?', [idPro])
        return res.status(200).json({
            message: 'ok'
        })
    }
}

let getAllOrder = async (req, res) => {

    const salt = 'this_is_a_fixed_string';
    const iv = Buffer.alloc(16); // Khởi tạo vector khởi tạo với giá trị 0

    const [rows, fields] = await pool.execute('SELECT * FROM detail_order ORDER BY id DESC');

    // Giải mã các phần tử được mã hóa
    rows.forEach(row => {
        const key = crypto.pbkdf2Sync('password', salt, 10000, 256 / 8, 'sha256');

        const decipherEmail = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decryptedEmail = decipherEmail.update(row.email, 'hex', 'utf8');
        decryptedEmail += decipherEmail.final('utf8');
        row.email = decryptedEmail;

        const decipherPhone = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decryptedPhone = decipherPhone.update(row.phone_user, 'hex', 'utf8');
        decryptedPhone += decipherPhone.final('utf8');
        row.phone_user = decryptedPhone;
    });

    // Trả về mảng các phần tử đã được giải mã
    return res.status(200).json({
        message: 'ok',
        data: rows
    });
}

let getOneOrder = async (req, res) => {
    let { idOrder } = req.body
    if (!idOrder) {
        return res.status(404).json({
            message: 'failuree'
        })
    }
    else {
        const salt = 'this_is_a_fixed_string';
        const iv = Buffer.alloc(16); // Khởi tạo vector khởi tạo với giá trị 0
        const [rows, fields] = await pool.execute('SELECT * FROM `detail_order` WHERE id=?', [idOrder]);
        // Giải mã các phần tử được mã hóa
        rows.forEach(row => {
            const key = crypto.pbkdf2Sync('password', salt, 10000, 256 / 8, 'sha256');

            const decipherEmail = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decryptedEmail = decipherEmail.update(row.email, 'hex', 'utf8');
            decryptedEmail += decipherEmail.final('utf8');
            row.email = decryptedEmail;

            const decipherPhone = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decryptedPhone = decipherPhone.update(row.phone_user, 'hex', 'utf8');
            decryptedPhone += decipherPhone.final('utf8');
            row.phone_user = decryptedPhone;
        });

        return res.status(200).json({
            data: rows
        })
    }
}
let updateOrder = async (req, res) => {
    let { idOrder, status } = req.body;
    if (!idOrder || !status) {
        return res.status(404).json({
            message: 'missing'
        })
    } else {
        await pool.execute('UPDATE detail_order SET status=? WHERE id=?', [status, idOrder])
        return res.status(200).json({
            message: 'ok'
        })
    }
}

let getTopAccount = async (req, res) => {
    const [row, fields] = await pool.execute('SELECT * FROM `users` ORDER BY id_user DESC LIMIT 10')
    return res.status(200).json({
        data: row
    })
}

let getTopLatestOrder = async (req, res) => {
    const [row, fields] = await pool.execute('SELECT * FROM `detail_order` ORDER BY id DESC LIMIT 10')
    return res.status(200).json({
        data: row
    })
}

let getOrderStatistical = async (req, res) => {
    let { from, to } = req.body
    const [row, fields] = await pool.execute(`SELECT * FROM detail_order WHERE DATE_FORMAT(date_create, '%Y-%m-%d') >= ? and DATE_FORMAT(date_create, '%Y-%m-%d') <= ?`, [from, to])
    return res.status(200).json({
        data: row
    })
}

let getAccountStatistical = async (req, res) => {
    let { from, to } = req.body
    const [row, fields] = await pool.execute(`SELECT * FROM users WHERE DATE_FORMAT(date_create, '%Y-%m-%d') >= ? and DATE_FORMAT(date_create, '%Y-%m-%d') <= ?`, [from, to])
    return res.status(200).json({
        data: row
    })
}

let getAvatarFromId = async (req, res) => {
    let { idUser } = req.body
    if (!idUser) {
        return res.status(404).json({
            message: "missing"
        })
    } else {
        const [row, fields] = await pool.execute('SELECT avatar FROM `users` WHERE id_user=?', [idUser])
        return res.status(200).json({
            data: row
        })
    }
}

let getAllPost = async (req, res) => {
    const [row, fields] = await pool.execute('SELECT * FROM `post`')
    return res.status(200).json({
        message: "ok",
        data: row
    })
}

let addPostFavorite = async (req, res) => {
    let { id_post, id_user, image, title, content, time } = req.body
    const [row, fields] = await pool.execute('INSERT INTO post_favorite(id_post, id_user, image, title, content, time) values (?,?,?,?,?,?)',
        [id_post, id_user, image, title, content, time]);
    return res.status(200).json({
        message: 'ok'
    })
}

let getListOrderFromName = async (req, res) => {
    let { name } = req.body
    const [row, fields] = await pool.execute('SELECT * FROM `detail_order` WHERE name_user=?', [name])
    return res.status(200).json({
        message: 'ok',
        data: row
    })
}

let getNewsFavoriteFromIdUser = async (req, res) => {
    let { idUser } = req.body
    const [row, fields] = await pool.execute('SELECT * FROM `post_favorite` WHERE id_user=?', [idUser])
    return res.status(200).json({
        message: 'ok',
        data: row
    })
}

module.exports = {
    getAllUsers, createNewUser, updateUser, deleteUser, getAllProducts, userLogin, insertCart, insertFavoriteProduct,
    getDataCart, getDataFavorite, getDataProductFromId, updateCart, deleteItemCart, getDataUser, updateInforUser, updatePassword, getDataSearch, addComments,
    getDataComments, addDetailOrder, getFromProductCode, getAllUsersAdmin, getOneUserFromId, deleteAccountByAdmin, getAllProductAdmin,
    getOneProductFromId, deleteProductByAdmin, getAllOrder, getOneOrder, updateOrder, getTopAccount, getTopLatestOrder, getOrderStatistical,
    getAccountStatistical, getAvatarFromId, getAllPost, addPostFavorite, getListOrderFromName, getNewsFavoriteFromIdUser, addDetailOrderZalo,
    updateTokenZaloPay
}