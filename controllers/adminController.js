const { db } = require('../database')

module.exports = {
    getReportSales: (req, res) => {
        let scriptQuery = `select 
        DATE_FORMAT(t.transaction_date, "%e %M %Y") AS 'Date', 
        td.product_name, 
        td.quantity, 
        t.total_price 
        from transaction_details td 
        join transactions t 
        on t.transaction_id = td.transaction_id 
        where t.payment_status = "paid" && t.transaction_type = "normal"
        order by t.transaction_id;`
        db.query(scriptQuery, (err, result)=>{
            if(err) res.status(500).send(err)
            res.status(200).send(result)
        })
    },
    getRevenue: (req, res) => {
        let scriptQuery = `select
        sum(t.total_price) AS "Revenue"
        from transaction_details td
        join transactions t on t.transaction_id = td.transaction_id
        where t.payment_status = "paid" && t.transaction_type = "normal"
        order by t.transaction_id;`
        db.query(scriptQuery, (err, result)=>{
            if(err) res.status(500).send(err)
            res.status(200).send(result)
        })
    }
}