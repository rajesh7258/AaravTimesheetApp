module.exports = function(app) {
  var aarav = require("../controller/controller.js");
  let upload = require("../config/multer.config.js");
  app.post("/api/file/upload", upload.single("file"), aarav.uploadFile);
  // Create a new Customer
  app.post("/api/register", aarav.create);
  app.post("/api/createindices", aarav.createindex);
  app.post("/api/signin", aarav.signin);
  app.post("/api/getprofile", aarav.getuserprofile);
  app.post("/api/addtimesheetentry", aarav.addtimeentry);
  app.post("/api/addleaveentry", aarav.addleaveentry);
  app.post("/api/addnewprojectentry", aarav.addclinetproject);
  app.post("/api/addnewclinet", aarav.addclient);
  app.post("/api/getemployeesbymanager", aarav.getemployeesbymanager);
  app.post("/api/getmanagerprojects", aarav.getprojectsformanager);
  app.post("/api/gettimesheetentry", aarav.gettimesheet);
  app.post("/api/saveskills", aarav.saveskills);
  app.post("/api/getholidaylist", aarav.getholidaylist);
  app.post("/api/getholidaybydate", aarav.getholidaybydate);
  app.post("/api/updateholidaylist", aarav.saveholiday);
  app.post("/api/updateemployeeprojects", aarav.updateemployeeprojects);
  app.post("/api/updateleavesforemployee", aarav.updateleavesforemployee);
  app.post("/api/reupdateleavesforemployee", aarav.reupdateleaves);
  app.post("/api/getapprovetimesheet", aarav.gettimesheetformanager);
  app.post("/api/resetpassword", aarav.resetpassword);
  app.post("/api/forgetpassword", aarav.updateforgetpassword);
  // Retrieve all Customer
  app.get("/api/customers", aarav.findAll);
  // Retrieve a single Customer by Id
  app.get("/api/file/:filename", aarav.downloadFile);
  app.get("/api/getindex", aarav.getindex);
};
