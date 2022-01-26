const express = require("express");
const router = express.Router();
const db = require("../db/db.js");
const confirmToken = require("../middlewares/confirmToken");
const rand = require("csprng");
const sha1 = require("sha1");
const jwt = require("jsonwebtoken");

router.post("/api/private/v1/add", confirmToken, (req, res) => {
  console.log(req.body);
  const token = req.headers.authorization;
  console.log(jwt.decode(token));
  const userInfo = jwt.decode(token);
  db.Role.findOne({ role: userInfo.role }, (err, doc) => {
    if (err) {
      console.log(err);
    } else if (doc) {
      const permissions = doc.permissions;
      console.log(doc);
      if (permissions.indexOf("新建维修单") > -1) {
        new db.RepairOrder(req.body).save(function (error, doc) {
          if (error) {
            console.log("error :" + error);
            res.sendResult(null, 401, "添加仪器失败！");
          } else {
            // console.log(doc);
            res.sendResult(doc, 201, "添加仪器成功！");
          }
        });
      } else {
        res.sendResult(null, 401, "你没有此项提交权限！");
      }
    } else {
      res.sendResult(null, 401, "你没任何权限！");
    }
  });
});
router.put("/api/private/v1/edit", confirmToken, (req, res) => {
  const { id, subInfo, editForm } = req.body;
  const token = req.headers.authorization;
  console.log(jwt.decode(token));
  const userInfo = jwt.decode(token);
  db.Role.findOne({ role: userInfo.role }, (err, doc) => {
    if (err) {
      console.log(err);
    } else if (doc) {
      const permissions = doc.permissions;
      console.log(doc);
      const temp = {};
      temp.current_state = editForm.current_state;
      console.log(editForm.picsc);
      temp.picsc = editForm.picsc;
      temp.piczj = editForm.piczj;
      if (permissions.indexOf(subInfo) > -1) {
        switch (subInfo) {
          case "仪器信息编辑":
            temp.return_unit = editForm.return_unit;
            temp.billing_unit = editForm.billing_unit;
            temp.unit_address = editForm.unit_address;
            temp.unit_person = editForm.unit_person;
            temp.unit_phone = editForm.unit_phone;
            temp.return_person = editForm.return_person;
            temp.equipment_type = editForm.equipment_type;
            temp.equipment_number = editForm.equipment_number;
            temp.sale_date = editForm.sale_date;
            temp.acceptance_date = editForm.acceptance_date;
            temp.acceptance_person = editForm.acceptance_person;
            temp.acceptance_situation = editForm.acceptance_situation;
            temp.with_accessories = editForm.with_accessories;

            break;
          case "维修中信息编辑":
            temp.return_unit = editForm.return_unit;
            temp.billing_unit = editForm.billing_unit;
            temp.unit_address = editForm.unit_address;
            temp.unit_person = editForm.unit_person;
            temp.unit_phone = editForm.unit_phone;
            temp.return_person = editForm.return_person;
            temp.equipment_type = editForm.equipment_type;
            temp.equipment_number = editForm.equipment_number;
            temp.sale_date = editForm.sale_date;
            temp.acceptance_date = editForm.acceptance_date;
            temp.acceptance_person = editForm.acceptance_person;
            temp.acceptance_situation = editForm.acceptance_situation;
            temp.with_accessories = editForm.with_accessories;

            temp.fault_situation = editForm.fault_situation;
            temp.overhaul_details = editForm.overhaul_details;
            temp.total_repair_costs = editForm.total_repair_costs;
            temp.charge_requirements = editForm.charge_requirements;
            temp.remark = editForm.remark;
            temp.Repair_personnel = editForm.Repair_personnel;
            temp.submit_test_date = editForm.submit_test_date;
            break;
          case "质检中信息编辑":
            temp.inspectors = editForm.inspectors;
            temp.warehousing_date = editForm.warehousing_date;
            break;
          case "发货中信息编辑":
            break;
          case "回款中信息编辑":
            break;
          case "已完成信息编辑":
            temp.delivery_date = editForm.delivery_date;
            temp.invoice_date = editForm.tinvoice_date;
            temp.payback_date = editForm.payback_date;
            temp.all_complete = editForm.all_complete;
            break;
        }

        db.RepairOrder.updateOne({ _id: id }, { $set: temp }, (error, doc) => {
          if (error) {
            console.log("error :" + error);
            res.sendResult(null, 401, "更新仪器失败！");
          } else {
            res.sendResult(doc, 201, "更新仪器成功！");
          }
        });
      } else {
        res.sendResult(null, 401, "你没有此项提交权限！");
      }
    } else {
      res.sendResult(null, 401, "你没任何权限！");
    }
  });
});
router.post("/api/private/v1/equipments", confirmToken, async (req, res) => {
  console.log(req.body);
  const {
    search_key,
    search_date,
    search_content,
    pagenum,
    pagesize,
  } = req.body;

  let _requirement = {};
  let _total;
  if (search_key.indexOf("_date") > 0) {
    _requirement = {
      $and: [
        {
          [search_key]: {
            $gte: new Date(search_date[0]),
          },
        },
        {
          [search_key]: {
            $lt: new Date(search_date[1]),
          },
        },
      ],
    };
  } else {
    if (search_key) {
      if(search_content){
        const reg=RegExp([search_content])
        _requirement = { [search_key]: {$regex:reg} };
      }else{
        _requirement={}
      }
      
    } else {
      _requirement={}
    }

      console.log(_requirement)
  }
  _total = await db.RepairOrder.find(_requirement).count();
  db.RepairOrder.find(_requirement, (err, doc) => {
    if (err) {
      console.log(err);
    } else if (doc) {
      const page = {
        total: _total,
        doc: doc,
      };

      res.sendResult(page, 200, "查询仪器成功！");
    }
  })
    .skip((pagenum - 1) * pagesize)
    .limit(pagesize);
});
router.delete("/api/private/v1/equipment", confirmToken, (req, res) => {
  const token = req.headers.authorization;
  console.log(jwt.decode(token));
  const userInfo = jwt.decode(token);
  db.Role.findOne({ role: userInfo.role }, (err, doc) => {
    if (err) {
      console.log(err);
    } else if (doc) {
      const permissions = doc.permissions;
      console.log(doc);
      if (permissions.indexOf("维修单删除") > -1) {
        const { id } = req.query;
        db.RepairOrder.deleteOne({ _id: id })
          .then(function () {
            console.log("Data deleted"); // Success
            res.sendResult(null, 200, "删除仪器成功！");
          })
          .catch(function (error) {
            console.log(error); // Failure
            res.sendResult(null, 401, "删除仪器失败！");
          });
      } else {
        res.sendResult(null, 401, "你没删除设备权限！");
      }
    } else {
      res.sendResult(null, 401, "你没任何权限！");
    }
  });
});
module.exports = router;
