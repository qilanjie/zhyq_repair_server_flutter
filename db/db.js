const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sha1 = require("sha1");
const rand = require("csprng");

const UserSchema = new Schema(
  {
    userName: String,
    userPassword: String,
    salt: String, // 使用csprng随机生成的盐
    role: String,
    name: String,
    department: String,
    mobile: String,
    createdAt: Date,
    updateAt: Date,
  },
  { versionKey: false }
);
const RoleSchema = new Schema(
  {
    role: String,
    permissions: [String],
  },
  { versionKey: false }
);
const RepairOrderSchema = new Schema(
  {
    return_unit: String,
    billing_unit: String,
    unit_address: String,
    unit_person: String,
    unit_phone: String,
    return_person: String,
    equipment_type: String,
    equipment_number: String,
    sale_date: Date,
    acceptance_date: Date,
    acceptance_person: String,
    acceptance_situation: String,
    with_accessories: String,
    fault_situation: String,
    overhaul_details: String,
    total_repair_costs: String,
    charge_requirements: String,
    remark: String,
    Repair_personnel: String,
    submit_test_date: Date,
    inspectors: String,
    warehousing_date: Date,
    delivery_date: Date,
    payback_date: Date,
    all_complete: false,
    current_state: String,
    // 图片的数组
    picsc: [String],
    piczj: [String]
  }
);


const Models = {
  User: mongoose.model("User", UserSchema),
  Role: mongoose.model("Role", RoleSchema),
  RepairOrder: mongoose.model("RepairOrder", RepairOrderSchema),
  //  Article: mongoose.model("Article", ArticleSchema),
  //  Comment: mongoose.model("Comment", CommentSchema),
};

// 初始化数据
const initialize = () => {
  console.log("beginning to initialize data...");
  Models.User.find({}, (err, doc) => {
    if (err) {
      console.log(err);
      console.log("initialize user failed");
    } else if (!doc.length) {
      const salt = rand(160, 36);
      // 第一次创建站长账户
      new Models["User"]({
        userName: "admin",
        userPassword: sha1("buzhidao" + salt),
        salt: salt,
        role: "管理员",
        name: "",
        department: "",
        mobile: "",
        createdAt: Date(),
        updateAt: Date(),
      }).save();
      console.log("initialize user successfully");
      // Promise.all(
      //   data.map((item) => {
      //     new Models["Article"](item).save();
      //   })
      // )
      //   .then(() => {
      //     console.log("initialize successfully");
      //   })
      //   .catch(() => {
      //     console.log("initialize failed");
      //   });
    } else {
      console.log("initialize user successfully");
    }
  });
  Models.Role.find({}, (err, doc) => {
    if (err) {
      console.log(err);
      console.log("initialize role failed");
    } else if (!doc.length) {
      // 第一次创建角色权限
      new Models["Role"]({
        role: "管理员",
        permissions: ["角色管理", "权限管理", "维修单删除"],
      }).save();
      new Models["Role"]({
        role: "销售员",
        permissions: ["新建维修单", "仪器信息编辑", "发货中信息编辑", "回款中信息编辑", "已完成信息编辑"],
      }).save();
      new Models["Role"]({
        role: "生产员",
        permissions: ["新建维修单", "维修中信息编辑"],
      }).save();
      new Models["Role"]({
        role: "质检员",
        permissions: ["质检中信息编辑"],
      }).save();
      console.log("initialize role successfully");
    } else {
      console.log("initialize role successfully");
    }
  });
};

 mongoose.connect("mongodb://192.168.129.100/zhyq-repair");
//mongoose.connect("mongodb://127.0.0.1/zhyq-repair");
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Database connection error."));
db.once("open", () => {
  console.log("The database has connected.");
  initialize();
});

module.exports = Models;
