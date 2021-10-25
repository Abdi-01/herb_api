const { db } = require('../database')
const { uploader } = require('../helper/uploader')
const fs = require('fs')

module.exports = {
    getData: (req, res) => {
        let scriptQuery = 'select * from users;'
        db.query(scriptQuery, (err, result)=>{
            if(err) res.status(500).send(err)
            res.status(200).send(result)
        })
    },
    getDataById: (req, res) => {
        scriptQuery = `select * from users where id = ${req.params.id};`
        db.query(scriptQuery, (err, results) => {
            if (err) res.status(500).send(err)
            res.status(200).send(results)   
        })
    },
    editData: (req, res) => {
        try {
            let path = '/images/users'
            const upload = uploader(path, 'IMG').fields([{ name: 'img_profile' }])

            upload(req, res, (error) => {
                if (error) {
                    res.status(500).send(error)
                }
                if (req.files) {
                const { img_profile } = req.files
                const filepath = img_profile ? path + '/' + img_profile[0].filename : null

                let data = JSON.parse(req.body.data)
                data.img_profile = filepath

                let dataUpdate = [];

                for (let prop in data){
                    dataUpdate.push(`${prop} = ${db.escape(data[prop])}`);
                }

                let updateDataQuery = `UPDATE users SET ${dataUpdate} WHERE id = ${req.params.id};`;

                db.query(updateDataQuery, (err, results) => {
                    if (err) {
                        res.status(500).send(err);
                        fs.unlinkSync("./public" + filepath);
                    }
                    res
                        .status(200)
                        .send({message: 'User Update successfully'})
                });
                } else if (!req.files) {
                    let data = req.body;
                    let dataUpdate = [];

                    for (let prop in data){
                        dataUpdate.push(`${prop} = ${db.escape(data[prop])}`);
                    }
    
                    let updateDataQuery = `UPDATE users SET ${dataUpdate} WHERE id = ${req.params.id};`;

                    db.query(updateDataQuery, (err, results) => {
                        if (err) {
                            fs.unlinkSync("./public" + filepath);
                            res.status(500).send(err);
                        }
                        res.status(200).send({ message: "Upload file success" });
                    });
                }
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}